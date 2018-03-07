const http = require('http');
http.createServer((req, res) => {
  setTimeout(() => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
  }, 1000);
}).listen(8081, () => {
  console.log('Server running at http://localhost:8081/');
});
