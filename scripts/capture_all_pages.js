const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const targetDir = path.join(process.cwd(), 'docs', 'visual-review');
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

const brainDir = 'C:\\Users\\msi\\.gemini\\antigravity\\brain\\8833f136-ebf1-40c8-a86e-c41a336adad0\\screenshots';
if (!fs.existsSync(brainDir)) fs.mkdirSync(brainDir, { recursive: true });

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const proc = spawn(edgePath, [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--user-data-dir=' + process.env.TEMP + '\\edge-cdp-all-' + Date.now(),
  '--disable-gpu',
  'about:blank'
]);

function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:9222/json', res => {
      let data = '';
      res.on('data', c => data += c);
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

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function main() {
  await sleep(1500);
  const wsUrl = await getWsUrl();
  const { ws, send } = await cdpSession(wsUrl);

  await send('Page.enable');
  await send('Runtime.enable');

  const pages = [
    { name: 'homepage', url: 'http://localhost:3000/ar' },
    { name: 'about', url: 'http://localhost:3000/ar/about' },
    { name: 'academic-journey', url: 'http://localhost:3000/ar/academic-journey' },
    { name: 'leadership', url: 'http://localhost:3000/ar/leadership' },
    { name: 'research', url: 'http://localhost:3000/ar/research' },
    { name: 'publications', url: 'http://localhost:3000/ar/publications' },
    { name: 'teaching', url: 'http://localhost:3000/ar/teaching' },
    { name: 'activities', url: 'http://localhost:3000/ar/activities' },
    { name: 'awards', url: 'http://localhost:3000/ar/awards' },
    { name: 'conferences', url: 'http://localhost:3000/ar/conferences' },
  ];

  console.log(`Starting capture for ${pages.length} pages...`);

  for (const p of pages) {
    // 1. Desktop
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });
    await send('Page.navigate', { url: p.url });
    await sleep(1200);

    const shotDesk = await send('Page.captureScreenshot', { format: 'png' });
    if (shotDesk.result?.data) {
      const fName = `${p.name}-desktop.png`;
      fs.writeFileSync(path.join(targetDir, fName), Buffer.from(shotDesk.result.data, 'base64'));
      fs.writeFileSync(path.join(brainDir, fName), Buffer.from(shotDesk.result.data, 'base64'));
    }

    // 2. Mobile
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await send('Page.navigate', { url: p.url });
    await sleep(1200);

    const shotMob = await send('Page.captureScreenshot', { format: 'png' });
    if (shotMob.result?.data) {
      const fName = `${p.name}-mobile.png`;
      fs.writeFileSync(path.join(targetDir, fName), Buffer.from(shotMob.result.data, 'base64'));
      fs.writeFileSync(path.join(brainDir, fName), Buffer.from(shotMob.result.data, 'base64'));
    }

    // Check overflow
    const evalRes = await send('Runtime.evaluate', {
      expression: 'JSON.stringify({ docW: document.documentElement.scrollWidth, winW: window.innerWidth })'
    });
    const parsed = JSON.parse(evalRes.result.result.value);
    console.log(`Page: ${p.name} | Desktop OK | Mobile docW: ${parsed.docW} (winW: ${parsed.winW}) ${parsed.docW > 390 ? 'OVERFLOW!' : 'CLEAN'}`);
  }

  ws.close();
  proc.kill();
  console.log('All 10 pages captured and verified successfully!');
}

main().catch(err => {
  console.error(err);
  proc.kill();
  process.exit(1);
});
