const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

const ADMIN_USER = "admin";
const ADMIN_PASS = "aethel2026";

app.post('/api/login', (req, res) => {
    const { username, password } = req.body || {};
    if (username === ADMIN_USER && password === ADMIN_PASS) {
        return res.json({ success: true, token: "aethel-secure-token-xyz" });
    }
    return res.status(401).json({ success: false, error: "Invalid credentials" });
});

app.post('/api/command', (req, res) => {
    const { prompt, token } = req.body || {};
    
    if (token !== "aethel-secure-token-xyz") {
        return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    if (!prompt) {
        return res.status(400).json({ success: false, error: 'Prompt is required' });
    }

    const commandText = prompt.trim();
    const lower = commandText.toLowerCase();

    if (lower === "time") {
        return res.json({ success: true, reply: "Server time is " + new Date().toLocaleTimeString() });
    }

    if (lower === "status") {
        return res.json({ success: true, reply: "System secure. Node environment active." });
    }

    let sysCommand = commandText;
    if (lower.startsWith("run ")) {
        sysCommand = commandText.substring(4);
    }

    exec(sysCommand, { timeout: 5000 }, (error, stdout, stderr) => {
        if (error) {
            return res.json({ success: true, reply: `Execution error: ${error.message}` });
        }
        
        let output = stdout.trim() || stderr.trim();
        if (!output) {
            output = "Command executed with no output.";
        }
        
        const speechReply = output.length > 150 ? output.substring(0, 150) + "..." : output;
        res.json({ success: true, reply: speechReply });
    });
});

app.listen(PORT, () => {
    console.log(`Aethel control node running at http://localhost:${PORT}`);
});
