const express = require('express');
const path = require('path');
const app = express();

// Serve all static files from the root directory
app.use(express.static(__dirname));

// Send all other requests to index.html (SPA routing fallback)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server (for local testing, though Vercel handles this via exports)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
