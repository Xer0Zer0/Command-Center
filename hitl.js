const fs = require('fs');
const path = require('path');

module.exports = async function (request, reply) {
  if (request.method === 'GET' && request.url === '/api/health') {
    return;
  }

  request.log.info({ method: request.method, url: request.url, body: request.body }, 'HITL checkpoint: Evaluating request');

  const authHeader = request.headers['x-hitl-token'];
  const approvalLockFile = path.join(__dirname, '.hitl_approved');

  // Check for valid token OR an active local approval lock file
  let isAuthorized = false;
  if (authHeader === 'LOCAL_CORE_APPROVED') {
    isAuthorized = true;
  } else if (fs.existsSync(approvalLockFile)) {
    // Consume the lock file so it acts as a single-use or active session approval
    fs.unlinkSync(approvalLockFile);
    isAuthorized = true;
  }

  if (!isAuthorized) {
    reply.code(403).send({
      status: 'blocked',
      reason: 'Human-In-The-Loop (HITL) authorization required. Create .hitl_approved or provide x-hitl-token.'
    });
    return;
  }

  request.log.info('HITL checkpoint: Request approved');
};
