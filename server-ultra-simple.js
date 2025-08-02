// Ultra simple server for Railway debug
require('http').createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Railway test OK - Port: ' + (process.env.PORT || 3001));
}).listen(process.env.PORT || 3001, () => {
  console.log('Ultra simple server running on port', process.env.PORT || 3001);
});