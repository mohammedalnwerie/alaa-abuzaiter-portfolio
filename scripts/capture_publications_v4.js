// Captures the V4 publications page (EN/AR, desktop/mobile, filtered + dialog states) via Edge + CDP.
// Usage: node scripts/capture_publications_v4.js  (server must be running on :3000)
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
  const edge = spawn(EDGE, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--remote-debugging-port=9336', `--user-data-dir=${require('os').tmpdir()}/edge-pubs-${Date.now()}`, 'about:blank']);
  let t; for (let i = 0; i < 40; i++) { try { t = await getJSON('http://127.0.0.1:9336/json'); break; } catch { await sleep(250); } }
  const ws = new WebSocket(t.find((x) => x.type === 'page').webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0; const pend = new Map(); const errors = [];
  ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); } else if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.text); };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (ex) => (await send('Runtime.evaluate', { expression: ex, returnByValue: true, awaitPromise: true })).result.result?.value;
  const shot = async (name, full) => {
    let clip;
    if (full) { const h = await ev('document.documentElement.scrollHeight'); const w = await ev('innerWidth'); clip = { x: 0, y: 0, width: w, height: h, scale: 1 }; }
    const r = await send('Page.captureScreenshot', { format: 'png', ...(full ? { captureBeyondViewport: true, clip } : {}) });
    fs.writeFileSync(path.join(OUT, name + '.png'), Buffer.from(r.result.data, 'base64'));
  };
  const setInput = (v) => ev(`(()=>{const i=document.querySelector('#pub-search');const s=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;s.call(i,${JSON.stringify(v)});i.dispatchEvent(new Event('input',{bubbles:true}));})()`);
  await send('Page.enable'); await send('Runtime.enable');
  const report = [];
  for (const loc of ['en', 'ar']) {
    for (const v of [{ n: 'desktop', w: 1440, h: 900, m: false }, { n: 'mobile', w: 390, h: 844, m: true }]) {
      await send('Emulation.setDeviceMetricsOverride', { width: v.w, height: v.h, deviceScaleFactor: 1, mobile: v.m });
      await send('Page.navigate', { url: `http://localhost:3000/${loc}/publications` }); await sleep(2500);
      report.push({ loc, v: v.n, sw: await ev('document.documentElement.scrollWidth'), cw: await ev('document.documentElement.clientWidth'), articles: await ev('document.querySelectorAll("article").length') });
      await shot(`pubs-${loc}-${v.n}-full`, true);
    }
    // filtered state: year 2016 + search
    await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    await send('Page.navigate', { url: `http://localhost:3000/${loc}/publications` }); await sleep(2000);
    await ev(`[...document.querySelectorAll('[aria-labelledby="year-filter-label"] button')].find(b=>b.getAttribute('aria-label').startsWith('2016')).click()`); await sleep(300);
    const y2016 = await ev('document.querySelectorAll("article").length');
    await setInput('SMA'); await sleep(300);
    const smaIn2016 = await ev('document.querySelectorAll("article").length');
    await ev(`document.querySelector('#pub-search').scrollIntoView({block:'start'}); scrollBy(0,-100)`); await sleep(300);
    await shot(`pubs-${loc}-filtered`);
    await setInput('zzzz'); await sleep(300);
    const empty = await ev('document.querySelectorAll("article").length');
    await shot(`pubs-${loc}-empty`);
    await setInput(''); await ev(`[...document.querySelectorAll('button')].find(b=>b.textContent.includes('${loc === 'ar' ? 'عرض كل السنوات' : 'Show all years'}')).click()`); await sleep(300);
    await ev(`document.querySelector('article button[aria-expanded]').click()`); await sleep(200);
    const absOpen = await ev(`!document.querySelector('article p[id^="abs-"]').hidden`);
    await ev(`[...document.querySelectorAll('article button')].find(b=>!b.hasAttribute('aria-expanded')).click()`); await sleep(400);
    const dlg = await ev(`!!document.querySelector('[role=dialog]') && document.activeElement.getAttribute('aria-label')`);
    await shot(`pubs-${loc}-cite-dialog`);
    await ev(`document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}))`); await sleep(200);
    const closed = await ev(`!document.querySelector('[role=dialog]') && document.activeElement.tagName`);
    report.push({ loc, y2016, smaIn2016, empty, absOpen, dialogFocus: dlg, afterEscFocus: closed });
  }
  console.log(JSON.stringify(report), '\nerrors:', JSON.stringify(errors));
  ws.close(); edge.kill(); process.exit(0);
})();
