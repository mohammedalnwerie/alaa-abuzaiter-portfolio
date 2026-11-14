const http = require('http');

http.get('http://localhost:9222/json', (res) => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    const list = JSON.parse(body);
    const target = list.find(t => t.url.includes('3000'));
    if (!target) {
      console.log('Target not found', list);
      process.exit(1);
    }
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    ws.onopen = () => {
      ws.send(JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: {
          expression: `
            (() => {
              const docWidth = document.documentElement.scrollWidth;
              const bodyWidth = document.body.scrollWidth;
              const winWidth = window.innerWidth;
              const overflowing = [];
              document.querySelectorAll('*').forEach(el => {
                if (el.scrollWidth > winWidth + 5) {
                  overflowing.push({ tag: el.tagName, id: el.id, class: (el.className || '').toString().slice(0, 50), scrollWidth: el.scrollWidth });
                }
              });
              return JSON.stringify({ docWidth, bodyWidth, winWidth, overflowing: overflowing.slice(0, 10) });
            })()
          `
        }
      }));
    };
    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.id === 1) {
        console.log('DOM Evaluation Result:\n', data.result.result.value);
        ws.close();
        process.exit(0);
      }
    };
  });
}).on('error', err => {
  console.log('HTTP Err:', err.message);
  process.exit(1);
});
