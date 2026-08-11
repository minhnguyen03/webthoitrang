/**
 * AI Chatbot Floating Widget
 * Shares history with full-page chatbot via SHARED_HISTORY_KEY in sessionStorage.
 * Streaming SSE, voice input, context-aware quick actions.
 */

// ============= STATE =============
let widgetOpen = false;
let widgetUnread = 0;
let widgetVoiceRecognition = null;
let widgetIsListening = false;
let autoShowTimer = null;

// ============= SHARED HISTORY — single source of truth =============
// Same key as ai-chatbot.js → perfect sync
// Format: [{message: string, type: 'user'|'ai', timestamp: string}]
const SHARED_HISTORY_KEY = 'ai_shared_history';
const MAX_HISTORY = 100;
let sharedHistory = [];

// One-time migration from old keys to new shared key
(function migrateOldHistoryWidget() {
    if (sessionStorage.getItem(SHARED_HISTORY_KEY)) return;
    const oldFull = sessionStorage.getItem('ai_chat_history');
    if (oldFull) {
        try { sessionStorage.setItem(SHARED_HISTORY_KEY, oldFull); } catch (e) {}
        sessionStorage.removeItem('ai_chat_history');
    }
    sessionStorage.removeItem('ai_widget_history');
})();

// Conversation memory — shared with full-page chatbot
let widgetConversationId = sessionStorage.getItem('ai_conversation_id');
if (!widgetConversationId) {
    widgetConversationId = 'conv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    sessionStorage.setItem('ai_conversation_id', widgetConversationId);
}

// ============= INITIALIZATION =============
document.addEventListener('DOMContentLoaded', function () {
    loadAndRenderWidgetHistory();
    initWidgetVoice();
    initQuickActions();

    autoShowTimer = setTimeout(function () {
        if (!widgetOpen) {
            const tooltip = document.getElementById('fabTooltip');
            if (tooltip) { tooltip.style.display = 'block'; setTimeout(() => { tooltip.style.display = 'none'; }, 5000); }
        }
    }, 30000);
});

// ============= SHARED HISTORY =============
function loadSharedHistoryWidget() {
    try {
        const saved = sessionStorage.getItem(SHARED_HISTORY_KEY);
        sharedHistory = saved ? JSON.parse(saved) : [];
    } catch (e) { console.error('Widget history load error:', e); sharedHistory = []; }
}

function saveSharedHistoryWidget() {
    try {
        if (sharedHistory.length > MAX_HISTORY) sharedHistory = sharedHistory.slice(-MAX_HISTORY);
        sessionStorage.setItem(SHARED_HISTORY_KEY, JSON.stringify(sharedHistory));
    } catch (e) { console.error('Widget history save error:', e); }
}

/** Load shared history and render into widget UI */
function loadAndRenderWidgetHistory() {
    loadSharedHistoryWidget();

    const container = document.getElementById('widgetMessages');
    if (!container) return;

    if (sharedHistory.length > 0) {
        // Render all history messages
        sharedHistory.forEach(item => {
            const time = item.timestamp
                ? new Date(item.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                : '';
            const html = item.type === 'ai' ? formatWidgetMessage(item.message) : escapeWidgetHtml(item.message);
            appendWidgetBubble(item.type, html, time, false);
        });
        scrollWidgetToBottom();
    } else {
        showWidgetWelcome();
    }
}

// ============= TOGGLE =============
function toggleChatWidget() {
    const popup = document.getElementById('chatbotPopup');
    if (!popup) return;

    if (widgetOpen) {
        popup.classList.add('closing');
        setTimeout(() => { popup.style.display = 'none'; popup.classList.remove('closing'); }, 250);
        widgetOpen = false;
    } else {
        popup.style.display = 'flex';
        popup.classList.remove('closing');
        widgetOpen = true;
        widgetUnread = 0;
        updateWidgetBadge();

        const tooltip = document.getElementById('fabTooltip');
        if (tooltip) tooltip.style.display = 'none';
        if (autoShowTimer) { clearTimeout(autoShowTimer); autoShowTimer = null; }

        setTimeout(() => { const input = document.getElementById('widgetInput'); if (input) input.focus(); }, 350);
        scrollWidgetToBottom();
    }
}

document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && widgetOpen) toggleChatWidget(); });

// ============= QUICK ACTIONS =============
function initQuickActions() {
    const path = window.location.pathname;
    const container = document.getElementById('chatbotQuickActions');
    if (!container) return;

    const pageActions = {
        '/products/': ['Hỏi về sản phẩm này', 'So sánh sản phẩm', 'Kiểm tra tồn kho'],
        '/products': ['Tìm sản phẩm hot', 'Tư vấn phong cách', 'Sản phẩm giảm giá'],
        '/cart': ['Tư vấn thanh toán', 'Áp mã giảm giá', 'Xem điểm thưởng'],
        '/orders': ['Kiểm tra đơn hàng', 'Hỗ trợ đổi trả', 'Chính sách giao hàng'],
        '/profile': ['Điểm thưởng của tôi', 'Lịch sử mua hàng', 'Tư vấn size'],
        '/': ['Sản phẩm bán chạy', 'Khuyến mãi mới', 'Tư vấn phong cách']
    };

    let actions = null;
    for (const [pattern, acts] of Object.entries(pageActions)) {
        if (pattern !== '/' && path.startsWith(pattern)) { actions = acts; break; }
    }
    if (!actions) actions = pageActions['/'] || ['Tư vấn thời trang', 'Khuyến mãi', 'Hỗ trợ'];

    container.innerHTML = actions.map(text =>
        `<button class="chatbot-quick-btn" onclick="sendQuickAction('${text}')">${text}</button>`
    ).join('');
}

function sendQuickAction(text) {
    const input = document.getElementById('widgetInput');
    if (input) { input.value = text; sendWidgetMessage(); }
}

// ============= WELCOME =============
function showWidgetWelcome() {
    const welcomeHtml = `
        <strong>Xin chào! 👋</strong><br><br>
        Tôi là <strong>Trợ lý AI Thời Trang</strong>. Tôi có thể giúp bạn:<br><br>
        ✨ Tìm kiếm & tư vấn sản phẩm<br>
        📏 Hướng dẫn chọn size<br>
        🎁 Thông tin khuyến mãi<br>
        📦 Kiểm tra đơn hàng<br>
        💳 Hỗ trợ thanh toán<br><br>
        <em>Hãy hỏi tôi bất cứ điều gì! 😊</em>
    `;
    appendWidgetBubble('ai', welcomeHtml, getCurrentWidgetTime(), false);
}

// ============= MESSAGING =============
function handleWidgetKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); sendWidgetMessage(); }
}

async function sendWidgetMessage() {
    const input = document.getElementById('widgetInput');
    if (!input) return;
    const message = input.value.trim();
    if (!message) return;

    const time = getCurrentWidgetTime();
    appendWidgetBubble('user', escapeWidgetHtml(message), time, true);

    // Save to shared history
    sharedHistory.push({ message, type: 'user', timestamp: new Date().toISOString() });
    saveSharedHistoryWidget();

    input.value = '';
    input.focus();
    showWidgetTyping(true);
    await streamWidgetMessage(message);
}

async function streamWidgetMessage(message) {
    const msgId = 'wmsg_' + Date.now();
    appendWidgetStreamBubble(msgId);
    scrollWidgetToBottom();

    const contentEl = document.getElementById(msgId);
    let fullResponse = '';

    try {
        const encodedMessage = encodeURIComponent(message);
        const convParam = widgetConversationId ? `&conversationId=${encodeURIComponent(widgetConversationId)}` : '';
        const accessToken = typeof getAccessToken === 'function' ? getAccessToken() : localStorage.getItem('accessToken');
        const tokenParam = accessToken ? `&token=${encodeURIComponent(accessToken)}` : '';
        const eventSource = new EventSource(`/api/ai/chat/stream?message=${encodedMessage}${convParam}${tokenParam}`);

        eventSource.onmessage = function (event) {
            const chunk = event.data;
            if (chunk === '[DONE]') return;
            fullResponse += chunk;
            if (contentEl) contentEl.innerHTML = '<div class="message-content">' + formatWidgetMessage(fullResponse) + '</div>';
            scrollWidgetToBottom();
        };

        eventSource.addEventListener('done', function () {
            eventSource.close();
            showWidgetTyping(false);

            // Save to shared history
            sharedHistory.push({ message: fullResponse, type: 'ai', timestamp: new Date().toISOString() });
            saveSharedHistoryWidget();

            const timeEl = contentEl?.parentElement?.querySelector('.chatbot-msg-time');
            if (timeEl) timeEl.textContent = getCurrentWidgetTime();

            if (!widgetOpen) { widgetUnread++; updateWidgetBadge(); }
        });

        eventSource.onerror = function () {
            eventSource.close();
            showWidgetTyping(false);
            if (!fullResponse) blockingWidgetMessage(message, msgId);
        };
    } catch (error) {
        console.error('Widget streaming error:', error);
        showWidgetTyping(false);
        await blockingWidgetMessage(message, msgId);
    }
}

async function blockingWidgetMessage(message, msgId) {
    try {
        const convParam = widgetConversationId ? `?conversationId=${encodeURIComponent(widgetConversationId)}` : '';
        const response = await fetch(`/api/ai/chat${convParam}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(message)
        });
        if (!response.ok) throw new Error('Network error');
        const data = await response.json();
        const text = data.response || data;
        const html = formatWidgetMessage(text);
        const contentEl = document.getElementById(msgId);
        if (contentEl) contentEl.innerHTML = '<div class="message-content">' + html + '</div>';

        sharedHistory.push({ message: text, type: 'ai', timestamp: new Date().toISOString() });
        saveSharedHistoryWidget();
    } catch (error) {
        console.error('Widget blocking error:', error);
        const contentEl = document.getElementById(msgId);
        if (contentEl) contentEl.innerHTML = '<div class="message-content">Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại. 😔</div>';
    } finally {
        showWidgetTyping(false);
    }
}

// ============= DOM HELPERS =============
function appendWidgetBubble(type, html, time, animate) {
    const container = document.getElementById('widgetMessages');
    if (!container) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `chatbot-msg ${type}`;
    if (animate) msgDiv.style.animation = 'chatbot-msg-fadein 0.3s ease';
    const avatarIcon = type === 'ai' ? 'bi-robot' : 'bi-person-fill';

    if (type === 'ai') {
        msgDiv.innerHTML = `
            <div class="chatbot-msg-avatar"><i class="bi ${avatarIcon}"></i></div>
            <div>
                <div class="chatbot-msg-bubble"><div class="message-content">${html}</div></div>
                <div class="chatbot-msg-time">${time}</div>
            </div>`;
    } else {
        msgDiv.innerHTML = `
            <div>
                <div class="chatbot-msg-bubble">${html}</div>
                <div class="chatbot-msg-time">${time}</div>
            </div>
            <div class="chatbot-msg-avatar"><i class="bi ${avatarIcon}"></i></div>`;
    }
    container.appendChild(msgDiv);
    scrollWidgetToBottom();
}

function appendWidgetStreamBubble(msgId) {
    const container = document.getElementById('widgetMessages');
    if (!container) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = 'chatbot-msg ai';
    msgDiv.innerHTML = `
        <div class="chatbot-msg-avatar"><i class="bi bi-robot"></i></div>
        <div>
            <div class="chatbot-msg-bubble" id="${msgId}"><span class="widget-streaming-cursor">â–</span></div>
            <div class="chatbot-msg-time">${getCurrentWidgetTime()}</div>
        </div>`;
    container.appendChild(msgDiv);
}

function showWidgetTyping(show) { const el = document.getElementById('widgetTyping'); if (el) el.style.display = show ? 'flex' : 'none'; }
function scrollWidgetToBottom() { const c = document.getElementById('widgetMessages'); if (c) requestAnimationFrame(() => { c.scrollTop = c.scrollHeight; }); }
function updateWidgetBadge() { const b = document.getElementById('chatbotBadge'); if (!b) return; if (widgetUnread > 0) { b.textContent = widgetUnread > 9 ? '9+' : widgetUnread; b.style.display = 'flex'; } else { b.style.display = 'none'; } }
function getCurrentWidgetTime() { const n = new Date(); return n.getHours().toString().padStart(2, '0') + ':' + n.getMinutes().toString().padStart(2, '0'); }
function escapeWidgetHtml(text) { const d = document.createElement('div'); d.textContent = text; return d.innerHTML; }

function clearWidgetChat() {
    if (!confirm('Xóa toàn bộ lịch sử chat?')) return;
    const container = document.getElementById('widgetMessages');
    if (container) container.innerHTML = '';
    sharedHistory = [];
    sessionStorage.removeItem(SHARED_HISTORY_KEY);

    if (widgetConversationId) fetch(`/api/ai/conversation/${widgetConversationId}`, { method: 'DELETE' }).catch(() => {});
    widgetConversationId = 'conv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    sessionStorage.setItem('ai_conversation_id', widgetConversationId);
    showWidgetWelcome();
}

// ============= FORMAT MESSAGE =============
function formatWidgetMessage(text) {
    if (typeof text !== 'string') text = String(text);
    text = fixStuckVietnameseWidget(text);
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
        } catch (e) { console.warn('Widget marked error:', e); }
    }
    // fallback
    let f = escapeWidgetHtml(text);
    f = f.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>');
    f = f.replace(/^[•\-*]\s+(.+)$/gm, '<li>$1</li>');
    f = f.replace(/(\d{1,3}(?:\.\d{3})*(?:,\d+)?)\s*(?:đ|₫|VND|vnđ)/gi, '<span class="price-highlight">$1₫</span>');
    f = f.replace(/\n/g, '<br>');
    return f;
}

// ============= VOICE =============
function initWidgetVoice() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        widgetVoiceRecognition = new SR();
        widgetVoiceRecognition.lang = 'vi-VN';
        widgetVoiceRecognition.continuous = false;
        widgetVoiceRecognition.interimResults = false;
        widgetVoiceRecognition.onresult = function (e) { const input = document.getElementById('widgetInput'); if (input) input.value = e.results[0][0].transcript; stopWidgetVoice(); };
        widgetVoiceRecognition.onerror = function () { stopWidgetVoice(); };
        widgetVoiceRecognition.onend = function () { stopWidgetVoice(); };
    } else { const btn = document.getElementById('widgetVoiceBtn'); if (btn) btn.style.display = 'none'; }
}
function toggleWidgetVoice() { if (!widgetVoiceRecognition) return; widgetIsListening ? stopWidgetVoice() : startWidgetVoice(); }
function startWidgetVoice() { if (!widgetVoiceRecognition) return; widgetIsListening = true; const b = document.getElementById('widgetVoiceBtn'); if (b) b.classList.add('active'); widgetVoiceRecognition.start(); }
function stopWidgetVoice() { widgetIsListening = false; const b = document.getElementById('widgetVoiceBtn'); if (b) b.classList.remove('active'); if (widgetVoiceRecognition) widgetVoiceRecognition.stop(); }

// ============= FIX STUCK VIETNAMESE =============
function fixStuckVietnameseWidget(text) {
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
        result += _breakSegW(text.substring(lastIdx, m.index), sb1, sb2, sb3a, sb3b, vnDiac);
        result += m[0];
        lastIdx = protectedRe.lastIndex;
    }
    result += _breakSegW(text.substring(lastIdx), sb1, sb2, sb3a, sb3b, vnDiac);
    return result.replace(/ {2,}/g, ' ');
}
function _breakSegW(text, sb1, sb2, sb3a, sb3b, vnDiac) {
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
