// KyanosTech Intelligent Chatbot System v2.0.0
// NEW: Real AI integration with OpenAI/Claude API
// Enhanced: Dynamic responses, conversation context, better understanding

(function() {
    'use strict';
    
    // Version and configuration
    const CHATBOT_VERSION = '2.0.0';
    const CONFIG = {
        // AI Configuration
        aiProvider: 'openai', // 'openai' or 'anthropic'
        apiEndpoint: '/.netlify/functions/chat-ai', // Netlify function endpoint
        maxTokens: 800,
        temperature: 0.7,
        model: 'gpt-4-turbo-preview',
        
        // Enhanced system prompt for better responses
        systemPrompt: `You are the KyanosTech Business Plan Assistant v${CHATBOT_VERSION}, an expert AI assistant helping users understand KyanosTech's mission and business strategy.

KNOWLEDGE CONTEXT:
- KyanosTech builds AI optimization and discovery tools for Democratic campaigns
- Market: $600-800M non-media digital infrastructure for Democratic campaigns  
- Target: 259 Democratic campaigns, committees, and officeholders by 2028
- Revenue goal: $6.4M gross revenue by 2028 with ~90% net retention
- Focus: AI discovery optimization, structured data systems, digital presence maximization
- Mission: Ensure Democratic visibility in AI-powered information ecosystem

RESPONSE GUIDELINES:
1. Be knowledgeable but conversational - like talking to a smart colleague
2. Provide specific, actionable insights when possible
3. Reference relevant business plan sections when appropriate
4. Ask clarifying questions to provide better assistance
5. Use data and numbers from the business plan when relevant
6. Be honest about limitations - don't make up information
7. Stay focused on KyanosTech's business plan and mission

RESPONSE STYLE:
- Professional but approachable tone
- Use bullet points for clarity when listing items
- Include relevant follow-up questions
- Provide context for why information matters
- Cite business plan sections when referencing specific data

Do not make up financial projections, team members, or features not in the actual business plan.`,

        // Conversation tracking
        maxHistoryLength: 10,
        contextWindow: 5
    };
    
    // Enhanced knowledge base with more structure
    const ENHANCED_KNOWLEDGE_BASE = {
        sections: {
            'executive-summary': 'Overview of KyanosTech mission and key objectives',
            'market-opportunity': 'Market analysis, TAM/SOM, and financial projections', 
            'product-strategy': 'AI discovery optimization tools and technology approach',
            'go-to-market': 'Distribution strategy and customer acquisition',
            'business-model': 'Revenue model, pricing, and unit economics',
            'financial-plan': 'Revenue projections, costs, and funding requirements',
            'team-governance': 'Organizational structure and key personnel',
            'risk-analysis': 'Market risks and mitigation strategies'
        },
        
        keyMetrics: {
            tam: '$600-800M total addressable market',
            som: '$30-50M serviceable obtainable market', 
            targetClients: '259 Democratic campaigns, committees, and officeholders by 2028',
            grossRevenue2028: '$6.4M gross revenue by 2028',
            netRetention: '~90% net revenue retention after partner commissions',
            businessModel: 'High-margin SaaS with Value-Added Reseller (VAR) distribution'
        },
        
        products: {
            aiDiscovery: {
                name: 'AI Discovery Optimization',
                description: 'Tools to maximize campaign visibility in AI chatbot responses (ChatGPT, Claude, etc.)',
                features: ['Content optimization for AI comprehension', 'AI search performance tracking', 'Chatbot response monitoring']
            },
            structuredData: {
                name: 'Structured Data Systems', 
                description: 'Schema markup and LD-JSON systems for enhanced AI understanding',
                features: ['Schema markup implementation', 'LD-JSON optimization', 'Standardized data formats']
            },
            digitalOptimization: {
                name: 'Digital Optimization Platform',
                description: 'Comprehensive digital presence optimization for Democratic entities',
                features: ['Multi-channel optimization', 'Performance analytics', 'Digital presence auditing']
            }
        }
    };

    // Conversation context and memory
    class ConversationManager {
        constructor() {
            this.history = [];
            this.currentContext = 'general';
            this.userInterests = new Set();
            this.discussedTopics = new Set();
        }
        
        addMessage(message, response, intent = null) {
            this.history.push({
                timestamp: new Date().toISOString(),
                userMessage: message,
                botResponse: response,
                intent: intent,
                context: this.currentContext
            });
            
            // Keep only recent history
            if (this.history.length > CONFIG.maxHistoryLength) {
                this.history = this.history.slice(-CONFIG.maxHistoryLength);
            }
            
            this.updateContext(message);
            this.trackUserInterests(message);
        }
        
        updateContext(message) {
            const msg = message.toLowerCase();
            
            if (msg.includes('market') || msg.includes('revenue') || msg.includes('financial')) {
                this.currentContext = 'financial';
            } else if (msg.includes('product') || msg.includes('technology') || msg.includes('ai')) {
                this.currentContext = 'product';
            } else if (msg.includes('customer') || msg.includes('campaign') || msg.includes('target')) {
                this.currentContext = 'market';
            } else if (msg.includes('team') || msg.includes('founder') || msg.includes('governance')) {
                this.currentContext = 'team';
            } else if (msg.includes('risk') || msg.includes('challenge') || msg.includes('competition')) {
                this.currentContext = 'risk';
            }
        }
        
        trackUserInterests(message) {
            const interests = {
                'investor': ['funding', 'investment', 'return', 'roi', 'valuation'],
                'customer': ['product', 'features', 'pricing', 'demo'],
                'competitor': ['market', 'competition', 'advantage', 'differentiation'],
                'partner': ['partnership', 'integration', 'collaboration'],
                'technical': ['technology', 'ai', 'implementation', 'architecture']
            };
            
            const msg = message.toLowerCase();
            for (const [interest, keywords] of Object.entries(interests)) {
                if (keywords.some(keyword => msg.includes(keyword))) {
                    this.userInterests.add(interest);
                }
            }
        }
        
        getRecentContext() {
            const recentMessages = this.history.slice(-CONFIG.contextWindow);
            return recentMessages.map(msg => 
                `User: ${msg.userMessage}\nAssistant: ${msg.botResponse.substring(0, 200)}...`
            ).join('\n\n');
        }
        
        getSuggestedFollowUps() {
            const context = this.currentContext;
            const interests = Array.from(this.userInterests);
            
            const followUpMap = {
                'financial': [
                    "What are the key revenue drivers?",
                    "How does the pricing model work?", 
                    "What's the path to profitability?"
                ],
                'product': [
                    "How does AI discovery optimization work?",
                    "What makes your technology different?",
                    "Can you show me a demo?"
                ],
                'market': [
                    "Who are your main competitors?",
                    "How large is the target market?",
                    "What's your go-to-market strategy?"
                ],
                'team': [
                    "What's your governance structure?",
                    "Who are the key team members?",
                    "How do you plan to scale the team?"
                ],
                'risk': [
                    "What are the biggest risks?",
                    "How do you handle competition?",
                    "What's your mitigation strategy?"
                ]
            };
            
            return followUpMap[context] || [
                "Tell me about your products",
                "What's the market opportunity?",
                "How does your business model work?"
            ];
        }
    }

    // AI Integration Class
    class AIResponseGenerator {
        constructor() {
            this.conversationManager = new ConversationManager();
        }
        
        async generateResponse(message) {
            try {
                // Prepare context for AI
                const context = this.prepareContext(message);
                
                // Call AI API
                const response = await this.callAI(message, context);
                
                // Process and enhance response
                const enhancedResponse = this.enhanceResponse(response, message);
                
                // Track conversation
                this.conversationManager.addMessage(message, enhancedResponse);
                
                return {
                    response: enhancedResponse,
                    suggestions: this.conversationManager.getSuggestedFollowUps(),
                    context: this.conversationManager.currentContext
                };
                
            } catch (error) {
                console.error('AI Response Error:', error);
                return this.getFallbackResponse(message);
            }
        }
        
        prepareContext(message) {
            const recentContext = this.conversationManager.getRecentContext();
            const userInterests = Array.from(this.conversationManager.userInterests);
            
            return {
                conversationHistory: recentContext,
                userInterests: userInterests,
                businessPlanSections: ENHANCED_KNOWLEDGE_BASE.sections,
                keyMetrics: ENHANCED_KNOWLEDGE_BASE.keyMetrics,
                currentContext: this.conversationManager.currentContext
            };
        }
        
        async callAI(message, context) {
            const payload = {
                model: CONFIG.model,
                messages: [
                    {
                        role: "system",
                        content: CONFIG.systemPrompt + "\n\nContext: " + JSON.stringify(context, null, 2)
                    },
                    {
                        role: "user", 
                        content: message
                    }
                ],
                max_tokens: CONFIG.maxTokens,
                temperature: CONFIG.temperature
            };
            
            const response = await fetch(CONFIG.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) {
                throw new Error(`AI API Error: ${response.status}`);
            }
            
            const data = await response.json();
            return data.response || data.choices?.[0]?.message?.content || 'No response generated';
        }
        
        enhanceResponse(response, originalMessage) {
            // Add relevant data points if missing
            if (originalMessage.toLowerCase().includes('market') && !response.includes('$6')) {
                response += `\n\n*Key metric: KyanosTech projects $6.4M gross revenue by 2028 serving 259 Democratic entities.*`;
            }
            
            // Add business plan section references
            const sections = this.identifyRelevantSections(originalMessage);
            if (sections.length > 0) {
                response += `\n\n*This information comes from the ${sections.join(', ')} section(s) of our business plan.*`;
            }
            
            return response;
        }
        
        identifyRelevantSections(message) {
            const msg = message.toLowerCase();
            const sections = [];
            
            if (msg.includes('market') || msg.includes('opportunity')) sections.push('Market Analysis');
            if (msg.includes('product') || msg.includes('technology')) sections.push('Product Strategy');  
            if (msg.includes('revenue') || msg.includes('financial')) sections.push('Financial Plan');
            if (msg.includes('team') || msg.includes('governance')) sections.push('Team & Governance');
            if (msg.includes('risk') || msg.includes('challenge')) sections.push('Risk Analysis');
            
            return sections;
        }
        
        getFallbackResponse(message) {
            const msg = message.toLowerCase();
            let fallback = "I apologize, but I'm having trouble accessing my AI capabilities right now. ";
            
            // Provide basic fallback based on keywords
            if (msg.includes('product')) {
                fallback += "KyanosTech focuses on AI discovery optimization, structured data systems, and digital optimization for Democratic campaigns.";
            } else if (msg.includes('market')) {
                fallback += "Our target market is the $600-800M Democratic campaign digital infrastructure space, aiming for 259 clients by 2028.";
            } else {
                fallback += "Please try asking about our products, market opportunity, or business model.";
            }
            
            return {
                response: fallback,
                suggestions: ["What are your products?", "Tell me about the market opportunity", "How does your business model work?"],
                context: 'fallback'
            };
        }
    }

    // Enhanced UI Manager
    class EnhancedChatUI {
        constructor() {
            this.aiGenerator = new AIResponseGenerator();
            this.isProcessing = false;
            this.messageCount = 0;
        }
        
        init() {
            console.log('Initializing KyanosTech Chatbot...');
            this.createChatInterface();
            this.addEnhancedStyles();
            this.attachEventListeners();
            this.showWelcomeMessage();
            
            // Make sure the container is visible
            const container = document.getElementById('kyanos-chatbot-container');
            if (container) {
                console.log('Chatbot container created successfully');
                container.style.display = 'block';
                container.style.visibility = 'visible';
            } else {
                console.error('Failed to create chatbot container');
            }
            
            console.log(`KyanosTech Chatbot v${CHATBOT_VERSION} initialized successfully!`);
        }
        
        createChatInterface() {
            // Enhanced chat interface with version indicator
            const chatHTML = `
                <div id="kyanos-chatbot-container" style="position: fixed; top: 80px; left: 20px; z-index: 99999;">
                    <div id="kyanos-chat-widget" style="display: none;">
                        <div class="kyanos-chat-header">
                            <div class="kyanos-chat-title">
                                <strong>KyanosTech AI Assistant</strong>
                                <span class="kyanos-version">v${CHATBOT_VERSION}</span>
                            </div>
                            <button id="kyanos-chat-close">×</button>
                        </div>
                        <div id="kyanos-chat-messages"></div>
                        <div id="kyanos-typing-indicator" style="display: none;">
                            <div class="kyanos-typing-dots">
                                <span></span><span></span><span></span>
                            </div>
                            <span>AI is thinking...</span>
                        </div>
                        <div class="kyanos-chat-input-container">
                            <input type="text" id="kyanos-chat-input" placeholder="Ask about KyanosTech..." />
                            <button id="kyanos-chat-send">Send</button>
                        </div>
                    </div>
                    <button id="kyanos-chat-toggle">Kyanos AI Assistant</button>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', chatHTML);
            this.addEnhancedStyles();
        }
        
        addEnhancedStyles() {
            const styles = `
                <style>
                #kyanos-chatbot-container {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                
                #kyanos-chat-widget {
                    width: 380px;
                    height: 500px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.12);
                    display: flex;
                    flex-direction: column;
                    margin-bottom: 10px;
                    border: 1px solid #e1e5e9;
                }
                
                .kyanos-chat-header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 15px;
                    border-radius: 12px 12px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .kyanos-chat-title {
                    display: flex;
                    flex-direction: column;
                }
                
                .kyanos-version {
                    font-size: 11px;
                    opacity: 0.8;
                    font-weight: normal;
                }
                
                #kyanos-chat-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 20px;
                    cursor: pointer;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                }
                
                #kyanos-chat-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 15px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                
                .kyanos-message {
                    max-width: 85%;
                    padding: 10px 14px;
                    border-radius: 18px;
                    line-height: 1.4;
                    font-size: 14px;
                }
                
                .kyanos-message.user {
                    background: #667eea;
                    color: white;
                    align-self: flex-end;
                    border-bottom-right-radius: 4px;
                }
                
                .kyanos-message.bot {
                    background: #f1f3f5;
                    color: #333;
                    align-self: flex-start;
                    border-bottom-left-radius: 4px;
                }
                
                .kyanos-message.bot strong {
                    color: #667eea;
                }
                
                .kyanos-suggestions {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                    margin-top: 8px;
                }
                
                .kyanos-suggestion {
                    background: #667eea15;
                    border: 1px solid #667eea30;
                    color: #667eea;
                    padding: 6px 12px;
                    border-radius: 15px;
                    font-size: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .kyanos-suggestion:hover {
                    background: #667eea;
                    color: white;
                }
                
                #kyanos-typing-indicator {
                    padding: 10px 15px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #666;
                    font-size: 13px;
                }
                
                .kyanos-typing-dots {
                    display: flex;
                    gap: 3px;
                }
                
                .kyanos-typing-dots span {
                    width: 6px;
                    height: 6px;
                    background: #667eea;
                    border-radius: 50%;
                    animation: kyanos-typing 1.4s infinite;
                }
                
                .kyanos-typing-dots span:nth-child(2) { animation-delay: 0.2s; }
                .kyanos-typing-dots span:nth-child(3) { animation-delay: 0.4s; }
                
                @keyframes kyanos-typing {
                    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
                    30% { transform: translateY(-10px); opacity: 1; }
                }
                
                .kyanos-chat-input-container {
                    padding: 15px;
                    border-top: 1px solid #e1e5e9;
                    display: flex;
                    gap: 8px;
                }
                
                #kyanos-chat-input {
                    flex: 1;
                    padding: 10px 14px;
                    border: 1px solid #d1d5db;
                    border-radius: 20px;
                    outline: none;
                    font-size: 14px;
                }
                
                #kyanos-chat-input:focus {
                    border-color: #667eea;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }
                
                #kyanos-chat-send {
                    background: #667eea;
                    color: white;
                    border: none;
                    padding: 10px 16px;
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                }
                
                #kyanos-chat-send:hover {
                    background: #5a6fd8;
                }
                
                #kyanos-chat-send:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                }
                
                #kyanos-chat-toggle {
                    padding: 8px 16px;
                    border-radius: 6px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: none;
                    color: white;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
                    transition: transform 0.2s;
                    white-space: nowrap;
                }
                
                #kyanos-chat-toggle:hover {
                    transform: scale(1.05);
                }
                
                @media (max-width: 480px) {
                    #kyanos-chat-widget {
                        width: calc(100vw - 40px);
                        height: calc(100vh - 120px);
                        bottom: 80px;
                        right: 20px;
                    }
                }
                </style>
            `;
            
            document.head.insertAdjacentHTML('beforeend', styles);
        }
        
        attachEventListeners() {
            const toggle = document.getElementById('kyanos-chat-toggle');
            const close = document.getElementById('kyanos-chat-close');
            const send = document.getElementById('kyanos-chat-send');
            const input = document.getElementById('kyanos-chat-input');
            const widget = document.getElementById('kyanos-chat-widget');
            
            toggle.addEventListener('click', () => {
                widget.style.display = widget.style.display === 'none' ? 'flex' : 'none';
            });
            
            close.addEventListener('click', () => {
                widget.style.display = 'none';
            });
            
            send.addEventListener('click', () => this.sendMessage());
            
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
            
            // Add suggestion click handlers
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('kyanos-suggestion')) {
                    const suggestion = e.target.textContent;
                    document.getElementById('kyanos-chat-input').value = suggestion;
                    this.sendMessage();
                }
            });
        }
        
        async sendMessage() {
            if (this.isProcessing) return;
            
            const input = document.getElementById('kyanos-chat-input');
            const message = input.value.trim();
            
            if (!message) return;
            
            this.isProcessing = true;
            input.value = '';
            document.getElementById('kyanos-chat-send').disabled = true;
            
            // Add user message
            this.addMessage(message, 'user');
            
            // Show typing indicator
            this.showTypingIndicator();
            
            try {
                // Get AI response
                const result = await this.aiGenerator.generateResponse(message);
                
                // Hide typing indicator
                this.hideTypingIndicator();
                
                // Add bot response with suggestions
                this.addMessage(result.response, 'bot', result.suggestions);
                
            } catch (error) {
                console.error('Chat Error:', error);
                this.hideTypingIndicator();
                this.addMessage('I apologize, but I encountered an error. Please try again.', 'bot');
            }
            
            this.isProcessing = false;
            document.getElementById('kyanos-chat-send').disabled = false;
            input.focus();
        }
        
        addMessage(content, type, suggestions = []) {
            const messagesContainer = document.getElementById('kyanos-chat-messages');
            const messageDiv = document.createElement('div');
            messageDiv.className = `kyanos-message ${type}`;
            
            // Convert markdown-style formatting
            content = content
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/\n/g, '<br>');
            
            messageDiv.innerHTML = content;
            
            // Add suggestions for bot messages
            if (type === 'bot' && suggestions.length > 0) {
                const suggestionsDiv = document.createElement('div');
                suggestionsDiv.className = 'kyanos-suggestions';
                
                suggestions.forEach(suggestion => {
                    const suggestionBtn = document.createElement('button');
                    suggestionBtn.className = 'kyanos-suggestion';
                    suggestionBtn.textContent = suggestion;
                    suggestionsDiv.appendChild(suggestionBtn);
                });
                
                messageDiv.appendChild(suggestionsDiv);
            }
            
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            this.messageCount++;
        }
        
        showTypingIndicator() {
            document.getElementById('kyanos-typing-indicator').style.display = 'flex';
            document.getElementById('kyanos-chat-messages').scrollTop = 
                document.getElementById('kyanos-chat-messages').scrollHeight;
        }
        
        hideTypingIndicator() {
            document.getElementById('kyanos-typing-indicator').style.display = 'none';
        }
        
        showWelcomeMessage() {
            setTimeout(() => {
                this.addMessage(
                    `Hello! I'm the **KyanosTech AI Assistant v${CHATBOT_VERSION}**. I can help you understand our business plan, technology strategy, and mission to optimize Democratic campaigns for AI discovery.\n\nWhat would you like to know?`,
                    'bot',
                    [
                        "What is KyanosTech?",
                        "Tell me about your products",
                        "What's the market opportunity?",
                        "How does your business model work?"
                    ]
                );
            }, 500);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            const chatUI = new EnhancedChatUI();
            chatUI.init();
        });
    } else {
        const chatUI = new EnhancedChatUI();
        chatUI.init();
    }

})();