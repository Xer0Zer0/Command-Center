const http = require('http');
const fs = require('fs').promises;

const modules = [
    { key: 'corporate_identity', label: 'Corporate' },
    { key: 'commercial_operations', label: 'Commercial' },
    { key: 'community_engagement', label: 'Community' },
    { key: 'executive_management', label: 'Management' },
    { key: 'expansion_module', label: 'Expansion' },
    { key: 'system_administration', label: 'Systems' },
    { key: 'working_files', label: 'Staging' }
];

const server = http.createServer(async (req, res) => {
    const urlObj = new URL(req.url, `http://${req.headers.host}`);
    const pathname = urlObj.pathname;
    const currentCategory = urlObj.searchParams.get('cat') || '';

    // Updated to serve the interface at both the root '/' and '/app'
    if (pathname === '/' || pathname === '/app') {
        try {
            let activeCategoryLabel = 'Aethel';
            let pillarHTML = '';
            let fileListHTML = '';

            for (const mod of modules) {
                const processedDir = path.join(__dirname, mod.key, 'processed');
                let filesArr = [];
                try {
                    const dirFiles = await fs.readdir(processedDir);
                    filesArr = dirFiles.filter(f => f.endsWith('.json') || f.endsWith('.ndjson'));
                } catch (e) {}
                
                const fileCount = filesArr.length;

                if (currentCategory === mod.key) {
                    activeCategoryLabel = mod.label;
                    
                    if (fileCount === 0) {
                        fileListHTML = `<div style="color: #71717a; text-align: center; margin-top: 40px; font-size: 14px;">No records found in ${mod.label}</div>`;
                    } else {
                        for (const file of filesArr) {
                            try {
                                const content = await fs.readFile(path.join(processedDir, file), 'utf8');
                                fileListHTML += `
                                    <div style="background-color: #161618; border-radius: 14px; padding: 14px; margin-bottom: 10px; border: 1px solid #222226;">
                                        <div style="color: #34d399; font-size: 12px; font-weight: 600; margin-bottom: 4px;">${file}</div>
                                        <div style="color: #d4d4d8; font-size: 13px; word-break: break-all; white-space: pre-wrap; max-height: 100px; overflow-y: auto;">${content.substring(0, 300)}...</div>
                                    </div>
                                `;
                            } catch (err) {}
                        }
                    }
                }
                
                pillarHTML += `
                    <a href="/app?cat=${mod.key}" style="text-decoration: none;">
                        <div style="background-color: ${currentCategory === mod.key ? '#27272a' : '#161618'}; border-radius: 16px; padding: 14px 16px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; border: 1px solid ${currentCategory === mod.key ? '#3f3f46' : '#222226'};">
                            <div style="color: #f4f4f5; font-size: 14px; font-weight: 500;">${mod.label}</div>
                            <div style="background-color: #27272a; color: #34d399; width: 28px; height: 28px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 12px; font-weight: 600;">
                                ${fileCount}
                            </div>
                        </div>
                    </a>
                `;
            }

            const headerTitle = currentCategory ? activeCategoryLabel : 'Aethel';

            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
                    <title>Aethel Mobile Interface</title>
                    <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: #000; color: #fff; margin: 0; padding: 0; overflow-x: hidden; }
                        .header { display: flex; justify-content: space-between; align-items: center; padding: 18px 16px; position: sticky; top: 0; background-color: #000; z-index: 5; }
                        .header-title { font-size: 18px; font-weight: 600; display: flex; align-items: center; gap: 6px; color: #fff; text-decoration: none; }
                        
                        .header-avatar-badge { width: 42px; height: 42px; border-radius: 50%; background: #27272a; overflow: hidden; display: flex; align-items: center; justify-content: center; border: 1px solid #3f3f46; }
                        .header-avatar-badge img { width: 100%; height: 100%; object-fit: cover; }
                        
                        .content-body { padding: 8px 16px 120px 16px; }

                        .bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; background-color: #000; padding: 10px 16px 24px 16px; z-index: 10; display: flex; justify-content: center; }
                        .input-pill { background-color: #1c1c21; border-radius: 28px; border: 1px solid #2b2b33; display: flex; align-items: center; width: 100%; max-width: 500px; padding: 10px 14px; gap: 12px; }
                        .pill-icon { font-size: 20px; color: #d4d4d8; cursor: pointer; display: flex; align-items: center; justify-content: center; }
                        .pill-input-placeholder { flex-grow: 1; color: #71717a; font-size: 15px; user-select: none; }
                        
                        .pill-mic-btn { width: 38px; height: 38px; border-radius: 50%; background-color: #27272a; display: flex; align-items: center; justify-content: center; color: #a1a1aa; cursor: pointer; }
                        .pill-wave-btn { width: 38px; height: 38px; border-radius: 50%; background-color: #ffffff; display: flex; align-items: center; justify-content: center; color: #000000; cursor: pointer; font-size: 16px; font-weight: bold; }

                        .bottom-sheet { position: fixed; bottom: -100%; left: 0; right: 0; background-color: #121214; border-radius: 24px 24px 0 0; padding: 12px 16px 30px 16px; border-top: 1px solid #222226; max-height: 85vh; overflow-y: auto; transition: bottom 0.35s cubic-bezier(0.1, 0.9, 0.2, 1); z-index: 20; }
                        .bottom-sheet.open { bottom: 0; }
                        
                        .sheet-handle { width: 36px; height: 4px; background-color: #3f3f46; border-radius: 2px; margin: 0 auto 14px auto; cursor: pointer; }
                        
                        .tools-scroll { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 12px; scrollbar-width: none; }
                        .tools-scroll::-webkit-scrollbar { display: none; }
                        .tool-card { background-color: #1c1c21; border-radius: 16px; padding: 12px 10px; min-width: 70px; text-align: center; border: 1px solid #2b2b33; flex-shrink: 0; cursor: pointer; }
                        .tool-icon { font-size: 16px; margin-bottom: 4px; }
                        .tool-name { font-size: 11px; color: #d4d4d8; font-weight: 500; }

                        .categories-list { display: flex; flex-direction: column; gap: 6px; border-top: 1px solid #222226; padding-top: 12px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <a href="/app" class="header-title">
                            ${headerTitle} <span style="font-size: 11px; color: #a1a1aa;">▼</span>
                        </a>
                        <div class="header-avatar-badge" title="Aethel Profile">
                            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" alt="Aethel Profile">
                        </div>
                    </div>

                    <div class="content-body">
                        ${currentCategory ? fileListHTML : ''}
                    </div>

                    <div class="bottom-bar" id="bottomBar">
                        <div class="input-pill">
                            <div class="pill-icon" id="openBtn">+</div>
                            <div class="pill-input-placeholder">Ask Aethel</div>
                            <div class="pill-mic-btn" title="Voice Input">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v1a7 7 0 0 1-14 0v-1"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                            </div>
                            <div class="pill-wave-btn" title="Audio Wave">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="18" y2="18"></line><line x1="14" y1="3" x2="14" y2="21"></line><line x1="10" y1="8" x2="10" y2="16"></line><line x1="6" y1="10" x2="6" y2="14"></line><line x1="22" y1="10" x2="22" y2="14"></line></svg>
                            </div>
                        </div>
                    </div>

                    <div class="bottom-sheet" id="bottomSheet">
                        <div class="sheet-handle" id="closeBtn"></div>
                        
                        <div class="tools-scroll">
                            <div class="tool-card"><div class="tool-icon">🖼️</div><div class="tool-name">Photos</div></div>
                            <div class="tool-card"><div class="tool-icon">📷</div><div class="tool-name">Camera</div></div>
                            <div class="tool-card"><div class="tool-icon">📎</div><div class="tool-name">Files</div></div>
                            <div class="tool-card"><div class="tool-icon">📝</div><div class="tool-name">Note</div></div>
                            <div class="tool-card"><div class="tool-icon">🎬</div><div class="tool-name">Videos</div></div>
                        </div>

                        <div class="categories-list">
                            ${pillarHTML}
                        </div>
                    </div>

                    <script>
                        const openBtn = document.getElementById('openBtn');
                        const closeBtn = document.getElementById('closeBtn');
                        const bottomSheet = document.getElementById('bottomSheet');

                        openBtn.addEventListener('click', () => {
                            bottomSheet.classList.add('open');
                        });

                        closeBtn.addEventListener('click', () => {
                            bottomSheet.classList.remove('open');
                        });
                    </script>
                </body>
                </html>
            `);
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error loading interface.');
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(3000, '127.0.0.1', () => {
    console.log('Mobile UI updated to /app route.');
});
