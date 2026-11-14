// Captures the V4 shell (navbar, dropdown, mobile drawer, footer) via Edge + CDP.
// Usage: node scripts/capture_shell_v4.js  (server must be running on :3000)
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const OUT = path.join(process.cwd(), 'docs', 'visual-review', 'v4');
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const getJSON = (u) => new Promise((res, rej) => http.get(u, (r) => { let d = ''; r.on('data', (c) => (d += c)); r.on('end', () => res(JSON.parse(d))); }).on('error', rej));

(async () => {
  const edge = spawn(EDGE, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--remote-debugging-port=9335', `--user-data-dir=${require('os').tmpdir()}/edge-shell-${Date.now()}`, 'about:blank']);
  let t; for (let i = 0; i < 40; i++) { try { t = await getJSON('http://127.0.0.1:9335/json'); break; } catch { await sleep(250); } }
  const ws = new WebSocket(t.find((x) => x.type === 'page').webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0; const pend = new Map(); const errors = [];
  ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); } else if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.text); };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (ex) => (await send('Runtime.evaluate', { expression: ex, returnByValue: true, awaitPromise: true })).result.result?.value;
  const shot = async (name) => { const r = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(OUT, name + '.png'), Buffer.from(r.result.data, 'base64')); };
  const go = async (url, w, h, mobile) => { await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile }); await send('Page.navigate', { url }); await sleep(2500); };
  await send('Page.enable'); await send('Runtime.enable');
  const report = [];
  const metrics = `JSON.stringify({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,navH:document.querySelector('header').offsetHeight,navRow:[...document.querySelectorAll('header nav[aria-label] > ul > li')].map(l=>Math.round(l.getBoundingClientRect().top)).filter((v,i,a)=>a.indexOf(v)===i).length})`;

  for (const loc of ['en', 'ar']) {
    for (const w of [1280, 1440]) {
      await go(`http://localhost:3000/${loc}`, w, 900, false);
      report.push({ loc, w, ...JSON.parse(await ev(metrics)) });
      await shot(`shell-${loc}-nav-${w}`);
    }
    // dropdown open
    await ev(`document.querySelector('[aria-controls="nav-research"]').click()`); await sleep(400);
    await shot(`shell-${loc}-dropdown`);
    // inner page
    await go(`http://localhost:3000/${loc}/publications`, 1440, 900, false);
    await shot(`shell-${loc}-inner-publications`);
    // footer
    await ev(`scrollTo({top:document.body.scrollHeight,behavior:'instant'})`); await sleep(600);
    await shot(`shell-${loc}-footer-desktop`);
    // mobile closed + open
    await go(`http://localhost:3000/${loc}`, 390, 844, true);
    report.push({ loc, w: 390, ...JSON.parse(await ev(metrics)) });
    await shot(`shell-${loc}-mobile-header`);
    await ev(`document.querySelector('[aria-controls="mobile-nav"]').click()`); await sleep(400);
    report.push({ loc, w: 390, drawerOpen: await ev(`!document.getElementById('mobile-nav').hidden`), bodyLocked: await ev(`document.body.style.overflow`) });
    await shot(`shell-${loc}-mobile-menu`);
    await ev(`document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}))`); await sleep(200);
    report.push({ loc, escClosed: await ev(`document.getElementById('mobile-nav').hidden`) });
    await ev(`scrollTo({top:document.body.scrollHeight,behavior:'instant'})`); await sleep(600);
    await shot(`shell-${loc}-footer-mobile`);
  }
  console.log(JSON.stringify(report), '\nerrors:', JSON.stringify(errors));
  ws.close(); edge.kill(); process.exit(0);
})();
