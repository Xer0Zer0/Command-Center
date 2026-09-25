import fs from 'fs/promises';
import path from 'path';

const DB_FILE = path.resolve('./aethel_logs.json');
const TEMP_FILE = path.resolve('./aethel_logs.tmp.json');

export async function initDb() {
  try {
    await fs.access(DB_FILE);
  } catch {
    await fs.writeFile(DB_FILE, JSON.stringify([], null, 2));
  }
}

export async function logEvent(event, payload) {
  try {
    const raw = await fs.readFile(DB_FILE, 'utf8').catch(() => '[]');
    const data = JSON.parse(raw);
    data.push({ event, payload, timestamp: new Date().toISOString() });
    if (data.length > 500) data.shift();
    
    // Atomic write via temp file to prevent corruption on sudden termination
    await fs.writeFile(TEMP_FILE, JSON.stringify(data, null, 2));
    await fs.rename(TEMP_FILE, DB_FILE);
  } catch (e) {
    console.error('Ledger write error:', e);
  }
}
