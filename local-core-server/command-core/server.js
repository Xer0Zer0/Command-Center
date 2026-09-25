const fastify = require('fastify')({ logger: true });
const path = require('path');

const storagePillar = require('./pillars/storage');
const executivePillar = require('./pillars/executive');
const repairPillar = require('./pillars/repair');
const dashboardPillar = require('./pillars/dashboard');

fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, './'),
  prefix: '/',
});

fastify.register(storagePillar);
fastify.register(executivePillar);
fastify.register(repairPillar);
fastify.register(dashboardPillar);

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

