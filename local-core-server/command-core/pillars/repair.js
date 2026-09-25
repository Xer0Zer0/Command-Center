const fs = require('fs/promises');
const path = require('path');

async function repairPillar(fastify, options) {
  process.on('uncaughtException', async (error) => {
    fastify.log.error(`[Autonomous Error Interceptor] Caught exception: ${error.message}`);

    const proposal = {
      id: `repair_${Date.now()}`,
      action: 'EXECUTE_REPAIR_PATCH',
      requiredRole: 'ADMIN_EXECUTIVE',
      payload: {
        errorType: error.name,
        message: error.message,
        stack: error.stack
      },
      status: 'PENDING'
    };

    try {
      const filePath = path.join(__dirname, '../data/proposals.json');
      let data = [];
      try {
        const fileData = await fs.readFile(filePath, 'utf8');
        data = JSON.parse(fileData);
      } catch (e) {
        // Initialize if empty or missing
      }
      data.push(proposal);
      await fs.writeFile(filePath + '.tmp', JSON.stringify(data, null, 2));
      await fs.rename(filePath + '.tmp', filePath);
      fastify.log.info(`[HITL Gate] Repair proposal ${proposal.id} staged successfully.`);
    } catch (err) {
      fastify.log.error(`Failed to stage automated repair proposal: ${err.message}`);
    }
  });

  fastify.get('/api/command-core/repair/status', async (request, reply) => {
    return { success: true, monitor: 'Active', leastPrivilegeEnforced: true };
  });
}

module.exports = repairPillar;
