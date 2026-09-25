const fs = require('fs').promises;

async function run() {
    const logPath = path.join(__dirname, 'working_ledger.json');
    const entry = {
        timestamp: new Date().toISOString(),
        domain: 'working_files',
        status: 'initialized',
        purpose: 'catch-all repository for unmapped files, scripts, and build outputs',
        message: 'Working files storage ledger active.'
    };
    
    let logs = [];
    try {
        const data = await fs.readFile(logPath, 'utf8');
        logs = JSON.parse(data);
    } catch (e) {
        // Initialize fresh log file
    }
    
    logs.push(entry);
    await fs.writeFile(logPath, JSON.stringify(logs, null, 2));
    console.log('Working files ledger updated successfully.');
}

run();
