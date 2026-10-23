const { spawn } = require('child_process');

const edge = spawn('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', [
  '--headless',
  '--remote-debugging-port=9222',
  '--window-size=390,844',
  'file:///C:/dev/chayil/index.html'
]);

setTimeout(async () => {
  try {
    const listRes = await fetch('http://127.0.0.1:9222/json');
    const tabs = await listRes.json();
    const pageTab = tabs.find(t => t.type === 'page') || tabs[0];
    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
    ws.addEventListener('open', () => {
      ws.send(JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: {
          expression: `(() => {
            const inner = document.querySelector('.header-inner');
            const actions = document.querySelector('.header-actions');
            const toggle = document.querySelector('#mobileMenuToggle');
            const logo = document.querySelector('.site-logo');
            return JSON.stringify({
              innerWidth: window.innerWidth,
              bodyScrollWidth: document.body.scrollWidth,
              headerInner: inner ? inner.getBoundingClientRect() : null,
              toggle: toggle ? toggle.getBoundingClientRect() : null,
              logo: logo ? logo.getBoundingClientRect() : null,
              actions: actions ? actions.getBoundingClientRect() : null,
              actionButtons: actions ? Array.from(actions.children).map(c => ({
                tag: c.tagName,
                cls: c.className,
                rect: c.getBoundingClientRect()
              })) : []
            });
          })()`
        }
      }));
    });
    ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 1) {
        console.log('Result:', msg.result.result.value);
        edge.kill();
        process.exit(0);
      }
    });
  } catch (err) {
    console.error(err);
    edge.kill();
  }
}, 1500);
