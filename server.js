const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5500;
const BASE_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.pdf': 'application/pdf'
};

const requestHandler = (req, res) => {
  let decodedPath = '/';
  try {
    decodedPath = decodeURIComponent(new URL(req.url, `http://localhost:${PORT}`).pathname);
  } catch (e) {
    decodedPath = req.url;
  }

  let filePath = path.join(BASE_DIR, decodedPath);

  // Security check to prevent directory traversal
  if (!filePath.startsWith(BASE_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden');
    return;
  }

  // Handle clean URLs (e.g. /about -> /about.html)
  if (!path.extname(filePath)) {
    const htmlCandidate = filePath + '.html';
    if (fs.existsSync(htmlCandidate)) {
      filePath = htmlCandidate;
    }
  }

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          const notFoundPath = path.join(BASE_DIR, '404.html');
          if (fs.existsSync(notFoundPath)) {
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(fs.readFileSync(notFoundPath));
            return;
          }
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('404 Not Found');
        } else {
          res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end(`500 Internal Server Error: ${err.code}`);
        }
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      const isHtml = ext === '.html';
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': isHtml ? 'public, max-age=0, must-revalidate' : 'public, max-age=31536000, immutable'
      });
      res.end(data);
    });
  });
};

const server = http.createServer(requestHandler);

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

module.exports = server;
