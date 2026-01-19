// Kyanos Plan AI Assistant - Powered by Claude
// Uses keyword search for context retrieval (no external embedding API required)

const fs = require('fs');
const path = require('path');

// Load the business plan content at startup
let businessPlanContent = '';
try {
  const docsPath = path.join(__dirname, '../../docs');
  const coreFiles = [
    'index.md',
    'ky-executive-summary.md',
    'ky-value-proposition.md',
    'Two_Scares.md',
    'ky-problem-urgency.md',
    'ky-solution-theory.md',
    'ky-products-tech.md',
    'ky-market-opportunity.md',
    'ky-business-model.md',
    'ky-go-to-market.md',
    'ky-team-governance.md',
    'ky-investment-requirements.md',
    'ky-risk-mitigation.md',
    'ky-impact-measurement.md',
    'ky-exit-pathways.md'
  ];

  for (const file of coreFiles) {
    const filePath = path.join(docsPath, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      businessPlanContent += `\n\n=== ${file} ===\n${content}`;
    }
  }
} catch (e) {
  console.error('Error loading business plan:', e);
}

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
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Request body is required' })
      };
    }

    const body = JSON.parse(event.body);

    // Support both formats
    let message, conversationHistory;
    if (body.messages && Array.isArray(body.messages)) {
      const userMessage = body.messages.find(m => m.role === 'user');
      message = userMessage ? userMessage.content : null;
      conversationHistory = [];
    } else {
      message = body.message;
      conversationHistory = body.conversationHistory || [];
    }

    if (!message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Message is required' })
      };
    }

    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

    if (!ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY not configured');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'API key not configured',
          fallback: 'I apologize, but I\'m having trouble accessing my AI capabilities right now.'
        })
      };
    }

    // Find relevant sections using keyword search
    const relevantContent = findRelevantSections(message, businessPlanContent);

    console.log(`Processing question: "${message.substring(0, 50)}..."`);

    const systemPrompt = `You are the Kyanos Plan AI Assistant—a friendly, knowledgeable guide who helps potential investors and partners understand the Kyanos business plan.

YOUR PERSONALITY:
- Warm and conversational, like talking to a colleague who's genuinely excited about this work
- Confident but not pushy—you believe in what Kyanos is building
- Direct and honest—if you don't know something, say so

CRITICAL RULE - SINGLE SOURCE OF TRUTH:
You must ONLY answer from the business plan context provided below. Do NOT:
- Make up facts, numbers, or details not in the context
- Use knowledge from training data about other companies or plans
- Guess at pricing, timelines, or metrics not explicitly stated

If the context doesn't contain the answer, say: "I don't see that specific information in the plan. You could ask Ed Forman directly at forman.ed@gmail.com."

CONVERSATION GUIDELINES:
1. Be conversational—this is a dialogue, not a FAQ
2. Answer ONLY from the business plan context below
3. Ask clarifying questions if the user's question is vague
4. After answering, invite follow-up naturally: "Does that help?" or "Want me to dig into any part of that?"
5. Use **bold** for product names (Panopticon, GoodInk, Adwatch, TripWire)

RESPONSE STYLE:
- Lead with the key point
- 2-4 sentences for simple questions
- Use bullets only for 3+ related items
- Sound like a person, not a brochure

===== BUSINESS PLAN CONTEXT (this is your ONLY source of truth) =====

${relevantContent}

===== END CONTEXT =====

Remember: You're having a conversation, but EVERY fact must come from the context above.`;

    // Build messages for Claude
    const claudeMessages = [
      ...(conversationHistory || []).slice(-6).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        system: systemPrompt,
        messages: claudeMessages
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API error:', response.status, errorText);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Claude API error',
          fallback: 'I apologize, but I\'m having trouble right now. Please try again.'
        })
      };
    }

    const data = await response.json();
    const aiResponse = data.content[0].text;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        response: aiResponse,
        conversationId: Date.now().toString(),
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Netlify Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        fallback: 'I apologize, but I\'m experiencing technical difficulties.',
        debug: error.message
      })
    };
  }
};

// Simple keyword-based search to find relevant sections
function findRelevantSections(query, fullContent) {
  // Extract keywords from query
  const stopWords = new Set(['what', 'is', 'the', 'a', 'an', 'how', 'does', 'do', 'can', 'will', 'would', 'should', 'about', 'for', 'to', 'of', 'and', 'or', 'in', 'on', 'at', 'by', 'with', 'from', 'that', 'this', 'which', 'who', 'whom', 'whose', 'why', 'when', 'where', 'are', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'was', 'were', 'you', 'your', 'me', 'my', 'i', 'we', 'our', 'they', 'their', 'it', 'its']);

  const keywords = query.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));

  // Split content into sections
  const sections = fullContent.split(/===\s*[\w\-\.]+\.md\s*===/);

  // Score each section
  const scored = sections.map((section, idx) => {
    const lowerSection = section.toLowerCase();
    let score = 0;

    for (const keyword of keywords) {
      // Count occurrences
      const regex = new RegExp(keyword, 'gi');
      const matches = lowerSection.match(regex);
      if (matches) {
        score += matches.length;
      }
    }

    return { section, score, idx };
  });

  // Sort by score and take top sections
  scored.sort((a, b) => b.score - a.score);

  // Take top 3 sections or all content if query is very general
  const topSections = scored.slice(0, 3).filter(s => s.score > 0);

  if (topSections.length === 0) {
    // Return executive summary and value proposition as fallback
    return fullContent.substring(0, 15000);
  }

  return topSections.map(s => s.section).join('\n\n---\n\n').substring(0, 20000);
}
