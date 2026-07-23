const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, 'dist');
if (!fs.existsSync(dist)) fs.mkdirSync(dist);

// Copy static files
const files = ['index.html', 'style.css', 'script.js', 'favicon.svg'];
for (const file of files) {
    if (fs.existsSync(file)) {
        fs.copyFileSync(file, path.join(dist, file));
    }
}

// Copy src directory
const srcDir = path.join(__dirname, 'src');
const distSrc = path.join(dist, 'src');
if (!fs.existsSync(distSrc)) fs.mkdirSync(distSrc);

if (fs.existsSync(srcDir)) {
    const images = fs.readdirSync(srcDir);
    for (const img of images) {
        fs.copyFileSync(path.join(srcDir, img), path.join(distSrc, img));
    }
}

console.log('Build complete. Files copied to dist/. Vercel will now deploy this static output.');
