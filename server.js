// Delegate to index.js
module.exports = require('./index.js');

if (require.main === module) {
  const http = require('http');
  const PORT = process.env.PORT || 5500;
  const server = http.createServer(module.exports);
  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
  });
}
