// AI Chatbot JavaScript - Full-page chatbot
// Shares history with widget popup via SHARED_HISTORY_KEY in sessionStorage

const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const typingIndicator = document.getElementById('typingIndicator');
const voiceBtn = document.getElementById('voiceBtn');

// ============= SHARED HISTORY — single source of truth =============
// Format: [{message: string, type: 'user'|'ai', timestamp: string}]
const SHARED_HISTORY_KEY = 'ai_shared_history';
const MAX_HISTORY_ITEMS = 50;
let chatHistory = [];

// One-time migration from old keys to new shared key
(function migrateOldHistory() {
    if (sessionStorage.getItem(SHARED_HISTORY_KEY)) return;
    const oldFull = sessionStorage.getItem('ai_chat_history');
    if (oldFull) {
        try { sessionStorage.setItem(SHARED_HISTORY_KEY, oldFull); } catch (e) {}
        sessionStorage.removeItem('ai_chat_history');
    }
    sessionStorage.removeItem('ai_widget_history');
})();

// Conversation memory — shared with widget
let conversationId = sessionStorage.getItem('ai_conversation_id');
if (!conversationId) {
    conversationId = 'conv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    sessionStorage.setItem('ai_conversation_id', conversationId);
}

let recognition = null;
let isListening = false;
let useStreaming = true;

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    loadAndRenderHistory();
    initVoiceRecognition();
    messageInput.focus();
});

// ============= VOICE =============
function initVoiceRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SR();
        recognition.lang = 'vi-VN';
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.onresult = function (e) { messageInput.value = e.results[0][0].transcript; stopVoiceInput(); };
        recognition.onerror = function () { stopVoiceInput(); showToast('Lỗi nhận diện giọng nói', 'error'); };
        recognition.onend = function () { stopVoiceInput(); };
    } else if (voiceBtn) {
        voiceBtn.style.display = 'none';
    }
}
function toggleVoiceInput() {
    if (!recognition) { showToast('Trình duyệt không hỗ trợ', 'warning'); return; }
    isListening ? stopVoiceInput() : startVoiceInput();
}
function startVoiceInput() { if (!recognition) return; isListening = true; voiceBtn.classList.add('active'); recognition.start(); showToast('Đang lắng nghe...', 'info'); }
function stopVoiceInput() { isListening = false; if (voiceBtn) voiceBtn.classList.remove('active'); if (recognition) recognition.stop(); }

// ============= SHARED HISTORY =============
function loadSharedHistory() {
    try {
        const saved = sessionStorage.getItem(SHARED_HISTORY_KEY);
        chatHistory = saved ? JSON.parse(saved) : [];
    } catch (e) {
        console.error('Error loading history:', e);
        chatHistory = [];
    }
}

function saveSharedHistory() {
    try {
        if (chatHistory.length > MAX_HISTORY_ITEMS) chatHistory = chatHistory.slice(-MAX_HISTORY_ITEMS);
        sessionStorage.setItem(SHARED_HISTORY_KEY, JSON.stringify(chatHistory));
    } catch (e) {
        console.error('Error saving history:', e);
    }
}

/** Load shared history and render all messages into UI */
function loadAndRenderHistory() {
    loadSharedHistory();
    addWelcomeMessage();
    chatHistory.forEach(item => renderHistoryMessage(item.message, item.type, item.timestamp));
    if (chatHistory.length > 0) scrollToBottom();
}

/** Render one history item (display only, no save) */
function renderHistoryMessage(message, type, timestamp) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    const msgId = 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    const time = timestamp ? new Date(timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '';

    if (type === 'ai') {
        messageDiv.innerHTML = `
            <div class="message-icon"><i class="fas fa-robot"></i></div>
            <div>
                <div class="message-content" id="${msgId}">${formatMessage(message)}</div>
                <div class="message-actions">
                    <button class="action-btn" onclick="copyMessage('${msgId}')"><i class="fas fa-copy"></i> Sao chép</button>
                    <button class="action-btn" onclick="speakMessage('${msgId}')"><i class="fas fa-volume-up"></i> Đọc</button>
                </div>
                <div class="message-time">${time}</div>
            </div>`;
    } else {
        messageDiv.innerHTML = `
            <div>
                <div class="message-content" id="${msgId}">${escapeHtml(message)}</div>
                <div class="message-time">${time}</div>
            </div>
            <div class="message-icon"><i class="fas fa-user"></i></div>`;
    }
    chatMessages.appendChild(messageDiv);
}

function clearChat() {
    if (!confirm('Bạn có chắc muốn xóa toàn bộ lịch sử chat?')) return;
    chatMessages.innerHTML = '';
    chatHistory = [];
    sessionStorage.removeItem(SHARED_HISTORY_KEY);
    if (conversationId) fetch(`/api/ai/conversation/${conversationId}`, { method: 'DELETE' }).catch(() => {});
    conversationId = 'conv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    sessionStorage.setItem('ai_conversation_id', conversationId);
    addWelcomeMessage();
    showToast('Đã xóa lịch sử chat', 'success');
}

function addWelcomeMessage() {
    const d = document.createElement('div');
    d.className = 'message ai';
    d.innerHTML = `
        <div class="message-icon"><i class="fas fa-robot"></i></div>
        <div><div class="message-content">
            <strong>Xin chào! 👋</strong><br><br>
            Tôi là <strong>Trợ lý AI thời trang</strong> của cửa hàng. Tôi có thể giúp bạn:<br><br>
            <div style="display:grid;gap:8px;">
                <div>✨ <strong>Tìm kiếm sản phẩm</strong> phù hợp với phong cách của bạn</div>
                <div>💰 <strong>Tư vấn về giá cả</strong> và chất lượng</div>
                <div>👔 <strong>Gợi ý cách phối đồ</strong> cho nhiều dịp khác nhau</div>
                <div>📏 <strong>Hướng dẫn chọn size</strong> chính xác</div>
                <div>🎁 <strong>Thông tin khuyến mãi</strong> mới nhất</div>
            </div><br><em>Hãy hỏi tôi bất cứ điều gì bạn cần! 😊</em>
        </div><div class="message-time">Vừa xong</div></div>`;
    chatMessages.appendChild(d);
}

// ============= MESSAGING =============
function sendQuickMessage(msg) { messageInput.value = msg; sendMessage(); }

async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) { messageInput.focus(); return; }

    addMessage(message, 'user');
    chatHistory.push({ message, type: 'user', timestamp: new Date().toISOString() });
    saveSharedHistory();

    messageInput.value = '';
    messageInput.focus();
    typingIndicator.classList.add('active');

    if (useStreaming) { await sendMessageStreaming(message); }
    else { await sendMessageBlocking(message); }
}

async function sendMessageStreaming(message) {
    const messageId = 'msg_' + Date.now();
    const messageDiv = createAiMessageBubble(messageId);
    chatMessages.appendChild(messageDiv);
    scrollToBottom();

    const contentEl = document.getElementById(messageId);
    let fullResponse = '';

    try {
        const enc = encodeURIComponent(message);
        const conv = conversationId ? `&conversationId=${encodeURIComponent(conversationId)}` : '';
        const tok = (typeof getAccessToken === 'function' ? getAccessToken() : localStorage.getItem('accessToken'));
        const tokP = tok ? `&token=${encodeURIComponent(tok)}` : '';
        const es = new EventSource(`/api/ai/chat/stream?message=${enc}${conv}${tokP}`);

        es.onmessage = function (ev) {
            if (ev.data === '[DONE]') return;
            fullResponse += ev.data;
            contentEl.innerHTML = formatMessage(fullResponse);
            scrollToBottom();
        };
        es.addEventListener('done', function () {
            es.close();
            typingIndicator.classList.remove('active');
            chatHistory.push({ message: fullResponse, type: 'ai', timestamp: new Date().toISOString() });
            saveSharedHistory();
        });
        es.onerror = function () {
            es.close();
            typingIndicator.classList.remove('active');
            if (!fullResponse) { messageDiv.remove(); sendMessageBlocking(message); }
        };
    } catch (e) {
        console.error('Streaming error:', e);
        typingIndicator.classList.remove('active');
        messageDiv.remove();
        sendMessageBlocking(message);
    }
}

async function sendMessageBlocking(message) {
    try {
        const conv = conversationId ? `?conversationId=${encodeURIComponent(conversationId)}` : '';
        const res = await fetch(`/api/ai/chat${conv}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(message)
        });
        if (!res.ok) throw new Error('Network error');
        const data = await res.json();
        const aiText = data.response || data;
        addMessage(aiText, 'ai');
        chatHistory.push({ message: aiText, type: 'ai', timestamp: new Date().toISOString() });
        saveSharedHistory();
    } catch (e) {
        console.error('Error:', e);
        addMessage('Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau. 😔', 'ai');
        showToast('Lỗi kết nối đến AI', 'error');
    } finally {
        typingIndicator.classList.remove('active');
    }
}

function createAiMessageBubble(messageId) {
    const d = document.createElement('div');
    d.className = 'message ai';
    d.innerHTML = `
        <div class="message-icon"><i class="fas fa-robot"></i></div>
        <div>
            <div class="message-content" id="${messageId}"><span class="streaming-cursor">▌</span></div>
            <div class="message-actions">
                <button class="action-btn" onclick="copyMessage('${messageId}')"><i class="fas fa-copy"></i> Sao chép</button>
                <button class="action-btn" onclick="speakMessage('${messageId}')"><i class="fas fa-volume-up"></i> Đọc</button>
                <button class="action-btn feedback-btn" onclick="sendFeedback('${messageId}','POSITIVE')"><i class="fas fa-thumbs-up"></i></button>
                <button class="action-btn feedback-btn" onclick="sendFeedback('${messageId}','NEGATIVE')"><i class="fas fa-thumbs-down"></i></button>
            </div>
            <div class="message-time">${getCurrentTime()}</div>
        </div>`;
    return d;
}

function addMessage(text, type) {
    const d = document.createElement('div');
    d.className = `message ${type}`;
    const time = getCurrentTime();
    const id = 'msg_' + Date.now();
    if (type === 'ai') {
        d.innerHTML = `
            <div class="message-icon"><i class="fas fa-robot"></i></div>
            <div>
                <div class="message-content" id="${id}">${formatMessage(text)}</div>
                <div class="message-actions">
                    <button class="action-btn" onclick="copyMessage('${id}')"><i class="fas fa-copy"></i> Sao chép</button>
                    <button class="action-btn" onclick="speakMessage('${id}')"><i class="fas fa-volume-up"></i> Đọc</button>
                    <button class="action-btn feedback-btn" onclick="sendFeedback('${id}','POSITIVE')"><i class="fas fa-thumbs-up"></i></button>
                    <button class="action-btn feedback-btn" onclick="sendFeedback('${id}','NEGATIVE')"><i class="fas fa-thumbs-down"></i></button>
                </div>
                <div class="message-time">${time}</div>
            </div>`;
    } else {
        d.innerHTML = `
            <div><div class="message-content" id="${id}">${escapeHtml(text)}</div><div class="message-time">${time}</div></div>
            <div class="message-icon"><i class="fas fa-user"></i></div>`;
    }
    chatMessages.appendChild(d);
    scrollToBottom();
}

// ============= FORMAT =============
function formatMessage(text) {
    if (typeof text !== 'string') text = String(text);
    text = fixStuckVietnamese(text);
    text = text.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n');
    text = text.replace(/^(\d+\.)\s*/gm, '$1 ').replace(/^([•\-*])\s*/gm, '$1 ');

    if (typeof marked !== 'undefined') {
        try {
            marked.setOptions({ breaks: true, gfm: true, headerIds: false, mangle: false, smartLists: true, smartypants: true });
            const renderer = new marked.Renderer();
            renderer.link = function (href, title, text) {
                const t = title ? ` title="${title}"` : '';
                if (href && href.startsWith('/')) return `<a href="${href}"${t} class="chat-link chat-link-internal">${text}</a>`;
                return `<a href="${href}" target="_blank" rel="noopener noreferrer"${t} class="chat-link">${text}</a>`;
            };
            let html = marked.parse(text, { renderer });
            if (typeof DOMPurify !== 'undefined') {
                html = DOMPurify.sanitize(html, {
                    ALLOWED_TAGS: ['strong','em','code','pre','br','p','ul','ol','li','h1','h2','h3','h4','h5','h6','a','blockquote','table','thead','tbody','tr','th','td','hr','span','div','img'],
                    ALLOWED_ATTR: ['href','target','rel','style','class','src','alt']
                });
            }
            html = html.replace(/(\d{1,3}(?:[.,]\d{3})*(?:,\d+)?)\s*(?:đ|₫|VND|vnđ)/gi, '<span class="price-highlight">$1₫</span>');
            return html;
        } catch (e) { console.warn('marked error:', e); }
    }
    let f = escapeHtml(text);
    f = f.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>');
    f = f.replace(/^[•\-*]\s+(.+)$/gm, '<li>$1</li>');
    f = f.replace(/(\d{1,3}(?:\.\d{3})*(?:,\d+)?)\s*(?:đ|₫|VND|vnđ)/gi, '<span class="price-highlight">$1₫</span>');
    f = f.replace(/\n/g, '<br>');
    return f;
}

function escapeHtml(text) { const d = document.createElement('div'); d.textContent = text; return d.innerHTML; }

function fixStuckVietnamese(text) {
    if (!text || typeof text !== 'string') return text;
    const vnL = 'a-zàáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ';
    const vnU = 'A-ZÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÈÉẺẼẸÊẾỀỂỄỆÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴĐ';
    text = text.replace(new RegExp(`([${vnL}])([${vnU}])`, 'g'), '$1 $2');

    const vowels = 'aàáảãạăắằẳẵặâấầẩẫậeèéẻẽẹêếềểễệiìíỉĩịoòóỏõọôốồổỗộơớờởỡợuùúủũụưứừửữựyỳýỷỹỵ';
    const vnV = `[${vowels}${vowels.toUpperCase()}]`;
    const ic = '(?:ngh|ng|nh|gh|gi|ch|kh|ph|th|tr|qu|b|c|d|đ|g|h|k|l|m|n|p|r|s|t|v|x)';
    const fc = '(?:ch|ng|nh|[nmctpk])';
    const diacV = '[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÈÉẺẼẸÊẾỀỂỄỆÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴ]';
    const sb1 = new RegExp(`(${vnV}+${fc})(${ic}${vnV})`, 'gi');
    const sb2 = new RegExp(`(${vnV}{2,})(${ic}${vnV})`, 'gi');
    const sb3a = new RegExp(`(${diacV})(${ic}${vnV})`, 'gi');
    const sb3b = new RegExp(`(${vnV})(${ic}${diacV})`, 'gi');
    const vnDiac = /[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÈÉẺẼẸÊẾỀỂỄỆÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴĐ]/;

    const protectedRe = /https?:\/\/\S+|\[[^\]]*\]\([^)]*\)|\([^)]*\)|[a-zA-Z0-9]+-[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)+|\/[a-zA-Z0-9\/_.%-]+|`[^`]+`|<[^>]+>|\*\*[^*]+\*\*|\d[\d.,]+\s*(?:VND|₫|đ)/g;
    let result = '', lastIdx = 0, m;
    while ((m = protectedRe.exec(text)) !== null) {
        result += _breakSeg(text.substring(lastIdx, m.index), sb1, sb2, sb3a, sb3b, vnDiac);
        result += m[0];
        lastIdx = protectedRe.lastIndex;
    }
    result += _breakSeg(text.substring(lastIdx), sb1, sb2, sb3a, sb3b, vnDiac);
    return result.replace(/ {2,}/g, ' ');
}
function _breakSeg(text, sb1, sb2, sb3a, sb3b, vnDiac) {
    if (!text || text.length < 4) return text;
    const wordRe = /[a-zA-ZàáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÈÉẺẼẸÊẾỀỂỄỆÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴĐ]+/g;
    return text.replace(wordRe, function(w) {
        if (w.length < 10 && !vnDiac.test(w)) return w;
        sb1.lastIndex = 0; sb2.lastIndex = 0;
        if (!vnDiac.test(w) && !sb1.test(w) && !sb2.test(w)) return w;
        let r = w, p, i = 0;
        do {
            p = r;
            sb1.lastIndex = 0; r = r.replace(sb1, '$1 $2');
            sb2.lastIndex = 0; r = r.replace(sb2, '$1 $2');
            sb3a.lastIndex = 0; r = r.replace(sb3a, '$1 $2');
            sb3b.lastIndex = 0; r = r.replace(sb3b, '$1 $2');
            i++;
        } while (r !== p && i < 20);
        return r;
    });
}

// ============= UTILS =============
function getCurrentTime() { const n = new Date(); return n.getHours().toString().padStart(2,'0') + ':' + n.getMinutes().toString().padStart(2,'0'); }
function scrollToBottom() { chatMessages.scrollTop = chatMessages.scrollHeight; }
function handleKeyPress(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }

function copyMessage(id) {
    const el = document.getElementById(id); if (!el) return;
    navigator.clipboard.writeText(el.innerText || el.textContent)
        .then(() => showToast('Đã sao chép', 'success')).catch(() => showToast('Không thể sao chép', 'error'));
}

async function sendFeedback(msgId, rating) {
    try {
        await fetch('/api/ai/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messageId: msgId, conversationId, rating }) });
        const el = document.getElementById(msgId);
        if (el) {
            const ad = el.parentElement.querySelector('.message-actions');
            if (ad) { ad.querySelectorAll('.feedback-btn').forEach(b => { b.disabled = true; b.style.opacity = '0.5'; });
                const ic = rating === 'POSITIVE' ? 'fa-thumbs-up' : 'fa-thumbs-down';
                const sb = ad.querySelector(`.feedback-btn .${ic}`)?.parentElement;
                if (sb) { sb.style.opacity = '1'; sb.style.color = rating === 'POSITIVE' ? '#10b981' : '#ef4444'; }
            }
        }
        showToast(rating === 'POSITIVE' ? 'Cảm ơn phản hồi! 👍' : 'Cảm ơn, chúng tôi sẽ cải thiện! 🙏', 'success');
    } catch (e) { console.error('Feedback error:', e); }
}

function speakMessage(id) {
    const el = document.getElementById(id); if (!el) return;
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(el.innerText || el.textContent);
        u.lang = 'vi-VN'; u.rate = 1.0; u.pitch = 1.0;
        window.speechSynthesis.speak(u);
        showToast('Đang đọc...', 'info');
    } else { showToast('Trình duyệt không hỗ trợ', 'warning'); }
}

// ============= TOAST =============
function showToast(message, type = 'info') {
    const c = document.getElementById('toastContainer'); if (!c) return;
    const t = document.createElement('div'); t.className = `custom-toast toast-${type}`;
    const icons = { success:'fa-check-circle', error:'fa-exclamation-circle', warning:'fa-exclamation-triangle', info:'fa-info-circle' };
    const colors = { success:'#10b981', error:'#ef4444', warning:'#f59e0b', info:'#667eea' };
    t.innerHTML = `<div style="display:flex;align-items:center;gap:10px;"><i class="fas ${icons[type]}" style="color:${colors[type]};font-size:20px;"></i><span style="color:#333;font-weight:500;">${message}</span></div>`;
    c.appendChild(t);
    setTimeout(() => { t.style.animation = 'slideOutRight 0.3s ease'; setTimeout(() => t.remove(), 300); }, 3000);
}

// ============= DARK MODE =============
let isDarkMode = false;
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);
    const i = document.querySelector('.btn-icon i.fa-moon'); if (i) i.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
    showToast(isDarkMode ? 'Đã bật chế độ tối' : 'Đã tắt chế độ tối', 'info');
    localStorage.setItem('darkMode', isDarkMode);
}
if (localStorage.getItem('darkMode') === 'true') toggleDarkMode();
chatMessages.addEventListener('click', () => messageInput.focus());
