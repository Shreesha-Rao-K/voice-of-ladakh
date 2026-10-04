const express = require('express');
const path = require('path');

const app = express();
const rootDir = __dirname;

// Disable x-powered-by header
app.disable('x-powered-by');

// Security headers middleware
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
    next();
});

// Serve static assets with caching
app.use(express.static(rootDir, {
    maxAge: '1d',
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache, must-revalidate');
        } else {
            res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
        }
    }
}));

// SPA fallback for all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(rootDir, 'index.html'));
});

// Local development server listener
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Voice of Ladakh server active at http://localhost:${PORT}`);
    });
}

module.exports = app;
