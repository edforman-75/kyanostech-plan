const embeddings = require('./business-plan-embeddings.json');

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

    // Support both v2.0.0 format (messages array) and v2.5.0 format (message + conversationHistory)
    let message, conversationHistory;

    if (body.messages && Array.isArray(body.messages)) {
      // v2.0.0 format: { model, messages: [{ role, content }], max_tokens, temperature }
      const userMessage = body.messages.find(m => m.role === 'user');
      message = userMessage ? userMessage.content : null;
      conversationHistory = [];
    } else {
      // v2.5.0 format: { message, conversationHistory }
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

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    
    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY not configured');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'API key not configured',
          fallback: 'I apologize, but I\'m having trouble accessing my AI capabilities right now.'
        })
      };
    }

    const questionEmbedding = await getEmbedding(message, OPENAI_API_KEY);
    const relevantChunks = findRelevantChunks(questionEmbedding, embeddings, 10);
    
    const context = relevantChunks
      .map(chunk => `[From ${chunk.title}]\n${chunk.content}`)
      .join('\n\n---\n\n');
    
    console.log(`Found ${relevantChunks.length} relevant chunks for question: "${message.substring(0, 50)}..."`);

    const systemPrompt = `You are the Kyanos Plan AI Assistant. You help users understand the Kyanos business plan through engaging conversation.

IMPORTANT - WHAT KYANOS DOES:
Kyanos is a family of AI-driven analytical and remediation services for progressive campaigns:

- **Panopticon** — Core AI monitoring and remediation (monitors how AI systems represent candidates)
- **GoodInk** — Positive press discovery for campaigns to feature
- **Adwatch** — Political advertising monitoring across Google and Meta
- **TripWire** — Opponent website change detection

This chatbot (me) is a demo tool ON the business plan site - it is NOT what Kyanos sells to customers.

IMPORTANT - THE METHODOLOGY:
Kyanos uses a causality chain methodology: Observe → Trace → Diagnose → Prescribe
- We trace AI errors to their fixable root causes
- We provide CMS-specific remediation instructions
- We focus on what campaigns can actually change

KEY FACTS:
- Structure: Trust-Owned LLC (like Catalist)
- Funding Ask: $1M target ($750K min)
- 2026: Free year serving 200 campaigns
- 2028: $3.3M revenue, 466 clients
- Progressive-only service

CRITICAL INSTRUCTIONS:
1. Answer ONLY from the business plan context below - NO external knowledge
2. If the context doesn't have the answer, say "I don't have that information in the business plan"
3. Use the specific pricing, products, and methodology from the context
4. Understand that Panopticon monitors Google AI Overviews, ChatGPT, Meta AI

RESPONSE STYLE - KEEP IT SHORT & ENGAGING:
- **Maximum 3-4 sentences** for most answers
- Lead with the most important fact
- Use 2-3 bullet points MAX for lists
- **ONLY suggest follow-up questions if the answer IS in the context provided**

CONTENT PRIORITIES:
1. Direct answer to their question (1-2 sentences)
2. Key supporting points (2-3 bullets if needed)
3. Invitation for follow-up (ONLY if you can answer it from context!)

FORMATTING:
- Use **bold** for product names (Panopticon, GoodInk, Adwatch, TripWire)
- Short paragraphs
- Bullet points for 3+ items only
- Conversational tone

BUSINESS PLAN CONTEXT:
${context}

CRITICAL: Only suggest follow-up questions that you can answer from the context above.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(conversationHistory || []).slice(-6).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: messages,
        max_tokens: 400,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'OpenAI API error',
          fallback: 'I apologize, but I\'m having trouble right now. Please try again.'
        })
      };
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        response: aiResponse,
        conversationId: Date.now().toString(),
        timestamp: new Date().toISOString(),
        sourcesUsed: relevantChunks.length
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

async function getEmbedding(text, apiKey) {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      input: text,
      model: 'text-embedding-ada-002'
    })
  });

  if (!response.ok) {
    throw new Error(`Embedding API error: ${response.status}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

function cosineSimilarity(a, b) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

function findRelevantChunks(questionEmbedding, allChunks, topK = 10) {
  // Define white paper files
  const whitePaperFiles = [
    'ky-appendix-compass.md',
    'ky-appendix-grok-bias.md', 
    'ky-appendix-compass-legacy.md',
    'ky-white-paper-ai-information-war.md'
  ];
  
  const scored = allChunks.map(chunk => {
    const similarity = cosineSimilarity(questionEmbedding, chunk.embedding);
    
    // Boost core business plan content by 15% for better prioritization
    const isWhitePaper = whitePaperFiles.includes(chunk.file);
    const boostedSimilarity = isWhitePaper ? similarity : similarity * 1.15;
    
    return {
      ...chunk,
      similarity: boostedSimilarity,
      originalSimilarity: similarity,
      isWhitePaper: isWhitePaper
    };
  });
  
  scored.sort((a, b) => b.similarity - a.similarity);
  
  return scored.slice(0, topK);
}
