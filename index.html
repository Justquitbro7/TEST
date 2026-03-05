let twitchWS = null;
let kickWS = null; 
let ttsQueue = [];
let isSpeaking = false;
let voicesList = [];
let messageHistory = new Set(); 
let activeTimers = [];

const KICK_BOTS = ["botrix", "kickbot", "streamelements", "nightbot", "moobot"];

async function loadVercelVars() {
    try {
        const response = await fetch('/api/config');
        const envConfig = await response.json();
        if(envConfig.twitchChannel) document.getElementById('twitchInput').value = envConfig.twitchChannel;
        if(envConfig.kickChannel) document.getElementById('kickInput').value = envConfig.kickChannel;
    } catch (error) {
        console.error("Failed to load Vercel variables", error);
    }
}

function log(m) {
    const audit = document.getElementById('auditLog');
    if (audit) { audit.value += `> ${m}\n`; audit.scrollTop = audit.scrollHeight; }
}

async function fetchKickID(username) {
    const target = `https://kick.com/api/v2/channels/${username}`;
    try {
        const res = await fetch(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(target)}`);
        const data = await res.json();
        if (data.chatroom && data.chatroom.id) return data.chatroom.id;
    } catch (e) {}
    try {
        const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(target)}`);
        const json = await res.json();
        const data = JSON.parse(json.contents);
        if (data.chatroom && data.chatroom.id) return data.chatroom.id;
    } catch (e) {}
    return null;
}

async function connectKick(username) {
    if (!username) return;
    if (kickWS) { kickWS.close(); log("Resetting Kick Bridge..."); }
    const chatroomId = await fetchKickID(username);
    if (!chatroomId) { log(`Kick Error: ID not found.`); return; }
    log(`Kick: ID ${chatroomId} Secured.`);
    kickWS = new WebSocket("wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679?protocol=7&client=js&version=8.4.0-rc2&flash=false");
    kickWS.onopen = () => { log("Kick: Socket Opened."); };
    kickWS.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.event === "pusher:connection_established") {
            kickWS.send(JSON.stringify({ event: "pusher:subscribe", data: { channel: `chatrooms.${chatroomId}.v2` } }));
        }
        if (data.event === "pusher_internal:subscription_succeeded") {
            log("Kick: Bridge Armed.");
            document.getElementById('ki-light').innerText = "KICK: ONLINE";
            document.getElementById('ki-light').style.background = "rgba(83,252,24,0.3)";
        }
        if (data.event === "App\\Events\\ChatMessageEvent") {
            const messageData = typeof data.data === 'string' ? JSON.parse(data.data) : data.data;
            const user = (messageData.sender && messageData.sender.username) ? messageData.sender.username : "Unknown";
            const msg = messageData.content || "";
            if (!KICK_BOTS.includes(user.toLowerCase())) { handleMessage(user, msg, 'KICK'); }
        }
    };
}

function connectTwitch(username) {
    if (!username) return;
    if (twitchWS) { 
        log("Twitch: Terminating old bridge...");
        twitchWS.onmessage = null;
        twitchWS.close(); 
        twitchWS = null; 
    }
    twitchWS = new WebSocket('wss://irc-ws.chat.twitch.tv:443');
    twitchWS.onopen = () => {
        twitchWS.send('PASS oauth:read_only');
        twitchWS.send('NICK justinfan' + Math.floor(Math.random() * 99999));
        twitchWS.send(`JOIN #${username.toLowerCase()}`);
        log(`Twitch: Bridge Armed.`);
        document.getElementById('tw-light').innerText = "TWITCH: ONLINE";
        document.getElementById('tw-light').style.background = "rgba(145,70,255,0.3)";
    };
    twitchWS.onmessage = (e) => {
        const lines = e.data.split('\r\n');
        lines.forEach(line => {
            if (line.includes('PING')) twitchWS.send('PONG :tmi.twitch.tv');
            if (line.includes('PRIVMSG')) {
                const user = line.split('!')[0].substring(1);
                const msg = line.split('PRIVMSG')[1].split(':')[1].trim();
                const msgId = `${user}-${msg}`.substring(0, 50);
                if (!messageHistory.has(msgId)) {
                    messageHistory.add(msgId);
                    handleMessage(user, msg, 'TWITCH');
                    if (messageHistory.size > 50) {
                        const firstItem = messageHistory.values().next().value;
                        messageHistory.delete(firstItem);
                    }
                }
            }
        });
    };
}

window.masterInitialize = function() {
    log("JAILEX: Engaging Protocols...");
    const tw = document.getElementById('twitchInput').value.trim();
    const ki = document.getElementById('kickInput').value.trim();
    showTab('dash');
    if (tw) connectTwitch(tw);
    if (ki) connectKick(ki);
    ttsQueue.push("Engine engaged.");
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(""));
    generateOverlayUrl(tw, ki);
}

window.handleMessage = function(user, msg, platform) {
    const preview = document.getElementById('chat-preview');
    const color = platform === 'TWITCH' ? '#9146FF' : '#53FC18';
    preview.innerHTML += `<div><strong style="color:${color}">[${platform}] ${user}:</strong> ${msg}</div>`;
    preview.scrollTop = preview.scrollHeight;

    if (document.getElementById('ttsEnabled').checked && !msg.startsWith('!')) {
        const readUser = document.getElementById('readUserToggle').checked;
        const textToSpeak = readUser ? `${user} says ${msg}` : msg;
        ttsQueue.push(textToSpeak);
    }
}

setInterval(() => {
    if (isSpeaking || ttsQueue.length === 0) return;
    isSpeaking = true;
    const next = ttsQueue.shift();
    const utterance = new SpeechSynthesisUtterance(next);
    const voiceIdx = document.getElementById('voiceSelect').value;
    if (voicesList[voiceIdx]) utterance.voice = voicesList[voiceIdx];
    utterance.onend = () => { isSpeaking = false; };
    utterance.onerror = () => { isSpeaking = false; };
    window.speechSynthesis.speak(utterance);
}, 100);

window.addVoiceCommand = function() {
    const user = document.getElementById('cmdUser').value.trim();
    const msg = document.getElementById('cmdMessage').value.trim();
    const interval = parseInt(document.getElementById('cmdInterval').value) * 60000;
    if (!msg || isNaN(interval)) { alert("Please enter a message and time."); return; }
    const timerId = setInterval(() => {
        const finalSpeech = user ? `${user} says ${msg}` : msg;
        ttsQueue.push(finalSpeech);
        log(`Auto-Command Fired: ${finalSpeech}`);
    }, interval);
    activeTimers.push({ timerId, msg, interval: interval/60000 });
    updateCommandList();
}

window.updateCommandList = function() {
    const list = document.getElementById('activeCommands');
    list.innerHTML = activeTimers.map((t, i) => `
        <div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:10px; margin-bottom:5px; display:flex; justify-content:space-between; align-items:center;">
            <span>"${t.msg}" (${t.interval} min)</span>
            <button onclick="removeCommand(${i})" style="background:red; border:none; color:white; border-radius:5px; cursor:pointer; padding:5px 10px;">X</button>
        </div>`).join('');
}

window.removeCommand = function(index) {
    clearInterval(activeTimers[index].timerId);
    activeTimers.splice(index, 1);
    updateCommandList();
}

window.showTab = function(id) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.getElementById('btn-' + id).classList.add('active');
}

window.generateOverlayUrl = function(tw, ki) {
    const fs = document.getElementById('overlayFS').value || '22';
    const stay = document.getElementById('overlayTime').value || '15';
    const alpha = (document.getElementById('overlayAlpha').value || '70') / 100;

    fetchKickID(ki).then(id => {
        const idToUse = id || '92474944'; 
        const baseUrl = window.location.href.split('index.html')[0].split('app.html')[0];
        const url = `${baseUrl}overlay.html?twitch=${tw}&kick=${idToUse}&size=${fs}&stay=${stay}&alpha=${alpha}`;
        document.getElementById('copy-url-display').innerText = url;
    });
}

window.copyOverlayUrl = function() {
    const url = document.getElementById('copy-url-display').innerText;
    navigator.clipboard.writeText(url).then(() => alert("Overlay URL Copied!"));
}

window.initMobileCam = function() {
    const sID = "jailex_" + Math.random().toString(36).substring(7);
    const pU = `https://vdo.ninja/?push=${sID}&webcam&autostart&cleanoutput&quality=1&facing=user`;
    const vU = `https://vdo.ninja/?view=${sID}&autoplay&cleanoutput`;
    
    document.getElementById('cam-container').innerHTML = `<iframe allow="camera;microphone;fullscreen;autoplay" src="${pU}" style="width:100%; height:100%; border:none;"></iframe>`;
    document.getElementById('cam-url-display').innerText = vU;
    document.getElementById('cam-link-box').style.display = "block";
    
    const btn = document.getElementById('init-cam-btn');
    btn.innerText = "CAMERA ACTIVE";
    btn.style.background = "var(--kick-green)";
}

window.copyCamUrl = function() { 
    navigator.clipboard.writeText(document.getElementById('cam-url-display').innerText).then(() => alert("Camera URL Copied!")); 
}

let voiceLoadAttempts = 0;
window.loadVoices = function() {
    voicesList = window.speechSynthesis.getVoices();
    const s = document.getElementById('voiceSelect');
    if (s && voicesList.length > 0) {
        s.innerHTML = ''; 
        voicesList.forEach((v, i) => { s.innerHTML += `<option value="${i}">${v.name} (${v.lang})</option>`; }); 
    }
}

window.attemptVoiceLoad = function() {
    loadVoices();
    if (voicesList.length <= 1 && voiceLoadAttempts < 20) {
        voiceLoadAttempts++;
        setTimeout(attemptVoiceLoad, 250); 
    }
}

window.onload = () => { 
    attemptVoiceLoad(); 
    if(speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices; 
    }
    loadVercelVars();
};

window.testAudio = function() { ttsQueue.push("Jailex audio engine check."); }
