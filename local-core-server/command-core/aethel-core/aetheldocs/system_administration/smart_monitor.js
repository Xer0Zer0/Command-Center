const fs = require('fs').promises;
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function runMonitor() {
    const logPath = path.join(__dirname, 'sysadmin_ledger.ndjson');
    let memMB = 0;
    let pm2Status = 'active';

    try {
        const { stdout } = await execPromise('pm2 jlist');
        const apps = JSON.parse(stdout);
        const coreApp = apps.find(app => app.name.includes('aethel') || app.name === 'aetheldocs');
        if (coreApp && coreApp.monit) {
            memMB = coreApp.monit.memory / 1024 / 1024;
        } else if (apps.length > 0 && apps[0].monit) {
            memMB = apps[0].monit.memory / 1024 / 1024;
        }
    } catch (e) {
        memMB = process.memoryUsage().rss / 1024 / 1024;
        pm2Status = 'fallback_local';
    }

    const entry = {
        timestamp: new Date().toISOString(),
        domain: 'system_administration',
        metric: 'memory_check',
        current_memory_mb: parseFloat(memMB.toFixed(2)),
        ceiling_mb: 150,
        pm2_status: pm2Status,
        status: memMB > 120 ? 'WARNING_HIGH_MEMORY' : 'nominal'
    };

    // Append as NDJSON string
    await fs.appendFile(logPath, JSON.stringify(entry) + '\n');
    console.log(`Monitor check complete. Memory: ${entry.current_memory_mb}MB / 150MB Ceiling.`);

    if (memMB > 120) {
        console.warn('ALERT: Memory threshold exceeded 120MB buffer zone!');
        // Insert webhook trigger here if connecting to Telegram/Discord later
    }
}

runMonitor();
