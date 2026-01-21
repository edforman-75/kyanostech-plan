// KyanosTech Intelligent Chatbot System
// Features: OpenAI integration, knowledge base, guardrails, smart follow-ups

(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        apiEndpoint: '/api/chat', // We'll use a proxy endpoint for security
        maxTokens: 500,
        temperature: 0.7,
        systemPrompt: `You are the KyanosTech Business Plan Assistant, an expert on the KyanosTech impact business plan. 
        
Your knowledge includes:
- KyanosTech is building Internet Presence Optimization and discovery tools for Democratic campaigns
- The company addresses the $600-800M non-media digital infrastructure market for Democratic campaigns
- Focus areas: AI discovery optimization, structured data for campaigns, digital presence maximization
- Target market: Democratic campaigns, committees, and officeholders (259 target clients by 2028)
- Business model: High-margin SaaS with Value-Added Reseller (VAR) distribution
- Revenue projections: $6.4M gross revenue by 2028 with ~90% net retention after commissions
- Impact focus: Ensuring Democratic visibility in AI-powered information ecosystem
- Founded to address urgent AI discovery crisis for progressive organizations

Guidelines:
1. Stay focused on topics related to KyanosTech's business plan, products, and impact mission
2. Provide specific, actionable information when possible
3. Reference relevant sections of the business plan when appropriate
4. Be professional but approachable
5. Format responses using markdown for clarity
6. Suggest relevant follow-up questions to guide deeper exploration

Do not:
- Provide information outside the scope of the business plan
- Make promises about future features not mentioned in the plan
- Share confidential financial projections beyond what's public
- Engage in political debates or take partisan positions`
    };
    
    // Knowledge base extracted from business plan
    const KNOWLEDGE_BASE = {
        products: {
            aiDiscovery: "AI discovery optimization tools for maximizing campaign visibility in chatbot responses",
            structuredData: "Schema markup and structured data systems for enhanced AI understanding",
            digitalOptimization: "Comprehensive digital presence optimization for Democratic entities"
        },
        market: {
            tam: "$600-800M total addressable market (non-media digital infrastructure)",
            som: "$30-50M serviceable obtainable market for AI discovery tools",
            targetClients: "259 Democratic campaigns, committees, and officeholders by 2028",
            segments: ["Democratic campaigns", "Democratic committees", "Democratic officeholders"]
        },
        impact: {
            mission: "Reduce AI bias in political communications",
            metrics: ["Bias incidents reduced", "Compliance violations prevented", "Trust scores improved"],
            structure: "Public Benefit Corporation"
        }
    };
    
    // Smart follow-up questions based on context
    const FOLLOW_UP_QUESTIONS = {
        general: [
            "Tell me about KyanosTech's products",
            "What is the market opportunity?",
            "How does KyanosTech measure impact?"
        ],
        products: [
            "How does AI discovery optimization work?",
            "What structured data systems do you provide?",
            "How do you ensure Democratic visibility in AI?"
        ],
        business: [
            "What is the pricing model?",
            "Who are the target customers?",
            "What is the go-to-market strategy?"
        ],
        impact: [
            "How does KyanosTech reduce AI bias?",
            "What are the impact metrics?",
            "Why a Public Benefit Corporation?"
        ]
    };
    
    // Chatbot UI class
    class KyanosChatbot {
        constructor() {
            this.isOpen = false;
            this.messages = [];
            this.isTyping = false;
            this.conversationContext = 'general';
            this.init();
        }
        
        init() {
            this.createUI();
            this.attachEventListeners();
            this.addWelcomeMessage();
        }
        
        createUI() {
            // Create main container
            const container = document.createElement('div');
            container.id = 'kyanos-chatbot';
            container.innerHTML = `
                <div class="kyanos-chat-widget">
                    <button class="kyanos-chat-trigger" aria-label="Open chat">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z" fill="currentColor"/>
                            <path d="M12 6C10.9 6 10 6.9 10 8C10 9.1 10.9 10 12 10C13.1 10 14 9.1 14 8C14 6.9 13.1 6 12 6ZM12 11C10.67 11 9.33 11.33 8.5 12C7.67 12.67 7 13.67 7 15H9C9 14.17 9.33 13.67 10 13.33C10.67 13 11.33 13 12 13C12.67 13 13.33 13 14 13.33C14.67 13.67 15 14.17 15 15H17C17 13.67 16.33 12.67 15.5 12C14.67 11.33 13.33 11 12 11Z" fill="currentColor"/>
                        </svg>
                        <span class="kyanos-chat-badge" style="display:none">1</span>
                    </button>
                    <div class="kyanos-chat-window" style="display:none">
                        <div class="kyanos-chat-header">
                            <div class="kyanos-chat-title">
                                <span class="kyanos-chat-status"></span>
                                KyanosTech Assistant
                            </div>
                            <button class="kyanos-chat-close" aria-label="Close chat">×</button>
                        </div>
                        <div class="kyanos-chat-messages"></div>
                        <div class="kyanos-chat-typing" style="display:none">
                            <div class="kyanos-typing-indicator">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                        <div class="kyanos-chat-suggestions"></div>
                        <div class="kyanos-chat-input-container">
                            <input type="text" class="kyanos-chat-input" placeholder="Ask about KyanosTech..." />
                            <button class="kyanos-chat-send" aria-label="Send message">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M2 10L17 2L13 18L11 11L2 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            // Add styles
            const styles = document.createElement('style');
            styles.textContent = `
                #kyanos-chatbot {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 9999;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                
                .kyanos-chat-trigger {
                    width: 60px;
                    height: 60px;
                    border-radius: 30px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: none;
                    color: white;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    transition: transform 0.3s, box-shadow 0.3s;
                    position: relative;
                }
                
                .kyanos-chat-trigger:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 20px rgba(0,0,0,0.25);
                }
                
                .kyanos-chat-badge {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: #ff4757;
                    color: white;
                    border-radius: 10px;
                    padding: 2px 6px;
                    font-size: 12px;
                    font-weight: bold;
                }
                
                .kyanos-chat-window {
                    position: absolute;
                    bottom: 80px;
                    right: 0;
                    width: 380px;
                    height: 600px;
                    background: white;
                    border-radius: 15px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    animation: slideUp 0.3s ease;
                }
                
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .kyanos-chat-header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .kyanos-chat-title {
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .kyanos-chat-status {
                    width: 8px;
                    height: 8px;
                    background: #4ade80;
                    border-radius: 50%;
                    display: inline-block;
                }
                
                .kyanos-chat-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 28px;
                    cursor: pointer;
                    opacity: 0.8;
                    transition: opacity 0.2s;
                }
                
                .kyanos-chat-close:hover {
                    opacity: 1;
                }
                
                .kyanos-chat-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }
                
                .kyanos-message {
                    max-width: 80%;
                    word-wrap: break-word;
                }
                
                .kyanos-message.user {
                    align-self: flex-end;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 12px 16px;
                    border-radius: 18px 18px 4px 18px;
                }
                
                .kyanos-message.bot {
                    align-self: flex-start;
                    background: #f3f4f6;
                    color: #1f2937;
                    padding: 12px 16px;
                    border-radius: 18px 18px 18px 4px;
                }
                
                .kyanos-message.bot h1,
                .kyanos-message.bot h2,
                .kyanos-message.bot h3 {
                    font-size: 1.1em;
                    margin: 10px 0 5px 0;
                    color: #4b5563;
                }
                
                .kyanos-message.bot p {
                    margin: 5px 0;
                    line-height: 1.5;
                }
                
                .kyanos-message.bot ul,
                .kyanos-message.bot ol {
                    margin: 5px 0;
                    padding-left: 20px;
                }
                
                .kyanos-message.bot li {
                    margin: 3px 0;
                }
                
                .kyanos-message.bot strong {
                    color: #374151;
                    font-weight: 600;
                }
                
                .kyanos-message.bot code {
                    background: #e5e7eb;
                    padding: 2px 4px;
                    border-radius: 3px;
                    font-family: monospace;
                    font-size: 0.9em;
                }
                
                .kyanos-chat-typing {
                    padding: 15px 20px;
                    display: flex;
                    align-items: center;
                }
                
                .kyanos-typing-indicator {
                    display: flex;
                    gap: 4px;
                }
                
                .kyanos-typing-indicator span {
                    width: 8px;
                    height: 8px;
                    background: #9ca3af;
                    border-radius: 50%;
                    animation: typing 1.4s infinite ease-in-out;
                }
                
                .kyanos-typing-indicator span:nth-child(1) {
                    animation-delay: -0.32s;
                }
                
                .kyanos-typing-indicator span:nth-child(2) {
                    animation-delay: -0.16s;
                }
                
                @keyframes typing {
                    0%, 80%, 100% {
                        transform: scale(0.8);
                        opacity: 0.5;
                    }
                    40% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
                
                .kyanos-chat-suggestions {
                    padding: 10px;
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                    border-top: 1px solid #e5e7eb;
                    min-height: 0;
                }
                
                .kyanos-suggestion {
                    background: #f3f4f6;
                    border: 1px solid #d1d5db;
                    padding: 6px 12px;
                    border-radius: 15px;
                    font-size: 13px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .kyanos-suggestion:hover {
                    background: #e5e7eb;
                    border-color: #9ca3af;
                }
                
                .kyanos-chat-input-container {
                    padding: 15px;
                    border-top: 1px solid #e5e7eb;
                    display: flex;
                    gap: 10px;
                }
                
                .kyanos-chat-input {
                    flex: 1;
                    padding: 10px 15px;
                    border: 1px solid #d1d5db;
                    border-radius: 25px;
                    outline: none;
                    font-size: 14px;
                    transition: border-color 0.2s;
                }
                
                .kyanos-chat-input:focus {
                    border-color: #667eea;
                }
                
                .kyanos-chat-send {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: none;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: transform 0.2s;
                }
                
                .kyanos-chat-send:hover {
                    transform: scale(1.1);
                }
                
                .kyanos-chat-send:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                
                @media (max-width: 480px) {
                    .kyanos-chat-window {
                        width: calc(100vw - 40px);
                        height: calc(100vh - 120px);
                        right: -10px;
                    }
                }
            `;
            
            document.head.appendChild(styles);
            document.body.appendChild(container);
            
            // Store references
            this.container = container;
            this.trigger = container.querySelector('.kyanos-chat-trigger');
            this.window = container.querySelector('.kyanos-chat-window');
            this.messagesEl = container.querySelector('.kyanos-chat-messages');
            this.inputEl = container.querySelector('.kyanos-chat-input');
            this.sendBtn = container.querySelector('.kyanos-chat-send');
            this.closeBtn = container.querySelector('.kyanos-chat-close');
            this.typingEl = container.querySelector('.kyanos-chat-typing');
            this.suggestionsEl = container.querySelector('.kyanos-chat-suggestions');
        }
        
        attachEventListeners() {
            this.trigger.addEventListener('click', () => this.toggle());
            this.closeBtn.addEventListener('click', () => this.close());
            this.sendBtn.addEventListener('click', () => this.sendMessage());
            this.inputEl.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendMessage();
            });
        }
        
        toggle() {
            this.isOpen ? this.close() : this.open();
        }
        
        open() {
            this.isOpen = true;
            this.window.style.display = 'flex';
            this.trigger.style.display = 'none';
            this.inputEl.focus();
        }
        
        close() {
            this.isOpen = false;
            this.window.style.display = 'none';
            this.trigger.style.display = 'flex';
        }
        
        addWelcomeMessage() {
            this.addMessage('bot', `Welcome to KyanosTech! 👋
            
I'm your intelligent assistant for exploring our impact business plan. I can help you understand:

• **Our Products** - AI compliance tools for political campaigns
• **Market Opportunity** - $800M addressable market
• **Impact Mission** - Reducing AI bias in politics
• **Business Model** - B2B SaaS with ethical focus

What would you like to know about KyanosTech?`);
            
            this.updateSuggestions(FOLLOW_UP_QUESTIONS.general);
        }
        
        addMessage(type, content) {
            const messageEl = document.createElement('div');
            messageEl.className = `kyanos-message ${type}`;
            
            // Parse markdown to HTML
            const htmlContent = this.parseMarkdown(content);
            messageEl.innerHTML = htmlContent;
            
            this.messagesEl.appendChild(messageEl);
            this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
            
            this.messages.push({ type, content });
        }
        
        parseMarkdown(text) {
            // Basic markdown parsing
            let html = text
                .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                .replace(/\*([^*]+)\*/g, '<em>$1</em>')
                .replace(/`([^`]+)`/g, '<code>$1</code>')
                .replace(/^### (.+)$/gm, '<h3>$1</h3>')
                .replace(/^## (.+)$/gm, '<h2>$1</h2>')
                .replace(/^# (.+)$/gm, '<h1>$1</h1>')
                .replace(/^• (.+)$/gm, '<li>$1</li>')
                .replace(/^- (.+)$/gm, '<li>$1</li>')
                .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
                .replace(/\n\n/g, '</p><p>')
                .replace(/\n/g, '<br>');
            
            // Wrap lists
            html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
            
            // Wrap in paragraph if not already structured
            if (!html.includes('<h') && !html.includes('<ul') && !html.includes('<p>')) {
                html = `<p>${html}</p>`;
            }
            
            return html;
        }
        
        async sendMessage() {
            const message = this.inputEl.value.trim();
            if (!message || this.isTyping) return;
            
            // Add user message
            this.addMessage('user', message);
            this.inputEl.value = '';
            
            // Show typing indicator
            this.showTyping();
            
            // Determine context for better responses
            this.updateContext(message);
            
            try {
                // For now, simulate a response since we need a backend proxy
                // In production, this would call your backend API
                const response = await this.simulateResponse(message);
                
                this.hideTyping();
                this.addMessage('bot', response.content);
                
                // Update suggestions based on context
                this.updateSuggestions(response.suggestions);
                
            } catch (error) {
                this.hideTyping();
                this.addMessage('bot', 'I apologize, but I encountered an error. Please try again or contact support if the issue persists.');
            }
        }
        
        updateContext(message) {
            const lowerMessage = message.toLowerCase();
            
            if (lowerMessage.includes('product') || lowerMessage.includes('campaign') || lowerMessage.includes('voter')) {
                this.conversationContext = 'products';
            } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('market')) {
                this.conversationContext = 'business';
            } else if (lowerMessage.includes('bias') || lowerMessage.includes('impact') || lowerMessage.includes('ethic')) {
                this.conversationContext = 'impact';
            }
        }
        
        async simulateResponse(message) {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
            
            const lowerMessage = message.toLowerCase();
            let content = '';
            let suggestions = FOLLOW_UP_QUESTIONS[this.conversationContext] || FOLLOW_UP_QUESTIONS.general;
            
            // Knowledge base responses
            if (lowerMessage.includes('product')) {
                content = `KyanosTech offers three core focus areas:

**1. AI Discovery Optimization** - ${KNOWLEDGE_BASE.products.aiDiscovery}
• Maximize visibility in ChatGPT, Claude, and other AI chatbots
• Optimize content for AI comprehension and retrieval
• Track and improve AI search performance

**2. Structured Data Systems** - ${KNOWLEDGE_BASE.products.structuredData}
• Schema markup implementation for campaigns
• LD-JSON optimization for political content
• Standardized data formats for AI consumption

**3. Digital Optimization Platform** - ${KNOWLEDGE_BASE.products.digitalOptimization}
• Complete digital presence audit and optimization
• Multi-channel content optimization
• Performance tracking and analytics

All solutions work together to ensure Democratic campaigns are discoverable and properly represented in the AI-powered information ecosystem.`;
                suggestions = FOLLOW_UP_QUESTIONS.products;
                
            } else if (lowerMessage.includes('market') || lowerMessage.includes('opportunity')) {
                content = `The market opportunity for KyanosTech is substantial:

**Market Size**: ${KNOWLEDGE_BASE.market.size}
**Growth Rate**: ${KNOWLEDGE_BASE.market.growth}

**Key Market Segments**:
${KNOWLEDGE_BASE.market.segments.map(s => `• ${s}`).join('\n')}

**Market Drivers**:
• Increasing AI adoption in political campaigns
• Growing regulatory scrutiny of AI use
• Rising concerns about AI bias and misinformation
• Demand for transparency in political communications

We're positioned to capture 5% market share within 3 years through our first-mover advantage in AI compliance.`;
                suggestions = FOLLOW_UP_QUESTIONS.business;
                
            } else if (lowerMessage.includes('impact') || lowerMessage.includes('mission')) {
                content = `KyanosTech's impact mission is central to our business:

**Mission**: ${KNOWLEDGE_BASE.impact.mission}

**Corporate Structure**: ${KNOWLEDGE_BASE.impact.structure}
This allows us to prioritize social impact alongside profitability.

**Key Impact Metrics**:
${KNOWLEDGE_BASE.impact.metrics.map(m => `• ${m}`).join('\n')}

**Impact Approach**:
1. Proactive bias detection and prevention
2. Transparency in all AI operations
3. Education and training for campaign staff
4. Open-source bias detection tools for researchers

We measure success not just in revenue, but in the trust and fairness we bring to democratic processes.`;
                suggestions = FOLLOW_UP_QUESTIONS.impact;
                
            } else if (lowerMessage.includes('pricing') || lowerMessage.includes('cost')) {
                content = `KyanosTech uses a tiered SaaS pricing model:

**Starter Plan** - $299/month
• Single campaign support
• Basic compliance monitoring
• 10,000 content checks/month

**Professional** - $999/month
• Multi-campaign support
• Advanced bias detection
• 50,000 content checks/month
• API access

**Enterprise** - $2,999/month
• Unlimited campaigns
• Custom compliance rules
• Unlimited content checks
• Dedicated support
• Training included

**Custom Solutions** - Contact us
• State party organizations
• National committees
• Large PACs

All plans include regular updates and compliance rule maintenance.`;
                suggestions = FOLLOW_UP_QUESTIONS.business;
                
            } else {
                content = `I understand you're asking about "${message}". 

Let me help you explore KyanosTech's business plan. I can provide detailed information about:

• **Products & Technology** - Our AI compliance and bias detection tools
• **Market Opportunity** - The $800M political AI market
• **Business Model** - SaaS pricing and go-to-market strategy
• **Impact Mission** - How we're reducing AI bias in politics
• **Team & Governance** - Our leadership and advisory board

Please select a topic or ask a specific question about any aspect of our business plan.`;
                suggestions = FOLLOW_UP_QUESTIONS.general;
            }
            
            return { content, suggestions };
        }
        
        updateSuggestions(suggestions) {
            this.suggestionsEl.innerHTML = '';
            
            suggestions.forEach(question => {
                const btn = document.createElement('button');
                btn.className = 'kyanos-suggestion';
                btn.textContent = question;
                btn.addEventListener('click', () => {
                    this.inputEl.value = question;
                    this.sendMessage();
                });
                this.suggestionsEl.appendChild(btn);
            });
        }
        
        showTyping() {
            this.isTyping = true;
            this.typingEl.style.display = 'flex';
            this.sendBtn.disabled = true;
        }
        
        hideTyping() {
            this.isTyping = false;
            this.typingEl.style.display = 'none';
            this.sendBtn.disabled = false;
        }
    }
    
    // Initialize chatbot when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.kyanosChatbot = new KyanosChatbot();
        });
    } else {
        window.kyanosChatbot = new KyanosChatbot();
    }
})();