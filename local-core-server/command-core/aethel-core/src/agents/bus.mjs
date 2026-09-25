import EventEmitter from 'events';
import { logEvent } from '../db.mjs';

class EcosystemBus extends EventEmitter {}

export const bus = new EcosystemBus();

// Bind ledger recording to all event emissions
bus.on('newListener', (event) => {
  if (event === 'newListener') return;
});

// Intercept and log all events automatically
const originalEmit = bus.emit;
bus.emit = function(event, ...args) {
  logEvent(event, args[0]);
  return originalEmit.apply(this, [event, ...args]);
};

// Register cross-pillar reaction loops
bus.on('security:anomaly', (data) => {
  console.log('[Ecosystem Event] Security anomaly detected:', data);
  bus.emit('persistence:snapshot', { reason: 'security_anomaly', timestamp: new Date() });
  bus.emit('evolution:evaluate', { trigger: 'anomaly', payload: data });
});

bus.on('persistence:snapshot', (data) => {
  console.log('[Ecosystem Event] Persistence backup initiated:', data);
});

bus.on('evolution:evaluate', (data) => {
  console.log('[Ecosystem Event] Evolution engine reviewing mutation rule:', data);
});
