// Enhanced AI Chatbot JavaScript with Shop Integration
// Version 3.0 - Fashion Shop Specific Features

const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const typingIndicator = document.getElementById('typingIndicator');
const voiceBtn = document.getElementById('voiceBtn');

// ============= CONFIGURATION =============
const CONFIG = {
    apiEndpoint: '/api/ai/chat',
    chatHistoryKey: 'ai_chat_history',
    darkModeKey: 'darkMode',
    maxHistoryItems: 50,
    typingDelay: 100,
    toastDuration: 3000
};

// ============= STATE MANAGEMENT =============
let chatHistory = [];
let recognition = null;
let isListening = false;
let currentCart = [];
let userPreferences = {
    size: null,
    style: [],
    priceRange: { min: 0, max: 0 }
};

// ============= INITIALIZATION =============
document.addEventListener('DOMContentLoaded', function() {
    initializeChatbot();
});

function initializeChatbot() {
    loadChatHistory();
    loadUserPreferences();
    initVoiceRecognition();
    initProductIntegration();
    messageInput.focus();

    // Load dark mode preference
    if (localStorage.getItem(CONFIG.darkModeKey) === 'true') {
        document.body.classList.add('dark-mode');
        updateDarkModeIcon();
    }
}

// ============= PRODUCT INTEGRATION =============
function initProductIntegration() {
    // Check if user is on a product page
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('productId');

    if (productId) {
        loadProductContext(productId);
    }

    // Listen for cart updates
    window.addEventListener('cartUpdated', handleCartUpdate);
}

function loadProductContext(productId) {
    // Load product details to provide context-aware chat
    fetch(`/api/products/${productId}`)
        .then(response => response.json())
        .then(product => {
            sessionStorage.setItem('currentProduct', JSON.stringify(product));
            addQuickProductActions(product);
        })
        .catch(error => console.error('Error loading product context:', error));
}

function addQuickProductActions(product) {
    const quickActions = document.querySelector('.quick-actions');
    if (!quickActions) return;

    // Add product-specific quick actions
    const productActions = `
        <button class="quick-btn product-specific" onclick="askAboutProduct('size')">
            <i class="fas fa-ruler"></i> Tư vấn size
        </button>
        <button class="quick-btn product-specific" onclick="askAboutProduct('material')">
            <i class="fas fa-tag"></i> Chất liệu
        </button>
        <button class="quick-btn product-specific" onclick="askAboutProduct('style')">
            <i class="fas fa-palette"></i> Cách phối đồ
        </button>
        <button class="quick-btn product-specific" onclick="askAboutProduct('similar')">
            <i class="fas fa-search"></i> Tìm tương tự
        </button>
    `;

    quickActions.innerHTML = productActions + quickActions.innerHTML;
}

function askAboutProduct(type) {
    const product = JSON.parse(sessionStorage.getItem('currentProduct') || '{}');

    const questions = {
        size: `Tư vấn size cho sản phẩm ${product.name}`,
        material: `Cho tôi biết về chất liệu của ${product.name}`,
        style: `Gợi ý cách phối đồ với ${product.name}`,
        similar: `Tìm sản phẩm tương tự ${product.name}`
    };

    sendQuickMessage(questions[type] || `Hỏi về ${product.name}`);
}

// ============= ENHANCED MESSAGING =============
async function sendMessage() {
    const message = messageInput.value.trim();

    if (!message) {
        messageInput.focus();
        return;
    }

    // Add user message with typing effect
    addMessageWithTyping(message, 'user');

    // Save to history
    chatHistory.push({
        message,
        type: 'user',
        timestamp: new Date().toISOString()
    });
    saveChatHistory();

    // Clear input
    messageInput.value = '';
    messageInput.focus();

    // Show typing indicator
    typingIndicator.classList.add('active');

    try {
        // Detect intent and choose appropriate endpoint
        const endpoint = detectIntentEndpoint(message);

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Process response based on type
        processAIResponse(data);

    } catch (error) {
        console.error('Error:', error);
        handleChatError(error);
    } finally {
        typingIndicator.classList.remove('active');
    }
}

function detectIntentEndpoint(message) {
    const lowerMessage = message.toLowerCase();

    // Product search intents
    if (containsAny(lowerMessage, 'tìm', 'tim', 'có', 'co', 'bán', 'ban')) {
        return '/api/ai/chat/product';
    }

    // Brand specific
    if (containsAny(lowerMessage, 'nike', 'adidas', 'gucci', 'zara', 'h&m')) {
        return '/api/ai/chat/product';
    }

    // Category specific
    if (containsAny(lowerMessage, 'áo', 'quần', 'váy', 'giày', 'túi')) {
        return '/api/ai/chat/product';
    }

    // Default chat endpoint
    return CONFIG.apiEndpoint;
}

function processAIResponse(data) {
    const response = data.response || data;

    // Check if response contains product data
    if (data.products && data.products.length > 0) {
        addMessageWithProducts(response, data.products);
    } else {
        addMessageWithTyping(response, 'ai');
    }

    // Save to history
    chatHistory.push({
        message: response,
        type: 'ai',
        timestamp: new Date().toISOString(),
        products: data.products || []
    });
    saveChatHistory();
}

function addMessageWithTyping(text, type) {
    if (type === 'user') {
        addMessage(text, type);
        return;
    }

    // AI message with typing effect
    const messageDiv = createMessageElement(text, type);
    chatMessages.appendChild(messageDiv);

    const contentElement = messageDiv.querySelector('.message-content');
    const originalHTML = contentElement.innerHTML;
    contentElement.innerHTML = '';

    let index = 0;
    const typingInterval = setInterval(() => {
        if (index < text.length) {
            contentElement.innerHTML = formatMessage(text.substring(0, index + 1));
            index++;
            scrollToBottom();
        } else {
            clearInterval(typingInterval);
            contentElement.innerHTML = originalHTML;
            addMessageActions(messageDiv);
        }
    }, CONFIG.typingDelay);
}

function addMessageWithProducts(text, products) {
    // Add AI message
    addMessage(text, 'ai');

    // Add product cards
    const productCardsHTML = createProductCards(products);
    const productsDiv = document.createElement('div');
    productsDiv.className = 'message ai products-message';
    productsDiv.innerHTML = `
        <div class="message-icon">
            <i class="fas fa-shopping-bag"></i>
        </div>
        <div style="width: 100%;">
            <div class="products-grid">
                ${productCardsHTML}
            </div>
        </div>
    `;

    chatMessages.appendChild(productsDiv);
    scrollToBottom();
}

function createProductCards(products) {
    return products.slice(0, 6).map(product => `
        <div class="product-card-chat" data-product-id="${product.id}">
            <div class="product-image-wrapper">
                <img src="${product.imageUrl || '/static/image_product/default.jpg'}" 
                     alt="${product.name}"
                     onerror="this.src='/static/image_product/default.jpg'">
                ${product.discount ? `<div class="discount-badge">-${product.discount}%</div>` : ''}
            </div>
            <div class="product-info">
                <h6 class="product-name">${product.name}</h6>
                <p class="product-brand">${product.brand || 'Fashion Shop'}</p>
                <div class="product-price">
                    ${product.originalPrice && product.discount ? 
                        `<span class="old-price">${formatPrice(product.originalPrice)}</span>` : ''}
                    <span class="current-price">${formatPrice(product.price)}</span>
                </div>
                ${product.availableSizes ? 
                    `<div class="available-sizes">
                        <small>Size: ${product.availableSizes.join(', ')}</small>
                    </div>` : ''}
                <div class="product-actions">
                    <button class="btn-view" onclick="viewProduct('${product.slug || product.id}')">
                        <i class="fas fa-eye"></i> Xem
                    </button>
                    <button class="btn-add-cart" onclick="quickAddToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Thêm
                    </button>
                    <button class="btn-ask-ai" onclick="askAboutSpecificProduct(${product.id})">
                        <i class="fas fa-question-circle"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ============= PRODUCT ACTIONS =============
function viewProduct(productIdOrSlug) {
    // If it looks like a slug (contains letters/hyphens), navigate directly
    if (typeof productIdOrSlug === 'string' && /[a-zA-Z\-]/.test(productIdOrSlug)) {
        window.location.href = `/products/${productIdOrSlug}`;
    } else {
        // Numeric ID â€” fetch product to get slug first
        fetch(`/api/products/${productIdOrSlug}`)
            .then(response => response.json())
            .then(product => {
                if (product.slug) {
                    window.location.href = `/products/${product.slug}`;
                } else {
                    window.location.href = `/products/${productIdOrSlug}`;
                }
            })
            .catch(() => {
                window.location.href = `/products/${productIdOrSlug}`;
            });
    }
}

async function quickAddToCart(productId) {
    try {
        const response = await fetch('/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productId: productId,
                quantity: 1
            })
        });

        if (response.ok) {
            showToast('Đã thêm vào giỏ hàng! 🛒', 'success');
            updateCartBadge();

            // AI suggest related actions
            setTimeout(() => {
                addMessage('Tuyệt vời! Bạn muốn tôi gợi ý thêm sản phẩm phối cùng không? 😊', 'ai');
            }, 1000);
        } else {
            throw new Error('Failed to add to cart');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        showToast('Không thể thêm vào giỏ hàng. Vui lòng thử lại!', 'error');
    }
}

function askAboutSpecificProduct(productId) {
    fetch(`/api/products/${productId}`)
        .then(response => response.json())
        .then(product => {
            const message = `Cho tôi biết thêm về ${product.name}`;
            messageInput.value = message;
            sessionStorage.setItem('currentProduct', JSON.stringify(product));
            sendMessage();
        })
        .catch(error => {
            console.error('Error loading product:', error);
            showToast('Không thể tải thông tin sản phẩm', 'error');
        });
}

function updateCartBadge() {
    // Update cart badge in navbar
    fetch('/api/cart/count')
        .then(response => response.json())
        .then(data => {
            const badge = document.querySelector('.cart-badge');
            if (badge) {
                badge.textContent = data.count;
                badge.style.animation = 'bounce 0.5s';
            }
        })
        .catch(error => console.error('Error updating cart badge:', error));
}

// ============= SMART FEATURES =============
function analyzeUserMessage(message) {
    const lowerMessage = message.toLowerCase();

    // Extract preferences
    const sizePattern = /size\s*([smlx]+|[0-9]+)/i;
    const sizeMatch = message.match(sizePattern);
    if (sizeMatch) {
        userPreferences.size = sizeMatch[1].toUpperCase();
        saveUserPreferences();
    }

    // Extract price range
    const pricePattern = /(\d+)\s*(đến|den|-)\s*(\d+)/i;
    const priceMatch = message.match(pricePattern);
    if (priceMatch) {
        userPreferences.priceRange = {
            min: parseInt(priceMatch[1]) * 1000,
            max: parseInt(priceMatch[3]) * 1000
        };
        saveUserPreferences();
    }

    // Extract style preferences
    const styles = ['công sở', 'thể thao', 'dạo phố', 'dự tiệc', 'casual', 'formal'];
    styles.forEach(style => {
        if (lowerMessage.includes(style) && !userPreferences.style.includes(style)) {
            userPreferences.style.push(style);
            saveUserPreferences();
        }
    });
}

function saveUserPreferences() {
    localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
}

function loadUserPreferences() {
    const saved = localStorage.getItem('userPreferences');
    if (saved) {
        userPreferences = JSON.parse(saved);
    }
}

// ============= VOICE INPUT (Enhanced) =============
function initVoiceRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.lang = 'vi-VN';
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onresult = function(event) {
            const transcript = event.results[event.results.length - 1][0].transcript;
            messageInput.value = transcript;

            if (event.results[event.results.length - 1].isFinal) {
                stopVoiceInput();
                // Auto-send if message ends with question mark
                if (transcript.trim().endsWith('?')) {
                    setTimeout(() => sendMessage(), 500);
                }
            }
        };

        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            stopVoiceInput();
            showToast('Lỗi nhận diện giọng nói', 'error');
        };

        recognition.onend = function() {
            stopVoiceInput();
        };
    } else if (voiceBtn) {
        voiceBtn.style.display = 'none';
    }
}

function toggleVoiceInput() {
    if (!recognition) {
        showToast('Trình duyệt không hỗ trợ nhận diện giọng nói', 'warning');
        return;
    }

    if (isListening) {
        stopVoiceInput();
    } else {
        startVoiceInput();
    }
}

function startVoiceInput() {
    if (!recognition) return;

    isListening = true;
    voiceBtn.classList.add('active');
    messageInput.placeholder = 'Đang lắng nghe...';
    recognition.start();
    showToast('🎤 Hãy nói...', 'info');
}

function stopVoiceInput() {
    if (!recognition) return;

    isListening = false;
    voiceBtn.classList.remove('active');
    messageInput.placeholder = 'Nhập câu hỏi của bạn...';
    if (recognition) {
        recognition.stop();
    }
}

// ============= CHAT HISTORY =============
function loadChatHistory() {
    try {
        const saved = localStorage.getItem(CONFIG.chatHistoryKey);
        if (saved) {
            chatHistory = JSON.parse(saved);
        }
    } catch (error) {
        console.error('Error loading chat history:', error);
    }
}

function saveChatHistory() {
    try {
        if (chatHistory.length > CONFIG.maxHistoryItems) {
            chatHistory = chatHistory.slice(-CONFIG.maxHistoryItems);
        }
        localStorage.setItem(CONFIG.chatHistoryKey, JSON.stringify(chatHistory));
    } catch (error) {
        console.error('Error saving chat history:', error);
    }
}

function clearChat() {
    if (confirm('Bạn có chắc muốn xóa toàn bộ lịch sử chat?')) {
        chatMessages.innerHTML = '';
        chatHistory = [];
        localStorage.removeItem(CONFIG.chatHistoryKey);
        addWelcomeMessage();
        showToast('Đã xóa lịch sử chat', 'success');
    }
}

function addWelcomeMessage() {
    const welcomeHTML = `
        <div class="message ai">
            <div class="message-icon">
                <i class="fas fa-robot"></i>
            </div>
            <div>
                <div class="message-content">
                    <strong>Xin chào! 👋</strong><br><br>
                    Tôi là <strong>Trợ lý AI thời trang</strong> của cửa hàng. Tôi có thể giúp bạn:<br><br>
                    <div style="display: grid; gap: 8px;">
                        <div>✨ <strong>Tìm kiếm sản phẩm</strong> phù hợp với phong cách của bạn</div>
                        <div>💰 <strong>Tư vấn về giá cả</strong> và chất lượng</div>
                        <div>👔 <strong>Gợi ý cách phối đồ</strong> cho nhiều dịp khác nhau</div>
                        <div>📏 <strong>Hướng dẫn chọn size</strong> chính xác</div>
                        <div>🎁 <strong>Thông tin khuyến mãi</strong> mới nhất</div>
                        <div>🛒 <strong>Thêm sản phẩm vào giỏ</strong> ngay từ chat</div>
                    </div>
                    <br>
                    <em>Hãy hỏi tôi bất cứ điều gì bạn cần! 😊</em>
                </div>
                <div class="message-time">Vừa xong</div>
            </div>
        </div>
    `;
    chatMessages.innerHTML = welcomeHTML;
}

// ============= MESSAGE FORMATTING =============
function createMessageElement(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;

    const time = getCurrentTime();
    const messageId = 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    if (type === 'ai') {
        messageDiv.innerHTML = `
            <div class="message-icon">
                <i class="fas fa-robot"></i>
            </div>
            <div>
                <div class="message-content" id="${messageId}">
                    ${formatMessage(text)}
                </div>
                <div class="message-time">${time}</div>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div>
                <div class="message-content" id="${messageId}">
                    ${escapeHtml(text)}
                </div>
                <div class="message-time">${time}</div>
            </div>
            <div class="message-icon">
                <i class="fas fa-user"></i>
            </div>
        `;
    }

    return messageDiv;
}

function addMessage(text, type) {
    const messageDiv = createMessageElement(text, type);
    chatMessages.appendChild(messageDiv);

    if (type === 'ai') {
        addMessageActions(messageDiv);
    }

    scrollToBottom();

    // Analyze user message for preferences
    if (type === 'user') {
        analyzeUserMessage(text);
    }
}

function addMessageActions(messageDiv) {
    const contentDiv = messageDiv.querySelector('div:last-child') || messageDiv.querySelector('div');
    const messageId = messageDiv.querySelector('.message-content').id;

    const actionsHTML = `
        <div class="message-actions">
            <button class="action-btn" onclick="copyMessage('${messageId}')" title="Sao chép">
                <i class="fas fa-copy"></i> Sao chép
            </button>
            <button class="action-btn" onclick="speakMessage('${messageId}')" title="Đọc to">
                <i class="fas fa-volume-up"></i> Đọc
            </button>
        </div>
    `;

    const timeDiv = contentDiv.querySelector('.message-time');
    if (timeDiv) {
        timeDiv.insertAdjacentHTML('beforebegin', actionsHTML);
    }
}

function formatMessage(text) {
    if (typeof text !== 'string') {
        text = String(text);
    }

    // Fix Vietnamese stuck words (e.g., "ÃothunpoloJacquard")
    text = fixStuckVietnameseEnhanced(text);

    // Extract markdown links BEFORE escaping HTML, replace with placeholders
    const linkPlaceholders = [];
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function(match, linkText, url) {
        const index = linkPlaceholders.length;
        // Internal links (start with /) stay in same tab
        if (url.startsWith('/')) {
            linkPlaceholders.push(`<a href="${url}" class="chat-link chat-link-internal">${linkText}</a>`);
        } else {
            linkPlaceholders.push(`<a href="${url}" target="_blank" rel="noopener noreferrer" class="chat-link">${linkText}</a>`);
        }
        return `__LINK_PLACEHOLDER_${index}__`;
    });

    let formatted = escapeHtml(text);

    // Format line breaks
    formatted = formatted.replace(/\n/g, '<br>');

    // Format bold **text**
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Format italic *text*
    formatted = formatted.replace(/\*([^*]+?)\*/g, '<em>$1</em>');

    // Format code `code`
    formatted = formatted.replace(/`(.+?)`/g, '<code style="background: #f4f4f4; padding: 2px 6px; border-radius: 3px; font-family: monospace;">$1</code>');

    // Highlight prices
    formatted = formatted.replace(/(\d{1,3}(?:\.\d{3})*)\s*(?:đ|VND|vnđ)/gi,
        '<strong style="color: #764ba2; font-size: 1.1em;">$1đ</strong>');

    // Format bullet points
    formatted = formatted.replace(/^[•\-]\s+(.+)$/gm, '<div style="margin-left: 15px;">• $1</div>');

    // Format HTTP/HTTPS links (only those not already in placeholders)
    formatted = formatted.replace(/(https?:\/\/[^\s<]+)/g,
        '<a href="$1" target="_blank" style="color: #667eea; text-decoration: underline;">$1</a>');

    // Format tables (simple markdown tables)
    formatted = formatTables(formatted);

    // Restore markdown link placeholders
    linkPlaceholders.forEach(function(linkHtml, index) {
        formatted = formatted.replace(`__LINK_PLACEHOLDER_${index}__`, linkHtml);
    });

    return formatted;
}

function formatTables(text) {
    // Simple table formatting (markdown-style)
    const lines = text.split('<br>');
    let inTable = false;
    let result = [];

    for (let line of lines) {
        if (line.includes('|')) {
            if (!inTable) {
                result.push('<table class="ai-table">');
                inTable = true;
            }

            const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
            const row = cells.map(cell => {
                // Check if this is a header row (contains ---)
                if (cell.includes('---')) return '';
                return `<td>${cell}</td>`;
            }).join('');

            if (row) {
                result.push(`<tr>${row}</tr>`);
            }
        } else {
            if (inTable) {
                result.push('</table>');
                inTable = false;
            }
            result.push(line);
        }
    }

    if (inTable) {
        result.push('</table>');
    }

    return result.join('<br>');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============= UTILITY FUNCTIONS =============
function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

function scrollToBottom() {
    chatMessages.scrollTo({
        top: chatMessages.scrollHeight,
        behavior: 'smooth'
    });
}

function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function sendQuickMessage(message) {
    messageInput.value = message;
    sendMessage();
}

function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

function containsAny(text, ...keywords) {
    return keywords.some(keyword => text.includes(keyword));
}

// ============= MESSAGE ACTIONS =============
function copyMessage(messageId) {
    const messageElement = document.getElementById(messageId);
    if (!messageElement) return;

    const text = messageElement.innerText || messageElement.textContent;

    navigator.clipboard.writeText(text).then(() => {
        showToast('✅ Đã sao chép tin nhắn', 'success');
    }).catch(err => {
        console.error('Failed to copy:', err);
        showToast('❌ Không thể sao chép', 'error');
    });
}

function speakMessage(messageId) {
    const messageElement = document.getElementById(messageId);
    if (!messageElement) return;

    const text = messageElement.innerText || messageElement.textContent;

    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'vi-VN';
        utterance.rate = 0.9;
        utterance.pitch = 1.0;

        window.speechSynthesis.speak(utterance);
        showToast('🔊 Đang đọc tin nhắn...', 'info');
    } else {
        showToast('⚠️ Trình duyệt không hỗ trợ đọc văn bản', 'warning');
    }
}

// ============= ERROR HANDLING =============
function handleChatError(error) {
    const errorMessages = {
        'NetworkError': 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối!',
        'TimeoutError': 'Yêu cầu quá lâu. Vui lòng thử lại!',
        'default': 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau. 😔'
    };

    const errorMsg = errorMessages[error.name] || errorMessages.default;
    addMessage(errorMsg, 'ai');
    showToast('❌ Lỗi kết nối đến AI', 'error');
}

function handleCartUpdate(event) {
    const { action, product } = event.detail;

    if (action === 'added') {
        setTimeout(() => {
            addMessage(`Tôi thấy bạn vừa thêm "${product.name}" vào giỏ hàng. Bạn muốn tôi gợi ý thêm sản phẩm phối cùng không? 😊`, 'ai');
        }, 2000);
    }
}

// ============= TOAST NOTIFICATIONS =============
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `custom-toast toast-${type}`;

    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };

    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#667eea'
    };

    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas ${icons[type]}" style="color: ${colors[type]}; font-size: 20px;"></i>
            <span style="color: #333; font-weight: 500;">${message}</span>
        </div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, CONFIG.toastDuration);
}

// ============= DARK MODE =============
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');

    updateDarkModeIcon();
    localStorage.setItem(CONFIG.darkModeKey, isDark);
    showToast(isDark ? '🌙 Đã bật chế độ tối' : '☀️ Đã tắt chế độ tối', 'info');
}

function updateDarkModeIcon() {
    const icon = document.querySelector('.btn-icon i.fa-moon, .btn-icon i.fa-sun');
    if (icon) {
        const isDark = document.body.classList.contains('dark-mode');
        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// ============= EVENT LISTENERS =============
// Focus input when clicking in chat area
chatMessages.addEventListener('click', (e) => {
    if (!e.target.closest('.product-card-chat, .message-actions, a, button')) {
        messageInput.focus();
    }
});

// Handle cart updates from other parts of the app
window.addEventListener('storage', (e) => {
    if (e.key === 'cart') {
        updateCartBadge();
    }
});

// Initialize welcome message on first load
if (chatMessages.children.length === 0) {
    addWelcomeMessage();
}

/**
 * Fix Vietnamese text with stuck-together words.
 */
function fixStuckVietnameseEnhanced(text) {
    if (!text || typeof text !== 'string') return text;
    const vnLower = 'a-zàáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ';
    const vnUpper = 'A-ZÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÈÉẺẼẸÊẾỀỂỄỆÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴĐ';
    text = text.replace(new RegExp(`([${vnLower}])([${vnUpper}])`, 'g'), '$1 $2');
    const vowels = 'aàáảãạăắằẳẵặâấầẩẫậeèéẻẽẹêếềểễệiìíỉĩịoòóỏõọôốồổỗộơớờởỡợuùúủũụưứừửữựyỳýỷỹỵ';
    const vnV = `[${vowels}${vowels.toUpperCase()}]`;
    const ic = '(?:ngh|ng|nh|gh|gi|ch|kh|ph|th|tr|qu|b|c|d|đ|g|h|k|l|m|n|p|r|s|t|v|x)';
    const fc = '(?:ch|ng|nh|[nmctpk])';
    const diacV = '[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÈÉẺẼẸÊẾỀỂỄỆÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴĐ]';
    const sb1 = new RegExp(`(${vnV}+${fc})(${ic}${vnV})`, 'gi');
    const sb2 = new RegExp(`(${vnV}{2,})(${ic}${vnV})`, 'gi');
    const sb3a = new RegExp(`(${diacV})(${ic}${vnV})`, 'gi');
    const sb3b = new RegExp(`(${vnV})(${ic}${diacV})`, 'gi');
    const vnDiac = /[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÈÉẺẼẸÊẾỀỂỄỆÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴĐ]/;
    const protectedRe = /https?:\/\/\S+|\[[^\]]*\]\([^)]*\)|\([^)]*\)|[a-zA-Z0-9]+-[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)+|\/[a-zA-Z0-9\/_.%-]+|`[^`]+`|<[^>]+>|\*\*[^*]+\*\*|\d[\d.,]+\s*(?:VND|₫|đ)/g;
    let result = '', lastIdx = 0, m;
    while ((m = protectedRe.exec(text)) !== null) {
        result += _syllBreakE(text.substring(lastIdx, m.index), sb1, sb2, sb3a, sb3b, vnDiac);
        result += m[0];
        lastIdx = protectedRe.lastIndex;
    }
    result += _syllBreakE(text.substring(lastIdx), sb1, sb2, sb3a, sb3b, vnDiac);
    return result.replace(/ {2,}/g, ' ');
}
function _syllBreakE(text, sb1, sb2, sb3a, sb3b, vnDiac) {
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
