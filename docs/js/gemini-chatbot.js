/**
 * Gemini AI Chatbot Integration for KyanosTech
 * This module handles the chat interface and API communication with Google Gemini
 */

class GeminiChatbot {
  constructor() {
    this.apiKey = window.GEMINI_API_KEY || '';
    this.apiBase = window.GEMINI_API_BASE || 'https://generativelanguage.googleapis.com/v1beta';
    this.model = 'gemini-1.5-flash';
    this.chatHistory = [];
    this.isOpen = false;
    this.isProcessing = false;
    
    // Context about KyanosTech for the AI
    this.systemContext = `You are an AI assistant for KyanosTech, a progressive technology platform addressing political media challenges through three core products:

    CORE PRODUCTS:
    
    1. AGON - "Win the Contest" (Campaign Platform)
    - Greek origin: ἀγών meaning contest, competition, struggle
    - For: Federal campaigns, state gubernatorial campaigns, and party committees
    - Users: Digital directors, communications staff, campaign consultants  
    - Features: Conversational AI authoring with embedded schema, narrative text and structured data alignment, WordPress/NationBuilder/Run! integration, grammar and voice alignment
    - Value: Ensures campaign websites train AI assistants with fact-based Democratic content while streamlining content production

    2. POLIS - "Govern with Intelligence" (Incumbent Platform)  
    - Greek origin: πόλις meaning city-state, legitimate government, civic community
    - For: Officeholders and Congressional committees
    - Users: Congressional staff, communications directors, committee staff
    - Features: Official .gov and committee site AI optimization, government disclosure and accessibility compliance, House Drupal CMS integration, consistent voice alignment
    - Value: Maintains continuity between campaign and officeholder visibility, ensures compliance, builds long-term trust while increasing staff productivity

    3. SCOPE - "Measure What Matters" (Verification Platform)
    - Greek origin: σκοπέω meaning to observe, examine, consider carefully  
    - For: Campaigns, officeholders, committees, and the Democratic ecosystem
    - Users: Campaign managers, analytics staff, academic partners, litigation support
    - Features: Continuous AI chatbot and search monitoring, weekly and real-time benchmark reporting, audit trails for litigation/regulatory use, academic research datasets
    - Value: Documents bias, validates Democratic visibility, demonstrates accountability. Creates evidence base for campaign ROI and platform oversight

    COMPANY MISSION: Combat political misinformation through AI, progressive technology solutions, civic engagement and media literacy, democracy-strengthening technology.
    
    Be helpful, professional, and focused on KyanosTech's vision and specific product offerings.
    Keep responses concise and relevant to the business plan and political technology space.`;
    
    this.init();
  }
  
  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
    } else {
      this.setupEventListeners();
    }
  }
  
  setupEventListeners() {
    const chatButton = document.getElementById('gemini-chat-button');
    const closeButton = document.getElementById('gemini-close-chat');
    const sendButton = document.getElementById('gemini-send-button');
    const chatInput = document.getElementById('gemini-chat-input');
    const chatWindow = document.getElementById('gemini-chat-window');
    
    if (chatButton) {
      chatButton.addEventListener('click', () => this.toggleChat());
    }
    
    if (closeButton) {
      closeButton.addEventListener('click', () => this.closeChat());
    }
    
    if (sendButton) {
      sendButton.addEventListener('click', () => this.sendMessage());
    }
    
    if (chatInput) {
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });
    }
    
    // Close chat when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isOpen && chatWindow && !chatWindow.contains(e.target) && 
          !chatButton.contains(e.target)) {
        this.closeChat();
      }
    });
  }
  
  toggleChat() {
    const chatWindow = document.getElementById('gemini-chat-window');
    if (chatWindow) {
      if (this.isOpen) {
        this.closeChat();
      } else {
        this.openChat();
      }
    }
  }
  
  openChat() {
    const chatWindow = document.getElementById('gemini-chat-window');
    if (chatWindow) {
      chatWindow.classList.remove('gemini-chat-hidden');
      this.isOpen = true;
      
      // Focus input
      const input = document.getElementById('gemini-chat-input');
      if (input) {
        setTimeout(() => input.focus(), 300);
      }
      
      // Track analytics event
      this.trackEvent('chat_opened');
    }
  }
  
  closeChat() {
    const chatWindow = document.getElementById('gemini-chat-window');
    if (chatWindow) {
      chatWindow.classList.add('gemini-chat-hidden');
      this.isOpen = false;
      
      // Track analytics event
      this.trackEvent('chat_closed');
    }
  }
  
  async sendMessage() {
    const input = document.getElementById('gemini-chat-input');
    const sendButton = document.getElementById('gemini-send-button');
    
    if (!input || !input.value.trim() || this.isProcessing) {
      return;
    }
    
    const message = input.value.trim();
    input.value = '';
    
    // Add user message to chat
    this.addMessage(message, 'user');
    
    // Disable input while processing
    this.isProcessing = true;
    input.disabled = true;
    sendButton.disabled = true;
    
    // Show typing indicator
    this.showTypingIndicator();
    
    try {
      // Get AI response
      const response = await this.getGeminiResponse(message);
      
      // Remove typing indicator
      this.removeTypingIndicator();
      
      // Add AI response to chat
      this.addMessage(response, 'assistant');
      
      // Track analytics event
      this.trackEvent('message_sent', { messageLength: message.length });
      
    } catch (error) {
      console.error('Error getting Gemini response:', error);
      
      // Remove typing indicator
      this.removeTypingIndicator();
      
      // Show more specific error message based on the error type
      let errorMessage = 'I apologize, but I encountered an error. Please try again.';
      
      if (error.message.includes('429')) {
        errorMessage = 'I\'m experiencing high demand right now. Please wait a moment and try again.';
      } else if (error.message.includes('API request failed')) {
        errorMessage = 'There was a connection issue. Please check your internet connection and try again.';
      }
      
      this.addMessage(errorMessage, 'assistant');
    } finally {
      // Re-enable input
      this.isProcessing = false;
      input.disabled = false;
      sendButton.disabled = false;
      input.focus();
    }
  }
  
  async getGeminiResponse(message) {
    // If no API key, return a demo response
    if (!this.apiKey || this.apiKey === 'your_gemini_api_key_here') {
      return this.getDemoResponse(message);
    }
    
    // Prepare the conversation history
    const contents = [
      {
        role: 'user',
        parts: [{ text: this.systemContext }]
      },
      ...this.chatHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      })),
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ];
    
    // Call Gemini API
    const response = await fetch(`${this.apiBase}/models/${this.model}:generateContent?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `HTTP ${response.status}`;
      throw new Error(`API request failed: ${response.status} - ${errorMessage}`);
    }
    
    const data = await response.json();
    
    // Extract the response text
    const responseText = data.candidates[0]?.content?.parts[0]?.text || 
                        'I apologize, but I couldn\'t generate a response. Please try again.';
    
    // Update chat history
    this.chatHistory.push({ role: 'user', content: message });
    this.chatHistory.push({ role: 'assistant', content: responseText });
    
    // Keep only last 10 messages in history
    if (this.chatHistory.length > 20) {
      this.chatHistory = this.chatHistory.slice(-20);
    }
    
    return responseText;
  }
  
  getDemoResponse(message) {
    // Demo responses when API key is not configured
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('what') && lowerMessage.includes('kyanostech')) {
      return 'KyanosTech is a progressive technology platform designed to address political media challenges through AI-powered solutions. We focus on combating misinformation, enhancing civic engagement, and strengthening democratic discourse through innovative technology.';
    }
    
    if (lowerMessage.includes('investment') || lowerMessage.includes('invest')) {
      return 'KyanosTech is seeking investment to scale our progressive AI technology platform. Our business model focuses on B2B solutions for political organizations, advocacy groups, and civic institutions. We offer detailed financial projections and impact metrics in our business plan.';
    }
    
    if (lowerMessage.includes('team') || lowerMessage.includes('who')) {
      return 'The KyanosTech team combines expertise in political strategy, AI technology, and civic engagement. Our leadership has deep experience in progressive politics and technology innovation. You can learn more about our team in the Team & Governance section of the business plan.';
    }
    
    if (lowerMessage.includes('technology') || lowerMessage.includes('product')) {
      return 'Our technology stack includes AI-powered content analysis, fact-checking systems, and engagement tools designed specifically for the progressive political ecosystem. We leverage cutting-edge language models and machine learning to combat misinformation and enhance political discourse.';
    }
    
    if (lowerMessage.includes('contact') || lowerMessage.includes('reach')) {
      return 'For more information about KyanosTech or to discuss partnership opportunities, please refer to the contact information in our business plan. We welcome inquiries from investors, political organizations, and potential partners aligned with our mission.';
    }
    
    // Default response
    return `Thank you for your interest in KyanosTech! While I'm currently in demo mode (API key not configured), I can tell you that we're building innovative AI solutions for progressive politics. Please explore our business plan sections to learn more about our mission, technology, and investment opportunity.`;
  }
  
  addMessage(content, role) {
    const messagesContainer = document.getElementById('gemini-chat-messages');
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `gemini-message gemini-${role}`;
    
    const messageP = document.createElement('p');
    messageP.textContent = content;
    messageDiv.appendChild(messageP);
    
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  showTypingIndicator() {
    const messagesContainer = document.getElementById('gemini-chat-messages');
    if (!messagesContainer) return;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'gemini-message gemini-assistant';
    typingDiv.id = 'gemini-typing-indicator';
    
    const typingSpan = document.createElement('span');
    typingSpan.className = 'gemini-typing';
    typingDiv.appendChild(typingSpan);
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  removeTypingIndicator() {
    const typingIndicator = document.getElementById('gemini-typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }
  
  trackEvent(eventName, eventData = {}) {
    // Track with Plausible if available
    if (window.plausible) {
      window.plausible(eventName, { props: eventData });
    }
    
    // Also log for debugging
    console.log('Gemini Chat Event:', eventName, eventData);
  }
}

// Initialize the chatbot when the script loads
// Use a global variable to prevent multiple initializations
if (!window.geminiChatbot) {
  window.geminiChatbot = new GeminiChatbot();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GeminiChatbot;
}