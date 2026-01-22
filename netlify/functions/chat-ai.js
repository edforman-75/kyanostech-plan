// Kyanos Plan AI Assistant - Powered by Gemini
// With embedded business plan content for serverless environment

const KYANOS_CONTENT = `
# KYANOS STRATEGIC PLAN - KEY FACTS

## Mission
Keep progressives visible in the AI era. Making sure voters find the truth about progressive candidates.

## What is Kyanos?
Kyanos is an internet presence optimization platform that ensures progressive candidates, organizations, and causes are accurately and favorably represented across three surfaces:
1. AI chatbots (ChatGPT, Claude, Perplexity, Grok, Meta AI)
2. AI-integrated search (Google AI Overviews, Bing Copilot)
3. Traditional search results

We monitor, diagnose, and provide specific, actionable fixes that campaigns can implement immediately.

## The Six Product Capabilities

1. **Panopticon** - Core monitoring and remediation across AI chatbots, AI-integrated search, and traditional search. This is the flagship product.

2. **GoodInk** - Positive press discovery for campaigns to feature. Finds favorable coverage campaigns can amplify.

3. **AdWatch** - Political advertising monitoring across Google and Meta. Tracks opponent ad spend and messaging.

4. **TripWire** - Opponent website change detection. Alerts when competitors update their sites.

5. **PostWatch** - Social media monitoring across YouTube, Bluesky, and X. Tracks mentions and sentiment.

6. **WatchTower** - Multi-location monitoring to detect regional variation in AI and search responses. Critical for detecting geographic manipulation.

## Target Market
- Progressive political campaigns (local, congressional, statewide, national)
- Progressive incumbents and officeholders
- Advocacy organizations
- Labor unions
- Party committees
- NOT commercial clients primarily - mission-driven focus

## Methodology: Observe, Trace, Diagnose, Prescribe
1. **Observe**: What do AI surfaces, search engines, and opponents say?
2. **Trace**: Where did they get that information?
3. **Diagnose**: What's the fixable root cause?
4. **Prescribe**: Specific instructions tailored to the campaign's CMS and tech stack

## Pricing (Cycle-Based)

| Tier | Primary (8 mo) | General (3 mo) | Full Cycle |
|------|----------------|----------------|------------|
| Local | $1,350 | $1,350 | $2,430 |
| Congressional | $6,000 | $6,000 | $10,800 |
| Statewide | $22,500 | $22,500 | $40,500 |
| National | $75,000 | $200,000 | $235,000 |

Full Cycle pricing reflects a 20% discount on General Election for campaigns continuing from Primary.

## Financial Projections

| Year | Revenue | Campaigns | Milestone |
|------|---------|-----------|-----------|
| 2026 | $0 | 200 (free) | Build credibility |
| 2027 | ~$1.2M | ~150 paid | Pricing activates |
| 2028 | ~$3.9M | 750-800 paid | Cash-flow positive Q1 2028 |

## Funding Ask
- **Total**: $1,500,000
- **Grant 1**: $1,000,000 (2026)
- **Grant 2**: $500,000 (Q1 2027)
- **Structure**: Grant funding, not equity investment

## Key Dates
- March 15, 2026: Funding committed
- April 15, 2026: Funds in bank, payroll starts
- June 2026: Team operational, founding cohort of 200 campaigns begins
- Q1 2028: Cash-flow positive

## Team (Lean, AI-Leveraged)
8 people doing what 40 would—because the AI does the work.

| Year | FTEs | Key Additions |
|------|------|---------------|
| 2026 | 5 | CEO, Technical Lead, Research Director, Operations, Marketing |
| 2027 | 6 | + Inside Sales |
| 2028 | 9 | + Account Management, Engineering |

## Legal Structure
Trust-owned LLC following the Catalist model:
- Trust entity owns 100% of operating company
- Board of progressive leaders governs the trust
- Mission-locked: cannot be sold to hostile interests
- Ensures long-term progressive alignment

## The Catalist Precedent
Catalist (founded 2006) provides the structural model. They built progressive data infrastructure as a trust-owned LLC, now serving 500+ organizations. Kyanos follows this proven approach.

## Why Now?
1. AI adoption is accelerating - voters increasingly get political info from AI
2. 2026 cycle timing - solutions implemented now impact this cycle and 2028
3. No incumbent - progressive ecosystem has no AI monitoring infrastructure
4. Platform capture risk - AI platforms face pressure from hostile administration

## The ROI Case
- AI chatbots are 4x more persuasive than TV advertising (Nature/Science research, Dec 2025)
- Cost per voter influenced: $1-10 (vs $50-600 for traditional media)
- Internet Presence Optimization delivers 10-100x ROI of traditional campaign advertising

## The Watchdog Role
Kyanos monitors how major AI systems respond to questions about progressive candidates:
- Early warning system for platform bias
- Geographic detection via WatchTower
- Evidence base for PR campaigns and litigation
- Kyanos Research Institute publishes independent research

## Founder
Ed Forman - 35 years in Silicon Valley startups, Stanford MBA, taught entrepreneurship at Stanford. Based in Sun Valley, ID.

## Contact
Ed Forman: forman.ed@gmail.com
`;

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

    console.log(`Processing question: "${message.substring(0, 50)}..."`);

    const systemPrompt = `You are the Kyanos Strategic Plan AI Assistant. You help visitors understand the Kyanos strategic plan for keeping progressives visible in the AI era.

CRITICAL RULES:
1. ONLY answer based on the strategic plan content provided below. Be CONFIDENT and SPECIFIC.
2. Kyanos is specifically for PROGRESSIVE political campaigns, advocacy organizations, and causes. NOT for general commercial use.
3. There are exactly SIX capabilities: Panopticon, GoodInk, AdWatch, TripWire, PostWatch, and WatchTower.
4. The funding ask is $1.5M total ($1M in 2026, $500K in 2027) as GRANT funding.
5. 2028 projection: ~$3.9M revenue with 750-800 clients.
6. Structure is a Trust-owned LLC following the Catalist model.
7. If you don't know something specific, say "That detail isn't in the strategic plan materials. Contact Ed Forman at forman.ed@gmail.com."
8. NEVER mention products called AGON, POLIS, SCOPE, or COMPASS - those don't exist.

RESPONSE STYLE:
- Be warm, confident, and conversational
- Give specific numbers and facts from the plan
- Keep responses concise (2-4 sentences)
- Use **bold** for product names and key terms
- End with "**Want to explore further?**" and 2-3 relevant follow-up questions

===== KYANOS STRATEGIC PLAN CONTENT =====

${KYANOS_CONTENT}

===== END CONTENT =====`;

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
