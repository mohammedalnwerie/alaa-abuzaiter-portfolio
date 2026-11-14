const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const proc = spawn(edgePath, [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--user-data-dir=' + process.env.TEMP + '\\edge-cdp-diag-' + Date.now(),
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

  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });

  await send('Page.navigate', { url: 'http://localhost:3000/ar' });
  await sleep(2000);

  const evalRes = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const docW = document.documentElement.scrollWidth;
        const bodyW = document.body.scrollWidth;
        const winW = window.innerWidth;
        const overflowing = [];

        document.querySelectorAll('*').forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.width > 390.5 || rect.right > 390.5 || rect.left < -0.5 || el.scrollWidth > 390.5) {
            overflowing.push({
              tag: el.tagName,
              id: el.id,
              className: (el.className || '').toString().slice(0, 70),
              rect: { left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) },
              scrollWidth: el.scrollWidth,
              textSnippet: (el.innerText || '').slice(0, 40).replace(/\\n/g, ' ')
            });
          }
        });

        return JSON.stringify({
          docW,
          bodyW,
          winW,
          count: overflowing.length,
          samples: overflowing.slice(0, 15)
        }, null, 2);
      })()
    `
  });

  console.log('--- Overflow Inspection Result ---');
  console.log(evalRes.result.result.value);

  // Take screenshot with Page.captureScreenshot
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  if (shot.result?.data) {
    const shotPath = path.join(process.cwd(), 'docs', 'visual-review', 'homepage-mobile.png');
    const brainPath = 'C:\\Users\\msi\\.gemini\\antigravity\\brain\\8833f136-ebf1-40c8-a86e-c41a336adad0\\screenshots\\homepage-mobile.png';
    fs.writeFileSync(shotPath, Buffer.from(shot.result.data, 'base64'));
    fs.writeFileSync(brainPath, Buffer.from(shot.result.data, 'base64'));
    console.log('Saved corrected homepage-mobile.png via CDP');
  }

  ws.close();
  proc.kill();
}

main().catch(err => {
  console.error(err);
  proc.kill();
  process.exit(1);
});
