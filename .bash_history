            align-items: center;
            gap: 12px;
        }
        .header-right {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .menu-btn {
            background: none;
            border: none;
            color: #f3f3f3;
            font-size: 20px;
            cursor: pointer;
        }
        .logo-area {
            font-size: 18px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 4px;
            cursor: pointer;
        }
        .circle-btn {
            background-color: #222;
            color: #f3f3f3;
            border: none;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            cursor: pointer;
        }
        .badge-btn {
            background-color: #ff0055;
            color: #f3f3f3;
            border: none;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
        }
        /* Main Content Area */
        main {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 20px;
            text-align: center;
            overflow-y: auto;
            padding-bottom: 100px;
        }
        .sparkle-icon {
            font-size: 42px;
            margin-bottom: 14px;
            background: linear-gradient(135deg, #a855f7, #ec4899, #ef4444);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 0 20px rgba(236, 72, 153, 0.3);
        }
        .greeting {
            font-size: 24px;
            font-weight: 500;
            color: #f3f3f3;
        }
        /* Bottom Pinned Chat Footer Layout matching reference */
        .chat-footer {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background-color: #0d0d0d;
            padding: 12px 16px 24px 16px;
            display: flex;
            justify-content: center;
            z-index: 100;
        }
        .chat-bar-wrapper {
            width: 100%;
            max-width: 600px;
            background-color: #161618;
            border: 1px solid #2a2a2e;
            border-radius: 32px;
            padding: 8px 10px 8px 16px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .plus-icon-btn {
            background: none;
            border: none;
            color: #aaa;
            font-size: 20px;
            cursor: pointer;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .plus-icon-btn:hover {
            color: #fff;
        }
        .chat-input {
            flex: 1;
            background: transparent;
            border: none;
            color: #f3f3f3;
            font-size: 16px;
            outline: none;
        }
        .chat-input::placeholder {
            color: #777;
        }
        .mic-btn {
            background: none;
            border: none;
            color: #aaa;
            font-size: 18px;
            cursor: pointer;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .mic-btn:hover {
            color: #fff;
        }
        .send-blue-btn {
            background-color: #1d4ed8;
            color: #f3f3f3;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            cursor: pointer;
            flex-shrink: 0;
        }
        .send-blue-btn:hover {
            background-color: #2563eb;
        }
    </style>
</head>
<body>

    <header>
        <div class="header-left">
            <button class="menu-btn">&#9776;</button>
            <div class="logo-area">
                Aethel <span style="font-size: 12px;">&#9662;</span>
            </div>
        </div>
        <div class="header-right">
            <button class="circle-btn">+</button>
            <button class="badge-btn">69</button>
        </div>
    </header>

    <main>
        <div class="sparkle-icon">&#10024;</div>
        <div class="greeting">What's next, 69?</div>
    </main>

    <div class="chat-footer">
        <div class="chat-bar-wrapper">
            <button class="plus-icon-btn">+</button>
            <input type="text" id="chatInput" class="chat-input" placeholder="Ask Aethel">
            <button class="mic-btn">&#127908;</button>
            <button class="send-blue-btn" onclick="sendMessage()">&#8593;</button>
        </div>
    </div>

    <script>
        function sendMessage() {
            const input = document.getElementById('chatInput');
            const val = input.value.trim();
            if (val !== '') {
                alert('Dispatched: ' + val);
                input.value = '';
            } else {
                alert('Please type something or ask Aethel a question.');
            }
        }
    </script>
</body>
</html>
EOF

cat << 'EOF' > index.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aethel</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        body {
            background-color: #0d0d0d;
            color: #f3f3f3;
            display: flex;
            flex-direction: column;
            height: 100vh;
            height: 100dvh;
            overflow: hidden;
        }
        /* Top Header */
        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            background-color: #0d0d0d;
            border-bottom: 1px solid #222;
        }
        .header-left {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .header-right {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .menu-btn {
            background: none;
            border: none;
            color: #f3f3f3;
            font-size: 20px;
            cursor: pointer;
        }
        .logo-area {
            font-size: 18px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 4px;
            cursor: pointer;
        }
        .circle-btn {
            background-color: #222;
            color: #f3f3f3;
            border: none;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            cursor: pointer;
        }
        .badge-btn {
            background-color: #ff0055;
            color: #f3f3f3;
            border: none;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
        }
        /* Main Content Area */
        main {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 20px;
            text-align: center;
            overflow-y: auto;
            padding-bottom: 100px;
        }
        .sparkle-icon {
            font-size: 42px;
            margin-bottom: 14px;
            background: linear-gradient(135deg, #a855f7, #ec4899, #ef4444);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 0 20px rgba(236, 72, 153, 0.3);
        }
        .greeting {
            font-size: 24px;
            font-weight: 500;
            color: #f3f3f3;
        }
        /* Bottom Pinned Chat Footer Layout */
        .chat-footer {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background-color: #0d0d0d;
            padding: 12px 16px 24px 16px;
            display: flex;
            justify-content: center;
            z-index: 100;
        }
        .chat-bar-wrapper {
            width: 100%;
            max-width: 600px;
            background-color: #161618;
            border: 1px solid #2a2a2e;
            border-radius: 32px;
            padding: 8px 10px 8px 16px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .plus-icon-btn {
            background: none;
            border: none;
            color: #aaa;
            font-size: 20px;
            cursor: pointer;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .plus-icon-btn:hover {
            color: #fff;
        }
        .chat-input {
            flex: 1;
            background: transparent;
            border: none;
            color: #f3f3f3;
            font-size: 16px;
            outline: none;
        }
        .chat-input::placeholder {
            color: #777;
        }
        .mic-btn {
            background: none;
            border: none;
            color: #f3f3f3;
            cursor: pointer;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .mic-btn svg {
            width: 20px;
            height: 20px;
            fill: currentColor;
        }
        /* Circular button on the far right containing the listening vertical lines */
        .audio-circle-btn {
            background-color: #2b2b2f;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            flex-shrink: 0;
            gap: 3px;
            padding: 0;
        }
        .audio-circle-btn:hover {
            background-color: #38383e;
        }
        /* Vertical listening wave bars inside the circle matching your reference image */
        .wave-bar {
            width: 3px;
            border-radius: 2px;
        }
        .wb-1 { height: 10px; background-color: #3b82f6; } /* Blue */
        .wb-2 { height: 18px; background-color: #ef4444; } /* Red */
        .wb-3 { height: 24px; background-color: #f59e0b; } /* Yellow/Orange */
        .wb-4 { height: 14px; background-color: #3b82f6; } /* Blue */
    </style>
</head>
<body>

    <header>
        <div class="header-left">
            <button class="menu-btn">&#9776;</button>
            <div class="logo-area">
                Aethel <span style="font-size: 12px;">&#9662;</span>
            </div>
        </div>
        <div class="header-right">
            <button class="circle-btn">+</button>
            <button class="badge-btn">69</button>
        </div>
    </header>

    <main>
        <div class="sparkle-icon">&#10024;</div>
        <div class="greeting">What's next, 69?</div>
    </main>

    <div class="chat-footer">
        <div class="chat-bar-wrapper">
            <!-- + button on the far left -->
            <button class="plus-icon-btn">+</button>
            
            <!-- Placeholder text updated to "Ask Aethel" -->
            <input type="text" id="chatInput" class="chat-input" placeholder="Ask Aethel">
            
            <!-- Microphone icon placed to the right of the text -->
            <button class="mic-btn" title="Voice Input">
                <svg viewBox="0 0 24 24">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                </svg>
            </button>

            <!-- Circular button on the far right with vertical listening lines inside -->
            <button class="audio-circle-btn" title="Listening Mode">
                <div class="wave-bar wb-1"></div>
                <div class="wave-bar wb-2"></div>
                <div class="wave-bar wb-3"></div>
                <div class="wave-bar wb-4"></div>
            </button>
        </div>
    </div>

</body>
</html>
EOF

mkdir -p .github/workflows
cat << 'EOF' > .github/workflows/deploy.yml
name: Deploy to Pages

on:
  push:
    branches: ["main"]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.github_pages_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
EOF

git add .github/workflows/deploy.yml
git commit -m "Fix GitHub Pages deployment workflow"
git push origin main
git remote set-url origin https://github.com/Xer0Zer0/Command-Center.git
git push https://YOUR_TOKEN@github.com/Xer0Zer0/Command-Center.git main
code to verify Verify Repository Name and Branch
Confirm your repository is named Command-Center under Xer0Zer0, and your active deployment code is pushed to the main branc
