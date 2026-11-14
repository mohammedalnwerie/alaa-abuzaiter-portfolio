// Captures the V4 homepage (EN/AR × desktop/mobile) via Edge + CDP device emulation.
// Usage: node scripts/capture_home_v4.js  (server must be running on :3000)
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const OUT = path.join(process.cwd(), 'docs', 'visual-review', 'v4');
fs.mkdirSync(OUT, { recursive: true });
const PORT = 9333;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function getJSON(url) {
  return new Promise((res, rej) => http.get(url, (r) => { let d = ''; r.on('data', (c) => (d += c)); r.on('end', () => res(JSON.parse(d))); }).on('error', rej));
}

(async () => {
  const userDir = path.join(require('os').tmpdir(), 'edge-cap-' + Date.now());
  const edge = spawn(EDGE, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${PORT}`, `--user-data-dir=${userDir}`, 'about:blank']);
  let targets;
  for (let i = 0; i < 40; i++) { try { targets = await getJSON(`http://127.0.0.1:${PORT}/json`); break; } catch { await sleep(250); } }
  const page = targets.find((t) => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0; const pending = new Map();
  ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  await send('Page.enable'); await send('Runtime.enable');

  const shots = [
    { name: 'desktop', w: 1440, h: 900, mobile: false, dpr: 1 },
    { name: 'mobile', w: 390, h: 844, mobile: true, dpr: 2 },
  ];
  const report = [];
  for (const loc of ['en', 'ar']) {
    for (const s of shots) {
      await send('Emulation.setDeviceMetricsOverride', { width: s.w, height: s.h, deviceScaleFactor: s.dpr, mobile: s.mobile });
      await send('Page.navigate', { url: `http://localhost:3000/${loc}` });
      await sleep(3500); // let the load sequence finish
      // first viewport (above the fold) after animations
      let r = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(OUT, `home-${loc}-${s.name}-fold.png`), Buffer.from(r.result.data, 'base64'));
      // scroll through so every reveal fires, then full page
      await send('Runtime.evaluate', { expression: `(async()=>{for(let y=0;y<document.body.scrollHeight;y+=400){scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,60));}scrollTo({top:document.body.scrollHeight,behavior:'instant'});await new Promise(r=>setTimeout(r,600));scrollTo({top:0,behavior:'instant'});})()`, awaitPromise: true });
      await sleep(1500);
      const m = await send('Runtime.evaluate', { expression: `JSON.stringify({h:document.documentElement.scrollHeight,sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,dir:document.documentElement.dir,lang:document.documentElement.lang,hidden:document.querySelectorAll('.reveal-on [data-reveal]:not(.is-in)').length})`, returnByValue: true });
      const info = JSON.parse(m.result.result.value);
      report.push({ loc, view: s.name, ...info });
      r = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width: s.w, height: info.h, scale: s.mobile ? 1 : 1 } });
      fs.writeFileSync(path.join(OUT, `home-${loc}-${s.name}-full.png`), Buffer.from(r.result.data, 'base64'));
    }
  }
  console.log(JSON.stringify(report, null, 1));
  ws.close(); edge.kill();
  process.exit(0);
})();
