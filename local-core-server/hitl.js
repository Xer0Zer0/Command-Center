const fs = require('fs');
const path = require('path');

async function hitlMiddleware(req, reply) {
  const lockFilePath = path.join(process.cwd(), '.hitl_approved');
  
  if (!fs.existsSync(lockFilePath)) {
    reply.code(403).send({
      status: "blocked",
      reason: "Human-In-The-Loop (HITL) authorization required."
    });
    return;
  }
  
  fs.unlinkSync(lockFilePath);
}

module.exports = hitlMiddleware;
