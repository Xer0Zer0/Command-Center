const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// API status endpoint
app.get('/status', (req, res) => {
    res.json({ status: 'online', service: 'aethel-agent' });
});

// Aethel Master Controller Chat Endpoint
app.post('/api/chat', (req, res) => {
    const { message, hq } = req.body;
    
    console.log(`[AETHEL COMMAND] Received message: "${message}" ${hq ? `targeting HQ: ${hq}` : ''}`);

    let responseText = `Aethel received your command: "${message}".`;
    
    if (hq) {
        responseText = `Aethel dispatched command to [${hq.toUpperCase()} HQ]: "${message}"`;
        const logDir = path.join(__dirname, 'hq', hq, 'logs');
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
        const logPath = path.join(logDir, 'activity.log');
        fs.appendFileSync(logPath, `${new Date().toISOString()} - ${message}\n`);
    }

    res.json({ 
        status: 'success', 
        reply: responseText,
        activeHq: hq || 'general'
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Aethel agent server running on port ${PORT}`);
});
