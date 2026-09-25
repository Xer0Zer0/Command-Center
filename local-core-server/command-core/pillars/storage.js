const fs = require('fs/promises');
const path = './db.json';

async function storagePillar(fastify, options) {
  // Ensure db.json exists on startup
  try {
    await fs.access(path);
  } catch {
    await fs.writeFile(path, JSON.stringify({ state: {}, logs: [] }, null, 2));
  }

  fastify.get('/api/command-core/storage', async (request, reply) => {
    const data = JSON.parse(await fs.readFile(path, 'utf8'));
    return { success: true, pillar: 'Storage', status: 'Operational', data };
  });

  fastify.post('/api/command-core/storage', async (request, reply) => {
    const { key, value } = request.body || {};
    const fileData = JSON.parse(await fs.readFile(path, 'utf8'));
    fileData.state[key] = value;
    fileData.logs.push({ timestamp: new Date().toISOString(), action: 'SET', key });

    // Atomic write pattern (write to temp file then rename)
    const tempPath = `${path}.tmp`;
    await fs.writeFile(tempPath, JSON.stringify(fileData, null, 2));
    await fs.rename(tempPath, path);

    return { success: true, updated: { [key]: value } };
  });
}

module.exports = storagePillar;
