const fs = require('fs');
const path = require('path');
const http = require('http');

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

const handler = (req, res) => {
  try {
    let urlPath = req.url || '/';
    // Strip query string and hashes
    urlPath = urlPath.split('?')[0].split('#')[0];
    try {
      urlPath = decodeURIComponent(urlPath);
    } catch (e) {}

    if (urlPath === '/' || urlPath === '') {
      urlPath = '/index.html';
    }

    const baseDir = process.cwd();
    let targetPath = path.join(baseDir, urlPath);

    // Security check to prevent directory traversal
    if (!targetPath.startsWith(baseDir)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('403 Forbidden');
      return;
    }

    // Check directory -> index.html
    if (fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory()) {
      targetPath = path.join(targetPath, 'index.html');
    }

    // Check clean URLs (e.g. /about -> /about.html)
    if (!fs.existsSync(targetPath) && !path.extname(targetPath)) {
      if (fs.existsSync(targetPath + '.html')) {
        targetPath = targetPath + '.html';
      }
    }

    // If file does not exist, serve 404
    if (!fs.existsSync(targetPath) || fs.statSync(targetPath).isDirectory()) {
      const notFoundPage = path.join(baseDir, '404.html');
      if (fs.existsSync(notFoundPage)) {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(fs.readFileSync(notFoundPage));
        return;
      }
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(targetPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const isHtml = ext === '.html';
    const data = fs.readFileSync(targetPath);

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': isHtml ? 'public, max-age=0, must-revalidate' : 'public, max-age=31536000, immutable'
    });
    res.end(data);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Server Error: ' + err.message);
  }
};

// Export standard Vercel serverless function handler
module.exports = handler;

// If executed directly (e.g. node index.js or node server.js), start local server
if (require.main === module) {
  const PORT = process.env.PORT || 5500;
  const server = http.createServer(handler);
  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
  });
}
