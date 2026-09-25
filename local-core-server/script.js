function openDrawer() { 
    const drawer = document.getElementById('sideDrawer');
    const overlay = document.getElementById('drawerOverlay');
    drawer.classList.add('open'); 
    overlay.style.display = 'block'; 
}

function closeDrawer() { 
    const drawer = document.getElementById('sideDrawer');
    const overlay = document.getElementById('drawerOverlay');
    drawer.classList.remove('open'); 
    overlay.style.display = 'none'; 
}

function openUtility() { 
    document.getElementById('utilityOverlay').style.display = 'flex'; 
}

function closeUtility() { 
    document.getElementById('utilityOverlay').style.display = 'none'; 
}

function setCategory(el, name) {
    const items = document.querySelectorAll('.utility-list-item');
    items.forEach(i => i.classList.remove('active'));
    el.classList.add('active');
    closeUtility();
    const inputBar = document.getElementById('inputBar');
    inputBar.value = '[' + name + '] ';
    inputBar.focus();
    handleInput();
}

function selectUtility(type) {
    closeUtility();
    const inputBar = document.getElementById('inputBar');
    inputBar.value = '[' + type + '] ';
    inputBar.focus();
    handleInput();
}

let sttRecognition = null;

function startSpeechToText() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert('Speech recognition is not supported in this browser.');
        return;
    }
    const micBtn = document.getElementById('micBtn');
    const inputBar = document.getElementById('inputBar');

    if (sttRecognition) {
        try { sttRecognition.stop(); } catch(e){}
        sttRecognition = null;
        micBtn.style.color = '#a1a1aa';
        return;
    }

    sttRecognition = new SpeechRecognition();
    sttRecognition.continuous = false;
    sttRecognition.interimResults = true;
    sttRecognition.lang = 'en-US';

    micBtn.style.color = '#3b82f6';
    inputBar.placeholder = 'Listening... Speak now...';

    sttRecognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }
        inputBar.value = transcript;
        handleInput();
    };

    sttRecognition.onerror = () => {
        micBtn.style.color = '#a1a1aa';
        inputBar.placeholder = 'Ask Aethel...';
        sttRecognition = null;
    };

    sttRecognition.onend = () => {
        micBtn.style.color = '#a1a1aa';
        inputBar.placeholder = 'Ask Aethel...';
        sttRecognition = null;
    };

    try {
        sttRecognition.start();
    } catch(e) {
        micBtn.style.color = '#a1a1aa';
        inputBar.placeholder = 'Ask Aethel...';
        sttRecognition = null;
    }
}

function handleInput() {
    const val = document.getElementById('inputBar').value.trim();
    const btn = document.getElementById('actionEndBtn');
    const inner = document.getElementById('actionEndInner');
    if (val.length > 0) {
        btn.style.background = '#3b82f6';
        inner.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>';
    } else {
        btn.style.background = 'linear-gradient(135deg, #3b82f6, #8b5cf6)';
        inner.innerHTML = '<img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" alt="Aethel" style="width: 100%; height: 100%; object-fit: cover; pointer-events: none;" />';
    }
}

function handleActionClick() {
    const val = document.getElementById('inputBar').value.trim();
    if (val.length > 0) {
        handleSendMessage();
    } else {
        alert('Aethel Live Voice Ready');
    }
}

function handleSendMessage() {
    const inputBar = document.getElementById('inputBar');
    const val = inputBar.value.trim();
    const chatContainer = document.getElementById('chatContainer');
    const btn = document.getElementById('actionEndBtn');
    const inner = document.getElementById('actionEndInner');
    if (val.length > 0) {
        const userRow = document.createElement('div');
        userRow.className = 'message-row user';
        userRow.innerHTML = '<div class="message">' + val.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div>';
        chatContainer.appendChild(userRow);
        inputBar.value = '';
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        btn.style.background = 'linear-gradient(135deg, #3b82f6, #8b5cf6)';
        inner.innerHTML = '<img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" alt="Aethel" style="width: 100%; height: 100%; object-fit: cover; pointer-events: none;" />';
        
        setTimeout(() => {
            let replyText = "I've logged your request under \"" + val + "\". How would you like to proceed?";
            const botRow = document.createElement('div');
            botRow.className = 'message-row assistant';
            botRow.innerHTML = '<div class="message">' + replyText + '</div>';
            chatContainer.appendChild(botRow);
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, 500);
    }
}

function handleKey(e) { 
    if (e.key === 'Enter') { 
        handleSendMessage(); 
    } 
}
