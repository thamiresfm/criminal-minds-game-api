// Teste minimal Railway
const http = require('http');

const PORT = process.env.PORT || 3001;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    message: 'Railway test minimal',
    url: req.url,
    port: PORT,
    time: new Date().toISOString()
  }));
});

server.listen(PORT, () => {
  console.log(`Minimal server on port ${PORT}`);
});