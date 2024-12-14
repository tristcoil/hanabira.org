// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Serve MP3 files via an API route from the jitendex_audio directory
app.get('/api/audio/:filename', (req, res) => {
    
    console.log(req.params.filename)
    
    const filePath = path.join(__dirname, 'jitendex_audio', req.params.filename);
    if (fs.existsSync(filePath)) {
        res.setHeader('Content-Type', 'audio/mpeg');
        fs.createReadStream(filePath).pipe(res);
    } else {
        res.status(404).json({ error: 'File not found' });
    }
});

// Start the server on port 5300
app.listen(5300, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:5300');
});
