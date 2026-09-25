import { AETHEL_CONFIG } from './config.js';

let currentTopic = AETHEL_CONFIG.defaultTopic;

function initApp() {
  renderNavigation();
  switchTopic(currentTopic);
}

function renderNavigation() {
  const navContainer = document.getElementById('bottom-nav');
  navContainer.innerHTML = '';
  Object.keys(AETHEL_CONFIG.topics).forEach(key => {
    const topic = AETHEL_CONFIG.topics[key];
    const button = document.createElement('button');
    button.className = `nav-item ${key === currentTopic ? 'active' : ''}`;
    button.innerHTML = `<span>${topic.title}</span>`;
    button.addEventListener('click', () => switchTopic(key));
    navContainer.appendChild(button);
  });
}

function switchTopic(topicKey) {
  const topic = AETHEL_CONFIG.topics[topicKey];
  if (!topic) return;
  currentTopic = topicKey;
  document.getElementById('header-title').innerText = topic.title;
  document.getElementById('header-subtitle').innerText = topic.subtitle;
  document.documentElement.style.setProperty('--accent-color', topic.accentColor);
  document.querySelectorAll('.nav-item').forEach((btn, index) => {
    const keys = Object.keys(AETHEL_CONFIG.topics);
    if (keys[index] === topicKey) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  appendFeed(`Switched context to ${topic.title}`, topic.endpoint);
}

function appendFeed(message, detail) {
  const feed = document.getElementById('content-feed');
  const card = document.createElement('div');
  card.className = 'console-card';
  card.innerHTML = `
    <h3>Active Context</h3>
    <p>${message}</p>
    <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Route: ${detail}</p>
  `;
  feed.prepend(card);
}

window.addEventListener('DOMContentLoaded', initApp);
