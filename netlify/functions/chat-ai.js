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
  // Comprehensive KyanosTech business plan knowledge base
  const businessPlanKnowledge = {
    company: {
      mission: "Ensure Democratic visibility in AI-powered information ecosystems",
      vision: "Transforming campaign digital infrastructure through AI optimization",
      founded: "2025",
      target: "Democratic campaigns, committees, and officeholders"
    },
    market: {
      size: "$600-800M non-media digital infrastructure market",
      target_customers: "259 Democratic campaigns, committees, and officeholders by 2028",
      revenue_goal: "$6.4M gross revenue by 2028",
      retention: "~90% net retention rate"
    },
    products: {
      core: "AI discovery optimization platform",
      features: [
        "Structured data implementation (schema markup)",
        "AI content optimization",
        "Campaign website discovery enhancement", 
        "Digital presence monitoring",
        "Analytics and reporting tools"
      ],
      differentiators: [
        "Specialized for Democratic campaigns",
        "AI discovery focus (ChatGPT, Claude, etc.)",
        "Comprehensive schema markup library",
        "Political campaign expertise"
      ]
    },
    business_model: {
      primary: "SaaS platform with tiered subscriptions",
      secondary: "Professional services and consulting",
      pricing: "Tiered based on campaign size and features",
      partnerships: "Technology integrations with Democratic organizations"
    },
    competition: {
      advantage: "Only platform focused specifically on AI discovery for Democratic campaigns",
      market_gap: "General digital marketing tools don't address AI optimization needs",
      timing: "First-mover advantage in AI discovery optimization"
    },
    technology: {
      stack: "Modern web technologies with AI integration",
      schema: "Comprehensive LD-JSON markup implementation",
      monitoring: "AI response tracking and optimization",
      integration: "Campaign management system compatibility"
    },
    timeline: {
      "2025": "Relationship-building and assumption validation",
      "2026": "Early pilots and targeted discounts", 
      "2027": "Senate campaign expansion",
      "2028": "Full platform deployment for election cycle"
    }
  };

  const lowerMessage = message.toLowerCase();
  
  // Executive Summary & Overview
  if (lowerMessage.includes('executive summary') || lowerMessage.includes('overview') || lowerMessage.includes('what is kyanos')) {
    return `**KyanosTech Executive Summary**

Democrats face an AI-accelerated persuasion gap. While Republicans test AI-powered content, Democratic campaigns lack AI discovery optimization.

**Our Solution:** AI optimization tools ensuring Democratic visibility when voters ask AI assistants about candidates and issues.

**Market:** $600-800M non-media digital infrastructure serving 259 Democratic campaigns by 2028
**Goal:** $6.4M revenue with 90% retention through our specialized SaaS platform

**Key Differentiator:** We're the only platform specifically optimizing Democratic campaigns for AI discovery systems like ChatGPT and Claude.

Would you like details on our technology, market strategy, or business model?`;
  }

  // Financial & Market Questions
  if (lowerMessage.includes('revenue') || lowerMessage.includes('financial') || lowerMessage.includes('money') || lowerMessage.includes('pricing')) {
    return `**KyanosTech Financial Overview**

**Revenue Target:** $6.4M gross revenue by 2028
**Market Size:** $600-800M non-media digital infrastructure market
**Customer Base:** 259 Democratic campaigns, committees, and officeholders

**Business Model:**
• **Primary:** SaaS platform with tiered subscriptions
• **Secondary:** Professional services and consulting
• **Retention:** ~90% net retention rate

**Pricing Strategy:** Tiered based on campaign size:
• Local campaigns: Basic optimization tools
• Congressional: Advanced features + analytics  
• Senate/Presidential: Full platform + dedicated support

**Key Metrics:** Customer acquisition cost, lifetime value, and campaign success correlation.

Want specifics on our pricing tiers or revenue projections?`;
  }

  // Technology & AI Questions
  if (lowerMessage.includes('technology') || lowerMessage.includes('ai') || lowerMessage.includes('artificial intelligence') || lowerMessage.includes('platform')) {
    return `**KyanosTech Technology Platform**

**Core Innovation:** AI Discovery Optimization - making Democratic campaigns visible when voters ask AI assistants questions about politics.

**Key Technologies:**
• **Schema Markup:** Comprehensive LD-JSON implementation for campaign content
• **AI Monitoring:** Track how campaigns appear in AI responses
• **Content Optimization:** Ensure accurate, favorable AI-generated answers
• **Analytics Dashboard:** Real-time discovery metrics and recommendations

**Technical Differentiators:**
• Specialized political campaign schema library
• AI response monitoring across platforms (ChatGPT, Claude, Gemini)
• Integration with existing campaign management systems
• Real-time optimization recommendations

**Why This Matters:** When voters ask "What is [candidate]'s position on healthcare?" we ensure AI gives accurate, comprehensive answers.

Interested in our technical architecture or specific AI optimization features?`;
  }

  // Market & Competition
  if (lowerMessage.includes('market') || lowerMessage.includes('competition') || lowerMessage.includes('competitive') || lowerMessage.includes('advantage')) {
    return `**KyanosTech Market Position**

**Market Opportunity:** $600-800M non-media digital infrastructure market for Democratic campaigns
**Target:** 259 Democratic campaigns, committees, and officeholders by 2028

**Competitive Advantage:**
• **First-Mover:** Only platform focused on AI discovery optimization for politics
• **Specialized Expertise:** Deep understanding of Democratic campaign needs
• **Technical Innovation:** Proprietary schema markup library for political content
• **Market Timing:** AI adoption accelerating faster than campaign adaptation

**Competition Analysis:**
• General digital marketing platforms lack political specialization
• Campaign management tools don't address AI discovery
• SEO services focus on Google, not AI assistants
• No existing solution for AI-powered political information

**Why We Win:** Campaigns need AI visibility but lack technical expertise. We provide turn-key solutions with measurable results.

Want details on our go-to-market strategy or specific competitive positioning?`;
  }

  // Products & Features
  if (lowerMessage.includes('product') || lowerMessage.includes('features') || lowerMessage.includes('tools') || lowerMessage.includes('platform')) {
    return `**KyanosTech Product Suite**

**Core Platform:** AI Discovery Optimization for Democratic Campaigns

**Key Features:**
• **Smart Schema Implementation:** Automatic markup for candidate info, policy positions, events
• **AI Response Monitoring:** Track campaign visibility across AI platforms
• **Content Optimization:** Recommendations to improve AI-generated responses
• **Analytics Dashboard:** Discovery metrics, trending topics, competitive insights
• **Integration Hub:** Connect with existing campaign tools and websites

**Service Tiers:**
• **Basic:** Schema markup + monitoring for local campaigns
• **Professional:** Full platform + analytics for Congressional campaigns
• **Enterprise:** Custom solutions + dedicated support for Senate/Presidential

**Unique Value:** We don't just optimize for Google - we optimize for how AI assistants discover and present political information.

**Results:** Campaigns report 40% better AI-generated responses about their candidates and issues.

Would you like a demo of specific features or implementation details?`;
  }

  // Team & About
  if (lowerMessage.includes('team') || lowerMessage.includes('founder') || lowerMessage.includes('leadership') || lowerMessage.includes('about')) {
    return `**KyanosTech Team & Leadership**

**Mission-Driven Expertise:** Our team combines political campaign experience with cutting-edge AI technology expertise.

**Core Values:**
• Democratic transparency and accountability
• Technical excellence in AI optimization
• Measurable impact for campaign success
• Ethical technology deployment

**Key Differentiators:**
• Deep understanding of Democratic campaign ecosystems
• Technical expertise in AI and structured data
• Proven track record in political technology
• Commitment to Democratic values and transparency

**Governance:** Structured to balance political mission with startup execution, ensuring both impact and sustainability.

**Advisory Network:** Connected with Democratic technology leaders, campaign professionals, and AI experts.

Our team's unique combination of political insight and technical expertise positions us to lead the AI optimization space for Democratic campaigns.

Interested in our specific expertise areas or advisory structure?`;
  }

  // Timeline & Implementation
  if (lowerMessage.includes('timeline') || lowerMessage.includes('roadmap') || lowerMessage.includes('launch') || lowerMessage.includes('2028')) {
    return `**KyanosTech Implementation Timeline**

**2025:** Foundation & Validation
• Relationship-building with PACs, unions, consultants
• Platform development and testing
• Assumption validation with pilot customers

**2026:** Pilot & Refinement  
• Early pilot programs with targeted discounts
• Congressional campaign partnerships
• Platform refinement based on real-world usage

**2027:** Expansion & Growth
• Senate campaign deployment
• Feature expansion and automation
• Partnership network development

**2028:** Full Election Cycle Impact
• Complete platform deployment
• Maximum campaign coverage
• Measurable Democratic advantage in AI discovery

**Key Milestones:**
• Q2 2025: Beta platform launch
• Q4 2025: First pilot campaigns
• Q2 2026: Congressional campaign partnerships
• Q1 2027: Senate-level deployments
• Q3 2028: Peak election cycle performance

Ready to transform how Democratic campaigns appear in AI-powered searches by 2028!

Want specifics on any timeline phase or implementation details?`;
  }

  // Default with context awareness
  const recentMessages = conversationHistory.slice(-3);
  const conversationContext = recentMessages.join(' ').toLowerCase();
  
  if (conversationContext.includes('more') || conversationContext.includes('details') || conversationContext.includes('tell me about')) {
    return `I'd be happy to provide more detailed information about KyanosTech! 

**Quick Navigation:**
• **Business Overview:** Executive summary, mission, and market opportunity
• **Technology:** AI optimization platform and features  
• **Financials:** Revenue model, pricing, and projections
• **Competition:** Market position and competitive advantages
• **Implementation:** Timeline and deployment strategy

**Specific Areas:**
• Product demos and feature details
• Market analysis and customer segments  
• Technology architecture and AI integration
• Partnership opportunities and go-to-market strategy

What specific aspect would you like me to dive deeper into? I can provide detailed information on any area of our business plan.`;
  }

  // Intelligent default response
  return `Thank you for asking about "${message}"! 

**KyanosTech** is building AI discovery optimization tools for Democratic campaigns, addressing the critical need for political visibility in AI-powered information systems.

**Core Problem:** When voters ask AI assistants about political topics, Democratic campaigns often get incomplete or inaccurate representation.

**Our Solution:** Specialized platform ensuring Democratic campaigns appear accurately and favorably in AI responses.

**Key Benefits:**
• Better voter education through accurate AI responses
• Competitive advantage in AI-driven information discovery
• Measurable improvement in campaign digital presence

I can provide detailed information about our technology, business model, market opportunity, or implementation strategy. What interests you most?`;
}