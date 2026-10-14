const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');
const fs = require('fs');
const path = require('path');
const hitl = require('./hitl');

fastify.register(cors, { origin: true });

// Apply HITL authorization checkpoint globally
fastify.addHook('preHandler', hitl);

// Health endpoint
fastify.get('/api/health', async (request, reply) => {
  return {
    status: 'online',
    timestamp: new Date().toISOString()
  };
});

// Execution endpoint
fastify.post('/api/execute', async (request, reply) => {
  return {
    status: 'success',
    executedCommand: request.body?.command
  };
});

// Start Aethel Local Core
const start = async () => {
  try {
    const PORT = Number(process.env.PORT || 9999);

    await fastify.listen({
      port: PORT,
      host: '0.0.0.0'
    });

    console.log(`Local core server running on port ${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
      
