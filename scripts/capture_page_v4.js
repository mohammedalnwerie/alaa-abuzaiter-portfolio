// Full-page captures of any route (EN/AR × desktop/mobile) via Edge + CDP device emulation.
// Usage: node scripts/capture_page_v4.js <route> [prefix]   e.g. node scripts/capture_page_v4.js research
// Server must be running on :3000. Output: docs/visual-review/v4/<prefix>-<loc>-<view>-full.png
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const route = (process.argv[2] || '').replace(/^\/+/, '');
const prefix = process.argv[3] || route || 'home';
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const OUT = path.join(process.cwd(), 'docs', 'visual-review', 'v4');
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const getJSON = (u) => new Promise((res, rej) => http.get(u, (r) => { let d = ''; r.on('data', (c) => (d += c)); r.on('end', () => res(JSON.parse(d))); }).on('error', rej));
(async () => {
  const port = 9340 + Math.floor(Math.random() * 50);
  const edge = spawn(EDGE, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${port}`, `--user-data-dir=${require('os').tmpdir()}/edge-page-${Date.now()}`, 'about:blank']);
  let t; for (let i = 0; i < 40; i++) { try { t = await getJSON(`http://127.0.0.1:${port}/json`); break; } catch { await sleep(250); } }
  const ws = new WebSocket(t.find((x) => x.type === 'page').webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0; const pend = new Map(); const errors = [];
  ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); } else if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.text); };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (ex) => (await send('Runtime.evaluate', { expression: ex, returnByValue: true, awaitPromise: true })).result.result?.value;
  await send('Page.enable'); await send('Runtime.enable');
  const report = [];
  for (const loc of ['en', 'ar']) {
    for (const v of [{ n: 'desktop', w: 1440, h: 900, m: false }, { n: 'mobile', w: 390, h: 844, m: true }]) {
      await send('Emulation.setDeviceMetricsOverride', { width: v.w, height: v.h, deviceScaleFactor: 1, mobile: v.m });
      await send('Page.navigate', { url: `http://localhost:3000/${loc}${route ? '/' + route : ''}` }); await sleep(2500);
      await ev(`(async()=>{for(let y=0;y<=document.body.scrollHeight;y+=400){scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,50));}await new Promise(r=>setTimeout(r,500));scrollTo({top:0,behavior:'instant'});})()`);
      await sleep(800);
      const info = JSON.parse(await ev(`JSON.stringify({h:document.documentElement.scrollHeight,sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,dir:document.documentElement.dir,brokenAnchors:[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href').slice(1)).filter(h=>h&&!document.getElementById(h))})`));
      report.push({ loc, view: v.n, ...info });
      const r = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width: v.w, height: info.h, scale: 1 } });
      fs.writeFileSync(path.join(OUT, `${prefix}-${loc}-${v.n}-full.png`), Buffer.from(r.result.data, 'base64'));
    }
  }
  console.log(JSON.stringify(report), '\nerrors:', JSON.stringify(errors));
  ws.close(); edge.kill(); process.exit(0);
})();
