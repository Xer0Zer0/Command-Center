import os from 'os';

export async function registerPillar1(app) {
  app.get('/api/pillars/sovereignty', async () => {
    return {
      pillar: 'Sovereignty',
      status: 'active',
      hostname: os.hostname(),
      platform: os.platform(),
      uptime: os.uptime(),
      freeMemory: os.freemem(),
      totalMemory: os.totalmem(),
      loadAverage: os.loadavg()
    };
  });
}
