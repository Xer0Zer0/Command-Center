const fs = require('fs/promises');
const path = require('path');
const os = require('os');
const hitlMiddleware = require('./hitl.js');

async function coreRoutes(fastify, options) {
  fastify.post('/api/execute', { preHandler: hitlMiddleware }, async (request, reply) => {
    const { command } = request.body;
    return { status: "success", executedCommand: command };
  });

  fastify.get('/api/browse', { preHandler: hitlMiddleware }, async (request, reply) => {
    const targetDir = request.query.path ? path.resolve(process.cwd(), request.query.path) : process.cwd();
    
    try {
      const entries = await fs.readdir(targetDir, { withFileTypes: true });
      const items = entries.map(entry => ({
        name: entry.name,
        type: entry.isDirectory() ? 'directory' : 'file'
      }));
      
      return { status: "success", currentPath: targetDir, items };
    } catch (err) {
      reply.code(500).send({ status: "error", message: err.message });
    }
  });

  fastify.get('/api/read', { preHandler: hitlMiddleware }, async (request, reply) => {
    const targetFile = request.query.path ? path.resolve(process.cwd(), request.query.path) : null;
    
    if (!targetFile) {
      return reply.code(400).send({ status: "error", message: "File path parameter is required." });
    }

    try {
      const content = await fs.readFile(targetFile, 'utf8');
      return { status: "success", path: targetFile, content };
    } catch (err) {
      reply.code(500).send({ status: "error", message: err.message });
    }
  });

  fastify.post('/api/write', { preHandler: hitlMiddleware }, async (request, reply) => {
    const { path: filePath, content } = request.body;
    
    if (!filePath || content === undefined) {
      return reply.code(400).send({ status: "error", message: "File path and content are required." });
    }

    const targetFile = path.resolve(process.cwd(), filePath);

    try {
      await fs.writeFile(targetFile, content, 'utf8');
      return { status: "success", path: targetFile, message: "File successfully updated." };
    } catch (err) {
      reply.code(500).send({ status: "error", message: err.message });
    }
  });

  fastify.get('/api/metrics', { preHandler: hitlMiddleware }, async (request, reply) => {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;

    return {
      status: "success",
      uptime: os.uptime(),
      platform: os.platform(),
      arch: os.arch(),
      loadAverage: os.loadavg(),
      memory: {
        total: totalMem,
        free: freeMem,
        used: usedMem,
        percentUsed: Number((usedMem / totalMem * 100).toFixed(2))
      }
    };
  });

  fastify.get('/api/fetch', { preHandler: hitlMiddleware }, async (request, reply) => {
    const targetUrl = request.query.url;
    
    if (!targetUrl) {
      return reply.code(400).send({ status: "error", message: "URL required." });
    }

    try {
      const response = await fetch(targetUrl);
      const data = await response.text();
      return { status: "success", url: targetUrl, html: data };
    } catch (err) {
      reply.code(500).send({ status: "error", message: err.message });
    }
  });
}

module.exports = coreRoutes;
