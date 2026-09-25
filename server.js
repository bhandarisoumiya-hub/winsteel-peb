const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;
const DB_FILE = path.join(ROOT_DIR, 'database', 'db.json');
const DATA_FILE = path.join(ROOT_DIR, 'data', 'winsteel.json');

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.pdf': 'application/pdf'
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // API Route: Save Database Directly to Disk
  if (req.method === 'POST' && pathname === '/api/save-database') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        if (!parsed.products || !Array.isArray(parsed.products)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Invalid database payload' }));
        }

        // 1. Write to database/db.json
        fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), 'utf8');

        // 2. Write to data/winsteel.json
        fs.writeFileSync(DATA_FILE, JSON.stringify(parsed, null, 2), 'utf8');

        console.log(`✅ [Server] Successfully saved ${parsed.products.length} products to database/db.json and data/winsteel.json!`);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Database updated on disk successfully!' }));
      } catch (err) {
        console.error('❌ [Server] Failed to save database:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Handle Root and Clean URLs
  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  } else if (pathname === '/admin' || pathname === '/admin/') {
    pathname = '/admin/index.html';
  }

  let filePath = path.join(ROOT_DIR, pathname);

  // If path doesn't have an extension, try appending .html
  if (!path.extname(filePath)) {
    if (fs.existsSync(filePath + '.html')) {
      filePath = filePath + '.html';
    } else if (fs.existsSync(path.join(filePath, 'index.html'))) {
      filePath = path.join(filePath, 'index.html');
    }
  }

  // Check if file exists
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    const errorPage = path.join(ROOT_DIR, '404.html');
    if (fs.existsSync(errorPage)) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
      fs.createReadStream(errorPage).pipe(res);
      return;
    }
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('404 Not Found');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  res.writeHead(200, {
    'Content-Type': contentType,
    'Cache-Control': ext === '.json' ? 'no-cache, must-revalidate' : 'public, max-age=3600'
  });

  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`\n🚀 Winsteel Local Server running at: http://localhost:${PORT}`);
  console.log(`🌐 Public Website: http://localhost:${PORT}/index.html`);
  console.log(`🔐 Admin Panel:   http://localhost:${PORT}/admin/index.html\n`);
});
