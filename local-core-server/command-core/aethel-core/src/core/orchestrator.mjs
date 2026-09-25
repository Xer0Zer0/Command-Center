import fs from 'fs/promises';

export async function getEcosystemState() {
  try {
    const data = await fs.readFile('data/state.json', 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return { status: 'degraded', error: err.message };
  }
}
