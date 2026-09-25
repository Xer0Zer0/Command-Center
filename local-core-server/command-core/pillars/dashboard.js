const fs = require('fs/promises');
const path = require('path');

async function dashboardPillar(fastify, options) {
  const proposalsPath = path.join(__dirname, '../data/proposals.json');

  fastify.get('/dashboard', async (request, reply) => {
    let proposals = [];
    try {
      const data = await fs.readFile(proposalsPath, 'utf8');
      proposals = JSON.parse(data);
    } catch (e) {}

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Command Core Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: monospace; background: #121212; color: #00ff00; padding: 20px; }
          h2 { border-bottom: 1px solid #00ff00; padding-bottom: 5px; }
          .card { background: #1e1e1e; border: 1px solid #333; padding: 15px; margin-bottom: 10px; border-radius: 5px; }
          button { border: none; padding: 8px 12px; font-weight: bold; cursor: pointer; margin-top: 5px; margin-right: 5px; }
          .btn-approve { background: #00ff00; color: #000; }
          .btn-approve:hover { background: #00cc00; }
          .btn-reject { background: #ff3333; color: #fff; }
          .btn-reject:hover { background: #cc0000; }
        </style>
      </head>
      <body>
        <h2>Command Core Dashboard</h2>
        <p>Status: <strong>ACTIVE</strong> | Least Privilege: <strong>ENFORCED</strong></p>
        <h3>Pending Proposals</h3>
        <div id="queue">
          ${proposals.filter(p => p.status === 'PENDING').length === 0 ? '<p>No pending proposals.</p>' : ''}
          ${proposals.filter(p => p.status === 'PENDING').map(p => `
            <div class="card">
              <strong>ID:</strong> ${p.id}<br>
              <strong>Action:</strong> ${p.action}<br>
              <strong>Required Role:</strong> ${p.requiredRole}<br>
              <pre>${JSON.stringify(p.payload, null, 2)}</pre>
              <button class="btn-approve" onclick="processProposal('${p.id}', 'APPROVE')">Approve as Admin</button>
              <button class="btn-reject" onclick="processProposal('${p.id}', 'REJECT')">Reject</button>
            </div>
          `).join('')}
        </div>
        <script>
          async function processProposal(id, decision) {
            const res = await fetch('/api/command-core/executive/authorize', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ proposalId: id, decision: decision, userRole: 'ADMIN_EXECUTIVE' })
            });
            const data = await res.json();
            if(data.success) {
              alert('Proposal ' + decision.toLowerCase() + ' successfully!');
              location.reload();
            } else {
              alert('Operation Failed: ' + data.error);
            }
          }
        </script>
      </body>
      </html>
    `;
    reply.type('text/html').send(html);
  });
}

module.exports = dashboardPillar;
