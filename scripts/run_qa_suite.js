const http = require('http');
const fs = require('fs');
const path = require('path');

const screenshotDir = path.join(process.cwd(), 'docs', 'screenshots');
if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

async function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:9222/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const list = JSON.parse(data);
        const page = list.find(t => t.type === 'page');
        if (page) resolve(page.webSocketDebuggerUrl);
        else reject(new Error('No page target found'));
      });
    }).on('error', reject);
  });
}

function cdpSession(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 1;
  const callbacks = new Map();

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && callbacks.has(msg.id)) {
      const cb = callbacks.get(msg.id);
      callbacks.delete(msg.id);
      cb(msg);
    }
  };

  const send = (method, params = {}) => {
    return new Promise((resolve) => {
      const currentId = id++;
      callbacks.set(currentId, resolve);
      ws.send(JSON.stringify({ id: currentId, method, params }));
    });
  };

  return new Promise((resolve) => {
    ws.onopen = () => resolve({ ws, send });
  });
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  console.log('Connecting to Edge CDP...');
  const wsUrl = await getWsUrl();
  const { ws, send } = await cdpSession(wsUrl);

  console.log('Enabling Page and Runtime...');
  await send('Page.enable');
  await send('Runtime.enable');

  const pages = [
    { name: 'home', url: 'http://localhost:3000/ar' },
    { name: 'publications', url: 'http://localhost:3000/ar/publications' },
    { name: 'leadership', url: 'http://localhost:3000/ar/leadership' },
    { name: 'journey', url: 'http://localhost:3000/ar/academic-journey' },
    { name: 'teaching', url: 'http://localhost:3000/ar/teaching' }
  ];

  const viewports = [
    { type: 'desktop', width: 1280, height: 900, mobile: false, scale: 1 },
    { type: 'mobile', width: 390, height: 844, mobile: true, scale: 2 }
  ];

  for (const p of pages) {
    for (const v of viewports) {
      console.log(`Rendering ${p.name} on ${v.type} (${v.width}x${v.height})...`);
      
      // Override metrics
      await send('Emulation.setDeviceMetricsOverride', {
        width: v.width,
        height: v.height,
        deviceScaleFactor: v.scale,
        mobile: v.mobile
      });

      // Navigate
      await send('Page.navigate', { url: p.url });
      await sleep(1200);

      // Check overflow
      const overflowEval = await send('Runtime.evaluate', {
        expression: `({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2
        })`,
        returnByValue: true
      });
      const ov = overflowEval.result?.result?.value;
      console.log(`  Overflow check: scrollWidth=${ov?.scrollWidth}, clientWidth=${ov?.clientWidth}, hasOverflow=${ov?.hasOverflow}`);

      // Capture screenshot
      const shot = await send('Page.captureScreenshot', { format: 'png' });
      if (shot.result?.data) {
        const filePath = path.join(screenshotDir, `${p.name}-${v.type}.png`);
        fs.writeFileSync(filePath, Buffer.from(shot.result.data, 'base64'));
        console.log(`  Saved screenshot: ${filePath}`);
      }
    }
  }

  // Test interactive features on publications page:
  console.log('\n--- Testing Interactive Features on Publications Library ---');
  await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, mobile: false, deviceScaleFactor: 1 });
  await send('Page.navigate', { url: 'http://localhost:3000/ar/publications' });
  await sleep(1000);

  // 1. Search test
  const searchTest = await send('Runtime.evaluate', {
    expression: `(() => {
      const input = document.querySelector('input[type="text"]');
      if (!input) return { error: 'Search input not found' };
      input.value = 'Sensors';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      return { success: true };
    })()`,
    returnByValue: true
  });
  console.log('Search input test:', searchTest.result?.result?.value);
  await sleep(400);

  const searchResultsCount = await send('Runtime.evaluate', {
    expression: `document.querySelectorAll('article').length`,
    returnByValue: true
  });
  console.log('Articles visible after searching "Sensors":', searchResultsCount.result?.result?.value);

  // 2. Clear search & test Filter button click
  await send('Runtime.evaluate', {
    expression: `(() => {
      const input = document.querySelector('input[type="text"]');
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      // Click 'المجلات العلمية' button
      const buttons = Array.from(document.querySelectorAll('button'));
      const journalBtn = buttons.find(b => b.textContent.includes('المجلات العلمية'));
      if (journalBtn) journalBtn.click();
      return { clicked: !!journalBtn };
    })()`,
    returnByValue: true
  });
  await sleep(400);

  const journalResultsCount = await send('Runtime.evaluate', {
    expression: `document.querySelectorAll('article').length`,
    returnByValue: true
  });
  console.log('Articles visible after clicking "المجلات العلمية (11)":', journalResultsCount.result?.result?.value);

  // 3. Test citation button
  const citationModalTest = await send('Runtime.evaluate', {
    expression: `(() => {
      const citeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('نسخ الاقتباس'));
      if (citeBtn) citeBtn.click();
      return { citeBtnFound: !!citeBtn };
    })()`,
    returnByValue: true
  });
  await sleep(400);
  const isModalOpen = await send('Runtime.evaluate', {
    expression: `document.body.innerText.includes('APA 7th Edition') && document.body.innerText.includes('BibTeX')`,
    returnByValue: true
  });
  console.log('Citation Drawer / Modal rendered BibTeX and APA:', isModalOpen.result?.result?.value);

  // 4. Test English route
  await send('Page.navigate', { url: 'http://localhost:3000/en' });
  await sleep(800);
  const enDir = await send('Runtime.evaluate', {
    expression: `document.documentElement.dir === 'ltr' && document.documentElement.lang === 'en'`,
    returnByValue: true
  });
  console.log('English route has dir=ltr and lang=en:', enDir.result?.result?.value);

  // 5. Test Arabic route
  await send('Page.navigate', { url: 'http://localhost:3000/ar' });
  await sleep(800);
  const arDir = await send('Runtime.evaluate', {
    expression: `document.documentElement.dir === 'rtl' && document.documentElement.lang === 'ar'`,
    returnByValue: true
  });
  console.log('Arabic route has dir=rtl and lang=ar:', arDir.result?.result?.value);

  ws.close();
  console.log('\nQA Suite completed successfully!');
}

run().catch(err => {
  console.error('QA Runner error:', err);
  process.exit(1);
});
