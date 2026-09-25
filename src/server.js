const express = require('express');
const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aethel</title>
  <style>
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #000; color: #fff; display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
    
    .view { display: none; flex-direction: column; height: 100vh; width: 100%; position: absolute; top: 0; left: 0; background: #000; }
    .view.active { display: flex; }

    /* Front / Idling Page */
    .top-bar { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-bottom: 1px solid #1a1a1a; background: #000; z-index: 10; }
    .icon-btn { background: none; border: none; color: #fff; font-size: 20px; cursor: pointer; padding: 4px; display: flex; align-items: center; justify-content: center; }
    
    .status-area { padding: 18px 16px; font-size: 14px; color: #8e8e93; font-weight: 400; }

    /* Agent Menu Dropdown */
    .agent-menu { display: none; flex-direction: column; position: absolute; top: 57px; left: 0; width: 100%; background: #000; border-bottom: 1px solid #1a1a1a; z-index: 20; max-height: calc(100vh - 57px); overflow-y: auto; }
    .agent-menu.active { display: flex; }
    .section-title { padding: 16px 16px 8px 16px; font-size: 11px; color: #8e8e93; text-transform: uppercase; letter-spacing: 0.6px; font-weight: 600; }
    .agent-item { display: flex; align-items: center; gap: 14px; padding: 12px 16px; cursor: pointer; border-bottom: 1px solid #121212; }
    .agent-item:hover { background: #111; }
    .list-avatar { width: 34px; height: 34px; border-radius: 50%; background: #e06c4c; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; }
    .agent-name { font-size: 15px; font-weight: 400; color: #f2f2f7; }

    /* Chat Workspace View */
    .chat-view { background: linear-gradient(180deg, #000 0%, #050b14 100%); }
    .chat-top-bar { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; }
    
    /* Agent selected pill at top */
    .agent-pill { background: #1c1c1e; border: 1px solid #2c2c2e; padding: 6px 14px; border-radius: 20px; display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; cursor: pointer; color: #8ab4f8; }
    .agent-avatar-sm { width: 18px; height: 18px; border-radius: 4px; background: #b06030; display: flex; align-items: center; justify-content: center; font-size: 10px; }
    
    .chat-body { flex: 1; padding: 20px 16px; display: flex; flex-direction: column; gap: 16px; overflow-y: auto; }
    .chat-bubble { background: #1c1c1e; border: 1px solid #2c2c2e; padding: 16px 20px; border-radius: 16px; font-size: 14px; line-height: 1.5; color: #f2f2f7; max-width: 90%; }
    
    /* Bottom bar with + on left, chat box in middle, mic icon */
    .chat-input-container { padding: 12px 16px 24px 16px; display: flex; align-items: center; gap: 10px; background: rgba(0,0,0,0.8); }
    .left-plus-btn { background: #1c1c1e; border: 1px solid #2c2c2e; color: #fff; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; cursor: pointer; flex-shrink: 0; }
    
    .chat-input-bar { flex: 1; background: #1c1c1e; border: 1px solid #2c2c2e; border-radius: 24px; display: flex; align-items: center; padding: 10px 16px; gap: 12px; }
    .chat-input { background: none; border: none; color: #fff; font-size: 14px; outline: none; width: 100%; }
    .chat-input::placeholder { color: #8e8e93; }
    
    .mic-btn { background: none; border: none; color: #8e8e93; font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 4px; }
  </style>
</head>
<body>

  <!-- Front Idling Page -->
  <div id="dashboardView" class="view active">
    <div class="top-bar">
      <!-- Two-line hamburger icon -->
      <button class="icon-btn" onclick="toggleAgentMenu()" style="font-size: 16px; font-weight: bold; letter-spacing: 2px;">══</button>
      <div style="width: 28px;"></div>
    </div>

    <div class="status-area">
      Aethel Core Ecosystem Active. Ready for instructions.
    </div>

    <!-- Agent Menu Dropdown -->
    <div id="agentMenu" class="agent-menu">
      <div class="section-title">Switch Agent</div>
      <div class="agent-list">
        <div class="agent-item" onclick="openChat('Aethel Core', 'A')"><div class="list-avatar" style="background:#e06c4c;">A</div><div class="agent-name">Aethel Core</div></div>
        <div class="agent-item" onclick="openChat('Business Agent', 'B')"><div class="list-avatar" style="background:#0a84ff;">B</div><div class="agent-name">Business Agent</div></div>
        <div class="agent-item" onclick="openChat('Commercial Agent', 'C')"><div class="list-avatar" style="background:#30d158;">C</div><div class="agent-name">Commercial Agent</div></div>
        <div class="agent-item" onclick="openChat('Innovative Agent', 'I')"><div class="list-avatar" style="background:#5e5ce6;">I</div><div class="agent-name">Innovative Agent</div></div>
        <div class="agent-item" onclick="openChat('Office Agent', 'O')"><div class="list-avatar" style="background:#ff375f;">O</div><div class="agent-name">Office Agent</div></div>
        <div class="agent-item" onclick="openChat('Social Media Agent', 'S')"><div class="list-avatar" style="background:#ff9f0a;">S</div><div class="agent-name">Social Media Agent</div></div>
        <div class="agent-item" onclick="openChat('System Agent', 'S')"><div class="list-avatar" style="background:#ac8e68;">S</div><div class="agent-name">System Agent</div></div>
      </div>
    </div>
  </div>

  <!-- Agent Chat Workspace View -->
  <div id="chatView" class="view chat-view">
    <div class="chat-top-bar">
      <!-- Two-line hamburger icon -->
      <button class="icon-btn" onclick="openDashboard()" style="font-size: 16px; font-weight: bold; letter-spacing: 2px;">══</button>
      
      <!-- Selected agent display pill -->
      <div class="agent-pill" onclick="toggleAgentMenuFromChat()">
        <div id="activeAgentAvatar" class="agent-avatar-sm">B</div>
        <span id="activeAgentTitle">Business Agent</span>
      </div>
      
      <div style="width: 28px;"></div>
    </div>

    <div class="chat-body">
      <div class="chat-bubble">
        Hello! I am Aethel, your main brain. Tap the pill above to switch agents or start a workflow.
      </div>
    </div>

    <!-- Bottom input container: Plus on left, middle chat box, microphone -->
    <div class="chat-input-container">
      <button class="left-plus-btn">＋</button>
      <div class="chat-input-bar">
        <input type="text" id="chatInputBox" class="chat-input" placeholder="Ask Business Agent...">
        <button class="mic-btn">🎤</button>
      </div>
    </div>
  </div>

  <script>
    function toggleAgentMenu() {
      document.getElementById('agentMenu').classList.toggle('active');
    }

    function openChat(agentName, initial) {
      document.getElementById('agentMenu').classList.remove('active');
      document.getElementById('dashboardView').classList.remove('active');
      document.getElementById('chatView').classList.add('active');
      document.getElementById('activeAgentTitle').innerText = agentName;
      document.getElementById('activeAgentAvatar').innerText = initial;
      document.getElementById('chatInputBox').placeholder = "Ask " + agentName + "...";
    }

    function openDashboard() {
      document.getElementById('chatView').classList.remove('active');
      document.getElementById('dashboardView').classList.add('active');
    }

    function toggleAgentMenuFromChat() {
      openDashboard();
      toggleAgentMenu();
    }
  </script>
</body>
</html>`);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
