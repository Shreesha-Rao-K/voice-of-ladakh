const express = require('express');
const path = require('path');
const app = express();

const rootDir = __dirname;

// Serve static assets natively via Express
app.use(express.static(rootDir));

// SPA fallback
app.get('*', (req, res) => {
    res.sendFile(path.join(rootDir, 'index.html'));
});

module.exports = app;
