const fs = require('fs/promises');
const path = require('path');

async function executivePillar(fastify, options) {
  const proposalsPath = path.join(__dirname, '../data/proposals.json');

  // Ensure data directory exists
  try {
    await fs.mkdir(path.dirname(proposalsPath), { recursive: true });
  } catch (e) {}

  fastify.post('/api/command-core/executive/propose', async (request, reply) => {
    const { action, payload, requiredRole = 'ADMIN_EXECUTIVE' } = request.body;
    const proposalId = `action_${Date.now()}`;

    const proposal = {
      id: proposalId,
      action,
      payload,
      requiredRole,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    let proposals = [];
    try {
      const data = await fs.readFile(proposalsPath, 'utf8');
      proposals = JSON.parse(data);
    } catch (e) {}

    proposals.push(proposal);
    await fs.writeFile(proposalsPath + '.tmp', JSON.stringify(proposals, null, 2));
    await fs.rename(proposalsPath + '.tmp', proposalsPath);

    return { success: true, proposalId, status: 'Awaiting HITL Approval' };
  });

  fastify.get('/api/command-core/executive/pending', async (request, reply) => {
    try {
      const data = await fs.readFile(proposalsPath, 'utf8');
      const proposals = JSON.parse(data);
      return { success: true, pending: proposals.filter(p => p.status === 'PENDING') };
    } catch (e) {
      return { success: true, pending: [] };
    }
  });

  fastify.post('/api/command-core/executive/authorize', async (request, reply) => {
    const { proposalId, decision, userRole = 'OPERATOR' } = request.body;

    try {
      const data = await fs.readFile(proposalsPath, 'utf8');
      let proposals = JSON.parse(data);
      const proposal = proposals.find(p => p.id === proposalId);

      if (!proposal) {
        return reply.code(404).send({ success: false, error: 'Proposal not found' });
      }

      // RBAC Verification: Ensure assignee role matches required role or is Admin
      if (proposal.requiredRole === 'ADMIN_EXECUTIVE' && userRole !== 'ADMIN_EXECUTIVE') {
        return reply.code(403).send({ 
          success: false, 
          error: `Access Denied. Role '${userRole}' lacks permission for required role '${proposal.requiredRole}'.` 
        });
      }

      proposal.status = decision === 'APPROVE' ? 'APPROVED' : 'REJECTED';
      proposal.authorizedByRole = userRole;

      await fs.writeFile(proposalsPath + '.tmp', JSON.stringify(proposals, null, 2));
      await fs.rename(proposalsPath + '.tmp', proposalsPath);

      return { success: true, proposalId, decision: proposal.status };
    } catch (e) {
      return reply.code(500).send({ success: false, error: e.message });
    }
  });
}

module.exports = executivePillar;
