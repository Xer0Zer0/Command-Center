import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { registerPillar1 } from './agents/pillars/pillar1.mjs';
import { registerPillar2 } from './agents/pillars/pillar2.mjs';
import { registerPillar3 } from './agents/pillars/pillar3.mjs';
import { registerPillar4 } from './agents/pillars/pillar4.mjs';
import { registerPillar5 } from './agents/pillars/pillar5.mjs';
import { registerPillar6 } from './agents/pillars/pillar6.mjs';
import { getEcosystemState } from './core/orchestrator.mjs';
import { startEcosystemLoop } from './core/loop.mjs';

const app = Fastify({ logger: true });

await app.register(helmet);
await app.register(cors, { origin: true });

app.get('/health', async () => {
  return { status: 'online', ecosystem: 'Aethel', timestamp: new Date().toISOString() };
});

app.get('/api/state', async () => {
  return await getEcosystemState();
});

await registerPillar1(app);
await registerPillar2(app);
await registerPillar3(app);
await registerPillar4(app);
await registerPillar5(app);
await registerPillar6(app);

const start = async () => {
  try {
    await app.listen({ port: 4000, host: '0.0.0.0' });
    console.log('Aethel Core online on port 4000.');
    startEcosystemLoop();
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
import { registerEcosystemStatus } from './agents/ecosystem.mjs';
registerEcosystemStatus(app);
import fastifyStatic from '@fastify/static';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.register(fastifyStatic, {
  root: path.join(__dirname, '../public'),
  prefix: '/',
});

import { bus } from './agents/bus.mjs';

app.post('/api/ecosystem/trigger', async (request, reply) => {
  const { event, payload } = request.body || { event: 'security:anomaly', payload: { source: 'manual_test' } };
  bus.emit(event, payload);
  return { status: 'triggered', event, payload, timestamp: new Date() };
});
import fs from 'fs/promises';
import path from 'path';

app.get('/api/ecosystem/logs', async (request, reply) => {
  try {
    const raw = await fs.readFile(path.resolve('./aethel_logs.json'), 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
});
