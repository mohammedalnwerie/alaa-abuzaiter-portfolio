const http = require('http');
const fs = require('fs');
const path = require('path');

const targetDir = path.join(process.cwd(), 'docs', 'visual-review');
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

const brainDir = 'C:\\Users\\msi\\.gemini\\antigravity\\brain\\8833f136-ebf1-40c8-a86e-c41a336adad0\\screenshots';
if (!fs.existsSync(brainDir)) fs.mkdirSync(brainDir, { recursive: true });

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

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function run() {
  console.log('Connecting to Edge headless on 9222...');
  const wsUrl = await getWsUrl();
  const { ws, send } = await cdpSession(wsUrl);

  await send('Page.enable');
  await send('Runtime.enable');

  const pages = [
    { name: 'homepage', url: 'http://localhost:3000/ar' },
    { name: 'publications', url: 'http://localhost:3000/ar/publications' },
    { name: 'leadership', url: 'http://localhost:3000/ar/leadership' },
    { name: 'academic-journey', url: 'http://localhost:3000/ar/academic-journey' },
    { name: 'teaching', url: 'http://localhost:3000/ar/teaching' },
  ];

  const viewports = [
    { type: 'desktop', width: 1280, height: 900, mobile: false, scale: 1 },
    { type: 'mobile', width: 390, height: 844, mobile: true, scale: 2 },
  ];

  for (const p of pages) {
    for (const v of viewports) {
      console.log(`Capturing ${p.name}-${v.type} (${v.width}x${v.height})...`);
      
      await send('Emulation.setDeviceMetricsOverride', {
        width: v.width,
        height: v.height,
        deviceScaleFactor: v.scale,
        mobile: v.mobile
      });

      await send('Page.navigate', { url: p.url });
      await sleep(1500);

      const shot = await send('Page.captureScreenshot', { format: 'png' });
      if (shot.result?.data) {
        const fileName = `${p.name}-${v.type}.png`;
        const filePath = path.join(targetDir, fileName);
        fs.writeFileSync(filePath, Buffer.from(shot.result.data, 'base64'));

        // Copy to brain artifact directory as well
        fs.writeFileSync(path.join(brainDir, fileName), Buffer.from(shot.result.data, 'base64'));
        console.log(`Saved ${fileName} (${fs.statSync(filePath).size} bytes)`);
      }
    }
  }

  ws.close();
  console.log('All visual review screenshots captured successfully!');
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
