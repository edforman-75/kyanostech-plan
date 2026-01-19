// KyanosTech Intelligent Chatbot System v2.5.0
// Fixed: Scrolling and continuous conversation

(function() {
    'use strict';
    
    const CHATBOT_VERSION = '2.5.0';
    const CONFIG = {
        aiProvider: 'openai',
        apiEndpoint: '/.netlify/functions/chat-ai',
        maxTokens: 800,
        temperature: 0.7,
        model: 'gpt-4-turbo-preview',
        
        defaultWidth: 420,
        defaultHeight: 600,
        minWidth: 380,
        minHeight: 450,
        maxWidth: 900,
        maxHeight: 1000,
        
        maxHistoryLength: 10,
        contextWindow: 5
    };

    class ConversationManager {
        constructor() {
            this.storageKey = 'kyanos_conversation_data';
            this.loadFromStorage();
            
            if (!this.sessionId) {
                this.sessionId = this.generateSessionId();
                this.conversationHistory = [];
                this.saveToStorage();
            }
        }

        generateSessionId() {
            return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }

        loadFromStorage() {
            try {
                const stored = localStorage.getItem(this.storageKey);
                if (stored) {
                    const data = JSON.parse(stored);
                    this.sessionId = data.sessionId;
                    this.conversationHistory = data.conversationHistory || [];
                }
            } catch (e) {
                console.warn('Could not load conversation history:', e);
            }
        }

        saveToStorage() {
            try {
                localStorage.setItem(this.storageKey, JSON.stringify({
                    sessionId: this.sessionId,
                    conversationHistory: this.conversationHistory
                }));
            } catch (e) {
                console.warn('Could not save conversation history:', e);
            }
        }

        addMessage(role, content) {
            this.conversationHistory.push({ role, content, timestamp: Date.now() });
            
            if (this.conversationHistory.length > CONFIG.maxHistoryLength) {
                this.conversationHistory = this.conversationHistory.slice(-CONFIG.maxHistoryLength);
            }
            
            this.saveToStorage();
        }

        getRecentContext() {
            return this.conversationHistory.slice(-CONFIG.contextWindow);
        }

        clearHistory() {
            this.conversationHistory = [];
            this.saveToStorage();
        }
    }

    const conversationManager = new ConversationManager();
    let chatState = {
        isDragging: false,
        isResizing: false,
        isMinimized: false,
        resizeDirection: null,
        dragStartX: 0,
        dragStartY: 0,
        dragStartLeft: 0,
        dragStartTop: 0,
        resizeStartX: 0,
        resizeStartY: 0,
        resizeStartWidth: 0,
        resizeStartHeight: 0,
        resizeStartLeft: 0,
        resizeStartTop: 0
    };

    function createChatbotUI() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes blink {
                0%, 60%, 100% { opacity: 0.3; }
                30% { opacity: 1; }
            }
            
            #chat-send-btn:hover:not(:disabled) {
                opacity: 0.9;
            }
            
            #chat-send-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            
            #chat-messages {
                overflow-y: auto !important;
                overflow-x: hidden;
            }
            
            #chat-messages::-webkit-scrollbar {
                width: 8px;
            }
            
            #chat-messages::-webkit-scrollbar-track {
                background: #f1f1f1;
            }
            
            #chat-messages::-webkit-scrollbar-thumb {
                background: #888;
                border-radius: 4px;
            }
            
            #chat-messages::-webkit-scrollbar-thumb:hover {
                background: #555;
            }
            
            .resize-handle {
                position: absolute;
                z-index: 10;
                background: transparent;
            }
            
            .resize-handle:hover {
                background: rgba(102, 126, 234, 0.2) !important;
            }
            
            .resize-nw { top: 0; left: 0; width: 16px; height: 16px; cursor: nwse-resize; }
            .resize-ne { top: 0; right: 0; width: 16px; height: 16px; cursor: nesw-resize; }
            .resize-sw { bottom: 0; left: 0; width: 16px; height: 16px; cursor: nesw-resize; }
            .resize-se { bottom: 0; right: 0; width: 16px; height: 16px; cursor: nwse-resize; }
            .resize-n { top: 0; left: 16px; right: 16px; height: 8px; cursor: ns-resize; }
            .resize-s { bottom: 0; left: 16px; right: 16px; height: 8px; cursor: ns-resize; }
            .resize-e { right: 0; top: 16px; bottom: 16px; width: 8px; cursor: ew-resize; }
            .resize-w { left: 0; top: 16px; bottom: 16px; width: 8px; cursor: ew-resize; }
            
            .chat-minimized .resize-handle {
                display: none;
            }
            
            .chat-minimized #chat-body {
                display: none !important;
            }
            
            #chat-header-minimize {
                cursor: pointer;
                user-select: none;
            }
        `;
        document.head.appendChild(style);
        
        const chatbotHTML = `
            <div id="kyanos-chatbot-container" style="
                position: fixed;
                width: ${CONFIG.defaultWidth}px;
                height: ${CONFIG.defaultHeight}px;
                top: 80px;
                right: 40px;
                z-index: 9999;
            ">
                <div id="chat-window" style="
                    width: 100%;
                    height: 100%;
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 12px 48px rgba(0,0,0,0.25);
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                ">
                    <div class="resize-handle resize-nw" data-direction="nw"></div>
                    <div class="resize-handle resize-ne" data-direction="ne"></div>
                    <div class="resize-handle resize-sw" data-direction="sw"></div>
                    <div class="resize-handle resize-se" data-direction="se"></div>
                    <div class="resize-handle resize-n" data-direction="n"></div>
                    <div class="resize-handle resize-s" data-direction="s"></div>
                    <div class="resize-handle resize-e" data-direction="e"></div>
                    <div class="resize-handle resize-w" data-direction="w"></div>
                    
                    <div id="chat-header" style="
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 18px;
                        font-weight: 600;
                        font-size: 15px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        cursor: grab;
                        user-select: none;
                        flex-shrink: 0;
                    ">
                        <div id="chat-header-minimize" style="display: flex; align-items: center; gap: 10px; flex: 1;">
                            <span style="font-size: 20px;">🤖</span>
                            <span>Kyanos Plan AI Assistant</span>
                        </div>
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <button id="chat-clear-btn" style="
                                background: rgba(255,255,255,0.2);
                                border: none;
                                color: white;
                                padding: 6px 10px;
                                border-radius: 6px;
                                cursor: pointer;
                                font-size: 13px;
                                transition: background 0.2s;
                            " title="Clear conversation">🗑️</button>
                            <button id="chat-minimize-btn" style="
                                background: rgba(255,255,255,0.2);
                                border: none;
                                color: white;
                                padding: 6px 10px;
                                border-radius: 6px;
                                cursor: pointer;
                                font-size: 16px;
                                line-height: 1;
                                transition: background 0.2s;
                            " title="Minimize">−</button>
                        </div>
                    </div>
                    
                    <div id="chat-body" style="
                        display: flex;
                        flex-direction: column;
                        flex: 1;
                        min-height: 0;
                        overflow: hidden;
                    ">
                        <div id="chat-messages" style="
                            flex: 1;
                            overflow-y: auto;
                            overflow-x: hidden;
                            padding: 18px;
                            background: #f8f9fa;
                            display: flex;
                            flex-direction: column;
                            gap: 14px;
                        "></div>
                        
                        <div id="typing-indicator" style="
                            display: none;
                            padding: 10px 18px;
                            background: #f8f9fa;
                            flex-shrink: 0;
                        ">
                            <div style="
                                display: inline-block;
                                padding: 10px 14px;
                                background: white;
                                border-radius: 14px;
                                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                            ">
                                <span style="animation: blink 1.4s infinite; font-size: 16px;">●</span>
                                <span style="animation: blink 1.4s infinite 0.2s; font-size: 16px;">●</span>
                                <span style="animation: blink 1.4s infinite 0.4s; font-size: 16px;">●</span>
                            </div>
                        </div>
                        
                        <div style="
                            padding: 18px;
                            border-top: 1px solid #e0e0e0;
                            background: white;
                            flex-shrink: 0;
                        ">
                            <div style="display: flex; gap: 10px;">
                                <input 
                                    id="chat-input" 
                                    type="text" 
                                    placeholder="Ask about the business plan..."
                                    style="
                                        flex: 1;
                                        padding: 12px 14px;
                                        border: 2px solid #ddd;
                                        border-radius: 8px;
                                        font-size: 14px;
                                        outline: none;
                                        transition: border-color 0.2s;
                                    "
                                />
                                <button id="chat-send-btn" style="
                                    padding: 12px 24px;
                                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                    color: white;
                                    border: none;
                                    border-radius: 8px;
                                    cursor: pointer;
                                    font-weight: 600;
                                    font-size: 14px;
                                    transition: opacity 0.2s;
                                    white-space: nowrap;
                                ">Send</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    function setupDragging() {
        const container = document.getElementById('kyanos-chatbot-container');
        const header = document.getElementById('chat-header');

        header.addEventListener('mousedown', function(e) {
            if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                return;
            }
            
            chatState.isDragging = true;
            chatState.dragStartX = e.clientX;
            chatState.dragStartY = e.clientY;
            chatState.dragStartLeft = container.offsetLeft;
            chatState.dragStartTop = container.offsetTop;
            
            header.style.cursor = 'grabbing';
            e.preventDefault();
        });

        document.addEventListener('mousemove', function(e) {
            if (!chatState.isDragging) return;
            
            const deltaX = e.clientX - chatState.dragStartX;
            const deltaY = e.clientY - chatState.dragStartY;
            
            const newLeft = chatState.dragStartLeft + deltaX;
            const newTop = chatState.dragStartTop + deltaY;
            
            container.style.left = newLeft + 'px';
            container.style.top = newTop + 'px';
            container.style.bottom = 'auto';
            container.style.right = 'auto';
        });

        document.addEventListener('mouseup', function() {
            if (chatState.isDragging) {
                chatState.isDragging = false;
                header.style.cursor = 'grab';
            }
        });
    }

    function setupResizing() {
        const container = document.getElementById('kyanos-chatbot-container');
        const handles = document.querySelectorAll('.resize-handle');

        handles.forEach(handle => {
            handle.addEventListener('mousedown', function(e) {
                if (chatState.isMinimized) return;
                
                chatState.isResizing = true;
                chatState.resizeDirection = this.dataset.direction;
                chatState.resizeStartX = e.clientX;
                chatState.resizeStartY = e.clientY;
                chatState.resizeStartWidth = container.offsetWidth;
                chatState.resizeStartHeight = container.offsetHeight;
                chatState.resizeStartLeft = container.offsetLeft;
                chatState.resizeStartTop = container.offsetTop;
                
                e.preventDefault();
                e.stopPropagation();
            });
        });

        document.addEventListener('mousemove', function(e) {
            if (!chatState.isResizing) return;
            
            const deltaX = e.clientX - chatState.resizeStartX;
            const deltaY = e.clientY - chatState.resizeStartY;
            const direction = chatState.resizeDirection;
            
            let newWidth = chatState.resizeStartWidth;
            let newHeight = chatState.resizeStartHeight;
            let newLeft = chatState.resizeStartLeft;
            let newTop = chatState.resizeStartTop;
            
            if (direction.includes('e')) {
                newWidth = chatState.resizeStartWidth + deltaX;
            } else if (direction.includes('w')) {
                newWidth = chatState.resizeStartWidth - deltaX;
                newLeft = chatState.resizeStartLeft + deltaX;
            }
            
            if (direction.includes('s')) {
                newHeight = chatState.resizeStartHeight + deltaY;
            } else if (direction.includes('n')) {
                newHeight = chatState.resizeStartHeight - deltaY;
                newTop = chatState.resizeStartTop + deltaY;
            }
            
            if (newWidth >= CONFIG.minWidth && newWidth <= CONFIG.maxWidth) {
                container.style.width = newWidth + 'px';
                if (direction.includes('w')) {
                    container.style.left = newLeft + 'px';
                    container.style.right = 'auto';
                }
            }
            
            if (newHeight >= CONFIG.minHeight && newHeight <= CONFIG.maxHeight) {
                container.style.height = newHeight + 'px';
                if (direction.includes('n')) {
                    container.style.top = newTop + 'px';
                    container.style.bottom = 'auto';
                }
            }
        });

        document.addEventListener('mouseup', function() {
            chatState.isResizing = false;
            chatState.resizeDirection = null;
        });
    }

    function toggleMinimize() {
        const container = document.getElementById('kyanos-chatbot-container');
        const chatWindow = document.getElementById('chat-window');
        
        chatState.isMinimized = !chatState.isMinimized;
        
        if (chatState.isMinimized) {
            container.style.height = 'auto';
            chatWindow.classList.add('chat-minimized');
        } else {
            container.style.height = CONFIG.defaultHeight + 'px';
            chatWindow.classList.remove('chat-minimized');
        }
    }

    function addMessage(content, isUser = false) {
        const messagesContainer = document.getElementById('chat-messages');
        
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            display: flex;
            ${isUser ? 'justify-content: flex-end;' : 'justify-content: flex-start;'}
        `;
        
        const bubble = document.createElement('div');
        bubble.style.cssText = `
            max-width: 80%;
            padding: 12px 16px;
            border-radius: 14px;
            font-size: 14px;
            line-height: 1.6;
            word-wrap: break-word;
            word-break: break-word;
            ${isUser 
                ? 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;' 
                : 'background: white; color: #333; box-shadow: 0 2px 4px rgba(0,0,0,0.1);'
            }
        `;
        
        const formattedContent = content
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');
        
        bubble.innerHTML = formattedContent;
        messageDiv.appendChild(bubble);
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function setTyping(isTyping) {
        const indicator = document.getElementById('typing-indicator');
        const sendBtn = document.getElementById('chat-send-btn');
        const input = document.getElementById('chat-input');
        
        indicator.style.display = isTyping ? 'block' : 'none';
        sendBtn.disabled = isTyping;
        input.disabled = isTyping;
        
        if (isTyping) {
            const messagesContainer = document.getElementById('chat-messages');
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    async function sendMessage(message) {
        try {
            setTyping(true);
            conversationManager.addMessage('user', message);
            
            const response = await fetch(CONFIG.apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: message,
                    conversationHistory: conversationManager.getRecentContext()
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            const aiResponse = data.response || data.fallback || 'Sorry, I received an empty response.';
            
            conversationManager.addMessage('assistant', aiResponse);
            addMessage(aiResponse, false);

        } catch (error) {
            console.error('Chat error:', error);
            addMessage('I apologize, but I\'m having trouble connecting right now. Please try again in a moment.', false);
        } finally {
            setTyping(false);
        }
    }

    function handleSend() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (message && !input.disabled) {
            addMessage(message, true);
            input.value = '';
            input.focus();
            sendMessage(message);
        }
    }

    function init() {
        createChatbotUI();
        setupDragging();
        setupResizing();
        
        const minimizeBtn = document.getElementById('chat-minimize-btn');
        const headerMinimize = document.getElementById('chat-header-minimize');
        const clearBtn = document.getElementById('chat-clear-btn');
        const sendBtn = document.getElementById('chat-send-btn');
        const input = document.getElementById('chat-input');
        
        addMessage("Hello! I'm the Kyanos Plan AI Assistant. I can help you understand our business plan, technology strategy, and mission. What would you like to know?", false);

        // Start minimized
        toggleMinimize();

        minimizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMinimize();
        });
        
        headerMinimize.addEventListener('click', () => {
            if (chatState.isMinimized) {
                toggleMinimize();
            }
        });

        clearBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('Clear conversation history?')) {
                conversationManager.clearHistory();
                document.getElementById('chat-messages').innerHTML = '';
                addMessage("Conversation cleared. How can I help you?", false);
            }
        });

        sendBtn.addEventListener('click', handleSend);

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
            }
        });
        
        input.addEventListener('focus', function() {
            this.style.borderColor = '#667eea';
        });
        
        input.addEventListener('blur', function() {
            this.style.borderColor = '#ddd';
        });
        
        input.focus();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
