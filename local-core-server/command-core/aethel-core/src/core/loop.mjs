import fs from 'fs/promises';

export function startEcosystemLoop() {
  setInterval(async () => {
    try {
      const timestamp = new Date().toISOString();
      const state = { status: 'active', last_pulse: timestamp, ecosystem: 'Aethel' };
      await fs.writeFile('data/state.json', JSON.stringify(state, null, 2));
      console.log(`[Aethel Pulse] State updated at ${timestamp}`);
    } catch (err) {
      console.error('[Aethel Pulse Error]', err);
    }
  }, 30000);
}
