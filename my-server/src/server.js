const express = require('express');
const app = express();
const PORT = 3003;

app.use(express.json());

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>Aethel AI Assistant</title>
        <style>
            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }
            html, body {
                width: 100%;
                height: 100%;
                overflow: hidden;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                background-color: #050508;
                background-image: radial-gradient(circle at 50% 80%, #0d1b3a 0%, #050508 70%);
                color: #e0e0e0;
            }
            body {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
            header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 16px;
                background: transparent;
                width: 100%;
            }
            .header-left {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .close-btn {
                font-size: 1.4rem;
                cursor: pointer;
                color: #fff;
                background: none;
                border: none;
                line-height: 1;
            }
            .header-title {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 0.95rem;
                color: #fff;
                font-weight: 500;
            }
            .status-badge {
                width: 42px;
                height: 42px;
                background: #9f1239;
                color: #fce7f3;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 1rem;
                box-shadow: 0 4px 15px rgba(159, 18, 57, 0.4);
            }
            .chat-container {
                width: 100%;
                flex: 1;
                overflow-y: auto;
                padding: 10px 16px;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .message {
                max-width: 85%;
                padding: 10px 14px;
                border-radius: 12px;
                font-size: 0.9rem;
                line-height: 1.4;
            }
            .message.assistant {
                background: #111116;
                color: #f4f4f5;
                align-self: flex-start;
                border: 1px solid #1f1f26;
            }
            .message.user {
                background: #1e1e24;
                color: #fff;
                align-self: flex-end;
            }
            .input-panel {
                padding: 10px 16px 20px 16px;
                width: 100%;
                background: transparent;
            }
            .input-bar {
                display: flex;
                align-items: center;
                background: #121216;
                border-radius: 30px;
                padding: 6px 12px;
                border: 1px solid #22222d;
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                width: 100%;
            }
            .action-icon-btn {
                background: none;
                border: none;
                color: #a1a1aa;
                font-size: 1.2rem;
                padding: 6px 8px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .input-box {
                flex: 1;
                display: flex;
                align-items: center;
            }
            .input-box input {
                width: 100%;
                background: none;
                border: none;
                color: #fff;
                font-size: 0.95rem;
                padding: 6px 8px;
                outline: none;
            }
            .input-box input::placeholder {
                color: #666;
            }
            .mic-icon-btn {
                background: none;
                border: none;
                color: #fff;
                font-size: 1.1rem;
                padding: 6px 8px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .voice-btn {
                background: #2563eb;
                border: none;
                color: #fff;
                width: 38px;
                height: 38px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 2px 8px rgba(37, 99, 235, 0.4);
            }
            .home-indicator {
                width: 120px;
                height: 4px;
                background: #fff;
                border-radius: 2px;
                margin: 10px auto 0 auto;
            }
        </style>
    </head>
    <body>
        <header>
            <div class="header-left">
                <button class="close-btn" id="closeBtn">&times;</button>
                <div class="header-title">
                    <span>Degital Contents</span>
                    <span>&#9662;</span>
                </div>
            </div>
            <div class="status-badge">69</div>
        </header>

        <div class="chat-container" id="chatContainer"></div>

        <div class="input-panel">
            <div class="input-bar">
                <button class="action-icon-btn" id="plusBtn">+</button>
                <div class="input-box">
                    <input type="text" id="userInput" placeholder="Ask Aethel">
                </div>
                <button class="mic-icon-btn" id="micBtn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                        <path d="M19 10v1a7 7 0 0 1-14 0v-1"></path>
                        <line x1="12" y1="19" x2="12" y2="23"></line>
                        <line x1="8" y1="23" x2="16" y2="23"></line>
                    </svg>
                </button>
                <button class="voice-btn" id="voiceBtn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="6" y1="4" x2="6" y2="20"></line>
                        <line x1="10" y1="8" x2="10" y2="16"></line>
                        <line x1="14" y1="2" x2="14" y2="22"></line>
                        <line x1="18" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="home-indicator"></div>
        </div>

        <script>
            const input = document.getElementById('userInput');
            const chatContainer = document.getElementById('chatContainer');

            input.addEventListener('keypress', async function (e) {
                if (e.key === 'Enter' && input.value.trim() !== '') {
                    const userMsg = input.value;
                    
                    const userDiv = document.createElement('div');
                    userDiv.className = 'message user';
                    userDiv.innerText = userMsg;
                    chatContainer.appendChild(userDiv);
                    
                    input.value = '';
                    chatContainer.scrollTop = chatContainer.scrollHeight;

                    try {
                        const res = await fetch('/api/chat', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ message: userMsg })
                        });
                        const data = await res.json();

                        const botDiv = document.createElement('div');
                        botDiv.className = 'message assistant';
                        botDiv.innerText = data.reply || "Aethel operational command executed.";
                        chatContainer.appendChild(botDiv);
                        chatContainer.scrollTop = chatContainer.scrollHeight;
                    } catch (err) {
                        console.error("Connection error");
                    }
                }
            });
        </script>
    </body>
    </html>
  `);
});

app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  res.json({ 
    status: "success", 
    reply: `Aethel operational command executed for: "${message}"`,
    timestamp: new Date().toISOString() 
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
