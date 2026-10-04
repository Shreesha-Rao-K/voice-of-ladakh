const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const rootDir = __dirname;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.json': 'application/json; charset=utf-8',
    '.xml': 'application/xml; charset=utf-8',
    '.txt': 'text/plain; charset=utf-8',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    // Basic security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');

    // Parse sanitized safe path
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    let safePath = path.normalize(decodeURIComponent(parsedUrl.pathname)).replace(/^(\.\.[/\\])+/, '');
    
    let targetFile = path.join(rootDir, safePath === '/' ? 'index.html' : safePath);

    // Prevent directory traversal outside rootDir
    if (!targetFile.startsWith(rootDir)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        return res.end('403 Forbidden');
    }

    fs.stat(targetFile, (err, stats) => {
        if (err || !stats.isFile()) {
            // SPA fallback to index.html
            targetFile = path.join(rootDir, 'index.html');
        }

        const ext = path.extname(targetFile).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        // Cache-control headers
        if (ext === '.html') {
            res.setHeader('Cache-Control', 'no-cache, must-revalidate');
        } else {
            res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
        }

        res.writeHead(200, { 'Content-Type': contentType });
        const stream = fs.createReadStream(targetFile);
        stream.pipe(res);
        stream.on('error', () => {
            if (!res.headersSent) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
            }
            res.end('500 Internal Server Error');
        });
    });
});

const PORT = Number(process.env.PORT ?? 3000);
server.listen(PORT, () => {
    console.log(`Voice of Ladakh server active at http://localhost:${PORT}`);
});

module.exports = server;
