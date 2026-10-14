const crypto = require('node:crypto');

const APPROVAL_TTL_MS = 5 * 60 * 1000;
const approvals = new Map();

function safeEqual(a, b) {
  const left = Buffer.from(String(a || ''));
  const right = Buffer.from(String(b || ''));

  return left.length === right.length &&
    crypto.timingSafeEqual(left, right);
}

function authenticateAdmin(secret) {
  const expected = process.env.AETHEL_ADMIN_SECRET;

  if (!expected || expected.length < 32) {
    return false;
  }

  return safeEqual(secret, expected);
}

function issueApproval({ agent, operation, adminSecret }) {
  if (!authenticateAdmin(adminSecret)) {
    throw new Error('Administrator authentication failed');
  }

  if (!agent || !operation) {
    throw new Error('Agent and operation are required');
  }

  const token = crypto.randomBytes(32).toString('hex');

  approvals.set(token, {
    agent,
    operation,
    expiresAt: Date.now() + APPROVAL_TTL_MS
  });

  return token;
}

async function hitlMiddleware(request, reply) {
  if (request.method === 'GET' &&
      request.url.split('?')[0] === '/api/health') {
    return;
  }

  if (request.method !== 'POST' ||
      request.url.split('?')[0] !== '/api/execute') {
    return reply.code(403).send({
      status: 'blocked',
      reason: 'Operation not authorized'
    });
  }

  const agent = request.body?.agent;
  const operation = request.body?.command;
  const token = request.headers['x-aethel-approval'];

  if (typeof agent !== 'string' ||
      typeof operation !== 'string' ||
      typeof token !== 'string') {
    return reply.code(403).send({
      status: 'blocked',
      reason: 'Valid operation approval required'
    });
  }

  const approval = approvals.get(token);

  if (!approval) {
    return reply.code(403).send({
      status: 'blocked',
      reason: 'Approval missing or invalid'
    });
  }

  // Consume approval before checking its validity.
  approvals.delete(token);

  if (approval.expiresAt < Date.now() ||
      approval.agent !== agent ||
      approval.operation !== operation) {
    return reply.code(403).send({
      status: 'blocked',
      reason: 'Approval expired or mismatched'
    });
  }

  request.aethelApproval = {
    agent,
    operation,
    authorized: true
  };
}

module.exports = hitlMiddleware;
module.exports.issueApproval = issueApproval;
