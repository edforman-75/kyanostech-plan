exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { message, conversationHistory } = JSON.parse(event.body);
    
    if (!message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Message is required' })
      };
    }

    // For now, simulate AI response until API keys are configured
    const simulatedResponse = await generateSimulatedAIResponse(message, conversationHistory);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        response: simulatedResponse,
        conversationId: Date.now().toString(),
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('AI Chat Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        fallback: 'I apologize, but I\'m experiencing technical difficulties. Please try asking your question in a different way.'
      })
    };
  }
};

async function generateSimulatedAIResponse(message, conversationHistory = []) {
  const businessPlanContext = `
KyanosTech is building AI optimization and discovery tools for Democratic campaigns, addressing the $600-800M non-media digital infrastructure market. Our focus areas include:

- AI discovery optimization for campaign websites and content
- Structured data implementation for better search visibility  
- Digital presence maximization through schema markup
- Campaign infrastructure tools and analytics
- Democratic party technology solutions

Key business model components:
- SaaS platform for campaign optimization
- Consulting services for digital infrastructure
- Technology partnerships with Democratic organizations
- Revenue streams from subscription and professional services
`;

  const lowerMessage = message.toLowerCase();
  
  // Enhanced keyword matching with context-aware responses
  if (lowerMessage.includes('ai') || lowerMessage.includes('artificial intelligence')) {
    return `KyanosTech specializes in AI optimization for Democratic campaigns. Our platform helps campaigns leverage AI for better search discovery, content optimization, and voter engagement. We focus on making campaign websites more discoverable by AI systems like ChatGPT and Claude through structured data and schema markup.

Would you like to know more about our AI discovery optimization tools or how we help campaigns improve their digital presence?`;
  }
  
  if (lowerMessage.includes('campaign') || lowerMessage.includes('democratic')) {
    return `KyanosTech serves the Democratic campaign ecosystem by providing AI-powered infrastructure tools. We address the $600-800M non-media digital market with solutions for campaign optimization, voter outreach, and digital presence enhancement.

Our tools help Democratic campaigns compete more effectively in the digital space. What specific aspect of campaign technology interests you most?`;
  }
  
  if (lowerMessage.includes('market') || lowerMessage.includes('revenue') || lowerMessage.includes('business')) {
    return `KyanosTech targets the $600-800M non-media digital infrastructure market for Democratic campaigns. This represents a significant opportunity as campaigns increasingly rely on digital tools for voter engagement and fundraising.

Our business model includes SaaS subscriptions, consulting services, and technology partnerships. The market is growing rapidly as AI becomes more central to campaign operations.`;
  }
  
  if (lowerMessage.includes('schema') || lowerMessage.includes('structured data') || lowerMessage.includes('markup')) {
    return `Schema markup and structured data are core to our AI discovery optimization strategy. We implement comprehensive LD-JSON markup to make campaign content more discoverable by AI systems.

This includes organization data, event markup for campaign activities, article schemas for policy content, and custom political campaign schemas. This helps AI assistants like ChatGPT provide more accurate information about campaigns and candidates.`;
  }
  
  if (lowerMessage.includes('competition') || lowerMessage.includes('advantage')) {
    return `KyanosTech's competitive advantage lies in our specialized focus on Democratic campaign infrastructure and AI optimization. While many companies offer general digital marketing tools, we specifically understand the unique needs of political campaigns.

Our deep integration with Democratic party organizations and focus on AI discovery optimization sets us apart in this specialized market.`;
  }

  // Conversation context awareness
  const recentMessages = conversationHistory.slice(-3);
  if (recentMessages.some(msg => msg.includes('more') || msg.includes('details'))) {
    return `I'd be happy to provide more specific information about KyanosTech's solutions. Our platform combines AI optimization with political campaign expertise to help Democratic campaigns maximize their digital impact.

What particular area would you like me to elaborate on - our technology platform, market approach, or specific campaign solutions?`;
  }
  
  // Default intelligent response
  return `Thank you for your question about "${message}". KyanosTech is focused on AI optimization and discovery tools for Democratic campaigns. We're building infrastructure to help campaigns leverage AI technology for better voter engagement and digital presence.

Our platform addresses the growing need for AI-optimized campaign technology in the $600-800M non-media digital market. Is there a specific aspect of our campaign technology solutions you'd like to explore?`;
}