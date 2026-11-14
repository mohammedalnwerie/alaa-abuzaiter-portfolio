const http = require('http');

http.get('http://localhost:9222/json', (res) => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', async () => {
    const list = JSON.parse(body);
    const page = list.find(t => t.type === 'page');
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    ws.onopen = async () => {
      const send = (method, params = {}) => new Promise(r => {
        const id = Math.floor(Math.random() * 100000);
        const handler = (m) => {
          const res = JSON.parse(m.data);
          if (res.id === id) { ws.removeEventListener('message', handler); r(res); }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });

      await send('Page.enable');
      await send('Runtime.enable');
      await send('Page.navigate', { url: 'http://localhost:3000/ar/publications' });
      // wait for hydration: setting the input before React attaches is silently ignored
      await new Promise(r => setTimeout(r, 3500));

      // Test React input change
      await send('Runtime.evaluate', {
        expression: `(() => {
          const input = document.querySelector('input[type="text"]');
          const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
          setter.call(input, 'Sensors');
          input.dispatchEvent(new Event('input', { bubbles: true }));
        })()`,
        returnByValue: true
      });

      await new Promise(r => setTimeout(r, 500));

      const count = await send('Runtime.evaluate', {
        expression: 'document.querySelectorAll("article").length',
        returnByValue: true
      });
      console.log('Filtered articles count with React setter:', count.result.result.value);

      // Now test typing "Stewart"
      await send('Runtime.evaluate', {
        expression: `(() => {
          const input = document.querySelector('input[type="text"]');
          const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
          setter.call(input, 'Stewart');
          input.dispatchEvent(new Event('input', { bubbles: true }));
        })()`,
        returnByValue: true
      });
      await new Promise(r => setTimeout(r, 500));

      const countStewart = await send('Runtime.evaluate', {
        expression: 'document.querySelectorAll("article").length',
        returnByValue: true
      });
      console.log('Filtered articles count for "Stewart":', countStewart.result.result.value);

      ws.close();
      process.exit(0);
    };
  });
});
