const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// Plesk Passenger ortamında NODE_ENV otomatik olarak 'production' gelir
const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
// Passenger genellikle portu process.env.PORT üzerinden iletir
const port = process.env.PORT || 3000;

// Next.js uygulamasını başlatıyoruz
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  })
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
