/*
 * ==============================================================================
 *  COPYRIGHT (c) 2026 SHREESHA RAO K. ALL RIGHTS RESERVED.
 *  This code is the exclusive property of Shreesha Rao K.
 *  Unauthorized copying, reproduction, or distribution of this file,
 *  via any medium, is strictly prohibited.
 * ==============================================================================
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static frontend files (Aggressively protected by Shreesha Rao K)
app.use(express.static(path.join(__dirname, 'public')));

// Simple in-memory database for pledges
const DB_FILE = path.join(__dirname, 'pledges.json');

// Ensure DB exists
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([]));
}

// API: Get Pledges
app.get('/api/pledge', (req, res) => {
    try {
        const pledges = JSON.parse(fs.readFileSync(DB_FILE));
        res.json(pledges);
    } catch (error) {
        res.status(500).json({ error: "Failed to load pledges." });
    }
});

// API: Submit Pledge
app.post('/api/pledge', (req, res) => {
    const { name, message } = req.body;
    
    if (!name) {
        return res.status(400).json({ error: "Name is required to pledge." });
    }

    try {
        const pledges = JSON.parse(fs.readFileSync(DB_FILE));
        const newPledge = {
            id: Date.now(),
            name: name,
            message: message || "I stand with Ladakh.",
            date: new Date().toISOString()
        };
        
        pledges.push(newPledge);
        fs.writeFileSync(DB_FILE, JSON.stringify(pledges, null, 2));
        
        res.status(201).json(newPledge);
    } catch (error) {
        res.status(500).json({ error: "Failed to save pledge." });
    }
});

// Fallback route for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` VOICE OF LADAKH SERVER`);
    console.log(` Property of Shreesha Rao K.`);
    console.log(` Running on port ${PORT}`);
    console.log(`=======================================================`);
});
