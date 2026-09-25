export async function registerPillar3(app) {
  let messageRelayLog = [];

  app.get('/api/pillars/communication', async () => {
    return {
      pillar: 'Communication and Relays',
      status: 'active',
      relayedCount: messageRelayLog.length,
      recentMessages: messageRelayLog.slice(-5)
    };
  });

  app.post('/api/pillars/communication/relay', async (req) => {
    const message = { id: Date.now(), ...req.body, timestamp: new Date().toISOString() };
    messageRelayLog.push(message);
    return { success: true, relayed: message };
  });
}
