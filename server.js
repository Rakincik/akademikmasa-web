const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const app = next({ dev: false, hostname: 'localhost', port: 3090 });
const handle = app.getRequestHandler();
app.prepare().then(() => {
  // Arka planda Shopier Otomatik Senkronizasyon İşçisini başlat (10 dakikada bir çalışır)
  require('./src/workers/shopier-sync-worker.js')();

  createServer(async (req, res) => {
    try {
      if (req.headers['origin'] && req.headers['origin'].includes(',')) req.headers['origin'] = req.headers['origin'].split(',')[0].trim();
      if (req.headers['referer'] && req.headers['referer'].includes(',')) req.headers['referer'] = req.headers['referer'].split(',')[0].trim();
      if (req.headers['x-forwarded-host'] && req.headers['x-forwarded-host'].includes(',')) req.headers['x-forwarded-host'] = req.headers['x-forwarded-host'].split(',')[0].trim();
      if (req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'].includes(',')) req.headers['x-forwarded-proto'] = req.headers['x-forwarded-proto'].split(',')[0].trim();
      await handle(req, res, parse(req.url, true));
    } catch (err) { res.statusCode = 500; res.end('Error'); }
  }).listen(3090);
});
