// Kyanos Plan AI Assistant - Powered by Gemini
// Conversational chatbot with suggested follow-up questions

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
    'ky-risk-mitigation.md'
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

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not configured');
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

    const systemPrompt = `You are the Kyanos Plan AI Assistant, a warm, enthusiastic guide who loves helping people understand this exciting venture. You're like a knowledgeable colleague grabbing coffee with a potential investor.

PERSONALITY:
- Genuinely excited about Kyanos and its mission
- Conversational and warm, use contractions, be natural
- Confident but humble, acknowledge what you don't know
- Curious, ask follow-up questions when helpful

YOUR JOB:
Help visitors understand the Kyanos business plan. Answer their questions, then naturally guide them to explore more.

CRITICAL RULES - YOU MUST FOLLOW THESE:
1. ONLY answer from the business plan context provided below. NEVER make up information.
2. If something isn't explicitly stated in the context, say "I don't see that covered in the business plan materials. Ed Forman would be happy to discuss. Reach him at forman.ed@gmail.com."
3. The products are: Panopticon (core AI monitoring), GoodInk (press discovery), Adwatch (ad monitoring), TripWire (opponent site monitoring), and Watchtowers (geographic monitoring built into Panopticon).
4. DO NOT reference any products named AGON, POLIS, SCOPE, or COMPASS. Those are old product names that no longer exist.
5. If you're unsure about a specific number, date, or detail, say so rather than guess.
6. It's better to say "I'm not sure" than to make something up.

RESPONSE FORMAT:
1. Answer their question conversationally (2-4 sentences)
2. Add a key insight or interesting detail if relevant
3. End with "**Want to explore further?**" followed by 2-3 clickable suggested questions

SUGGESTED QUESTIONS FORMAT:
Always end your response with exactly this format:

**Want to explore further?**
- [Your first suggested question here?]
- [Your second suggested question here?]
- [Your third suggested question here?]

Make the suggestions relevant to what they just asked about, and make them questions a curious investor would naturally want to know next.

EXAMPLE SUGGESTIONS (adapt to context):
- "What's the competitive landscape look like?"
- "How does the pricing model work?"
- "What's the team's background?"
- "How do you measure success?"
- "What's the 2028 revenue projection?"

STYLE:
- Use **bold** for product names (Panopticon, GoodInk, Adwatch, TripWire, Watchtowers) and key terms
- Keep paragraphs short
- Sound like a person, not a document
- Never use em dashes (—). Use commas, periods, colons, or parentheses instead

===== BUSINESS PLAN CONTEXT =====

${relevantContent}

===== END CONTEXT =====`;

    // Build conversation for Gemini
    const contents = [];

    // Add conversation history
    for (const msg of (conversationHistory || []).slice(-6)) {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      });
    }

    // Add current message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: contents,
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 600
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Gemini API error',
          status: response.status,
          details: errorText.substring(0, 500),
          fallback: 'I apologize, but I\'m having trouble right now. Please try again.'
        })
      };
    }

    const data = await response.json();

    let aiResponse = '';
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      aiResponse = data.candidates[0].content.parts[0].text;
    } else {
      aiResponse = 'I apologize, but I received an unexpected response. Please try again.';
    }

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
  const stopWords = new Set(['what', 'is', 'the', 'a', 'an', 'how', 'does', 'do', 'can', 'will', 'would', 'should', 'about', 'for', 'to', 'of', 'and', 'or', 'in', 'on', 'at', 'by', 'with', 'from', 'that', 'this', 'which', 'who', 'whom', 'whose', 'why', 'when', 'where', 'are', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'was', 'were', 'you', 'your', 'me', 'my', 'i', 'we', 'our', 'they', 'their', 'it', 'its', 'tell', 'more']);

  const keywords = query.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));

  const sections = fullContent.split(/===\s*[\w\-\.]+\.md\s*===/);

  const scored = sections.map((section, idx) => {
    const lowerSection = section.toLowerCase();
    let score = 0;

    for (const keyword of keywords) {
      const regex = new RegExp(keyword, 'gi');
      const matches = lowerSection.match(regex);
      if (matches) {
        score += matches.length;
      }
    }

    return { section, score, idx };
  });

  scored.sort((a, b) => b.score - a.score);

  const topSections = scored.slice(0, 4).filter(s => s.score > 0);

  if (topSections.length === 0) {
    return fullContent.substring(0, 18000);
  }

  return topSections.map(s => s.section).join('\n\n---\n\n').substring(0, 22000);
}
