const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');
const fs = require('fs');
const path = require('path');
const hitl = require('./hitl');

fastify.register(cors, { origin: true });

// Apply HITL authorization checkpoint globally or per route
fastify.addHook('preHandler', hitl);

fastify.get('/api/health', async (request, reply) => {
  return { status: 'online', timestamp: new Date() };
});

const start = async () => {
  try {
    await fastify.listen({ port: 5000, host: '0.0.0.0' });
    console.log('Local core server running on port 5000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

app.get('/status', (req, res) => {
  res.json({ status: 'online', agent: 'aethel-agent' });
});
