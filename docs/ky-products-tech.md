# Product Strategy & Technology

Kyanos is a family of AI-driven services built on shared infrastructure. Each product serves a distinct purpose in keeping progressive campaigns visible and informed.

---

## The Product Suite

| Product | Function | Included In |
|---------|----------|-------------|
| **Panopticon** | AI monitoring + remediation | All tiers |
| **GoodInk** | Positive press discovery | Congressional+ |
| **Adwatch** | Ad monitoring | Congressional+ |
| **TripWire** | Opponent site monitoring | Congressional+ |
| **Watchtowers** | Geographic variation detection | Statewide+ |

---

## Panopticon: Core AI Monitoring & Remediation

Panopticon is the flagship product. It works in three phases: **Monitor → Prioritize → Act**

<div class="callout-info">
<div class="callout-title">Why 'Panopticon'?</div>
<p>The name comes from Jeremy Bentham's 18th-century design for an observation structure where a central point can see everything without being seen. For Kyanos, Panopticon represents <strong>comprehensive visibility</strong>: seeing exactly how AI systems and search engines represent a campaign across every major platform and geography. Campaigns see everything; the platforms don't know they're being watched.</p>
</div>

### What It Does

- **Monitor:** Queries AI surfaces and search engines (Google Search, Google AI Overviews, ChatGPT, Meta AI) with questions voters actually ask
- **Prioritize:** Traces errors to root causes and ranks by impact (Voter Reach × Error Severity × Fixability)
- **Act:** Provides CMS-specific remediation instructions that campaigns can implement immediately

### Key Features

- Tests questions voters actually ask about the candidate
- Shows exactly what voters see when they search for the candidate
- Traces errors to fixable root causes (Wikipedia, Ballotpedia, news articles, campaign site)
- Delivers targeted instructions: approver gets the recommendation, implementer gets the steps
- Watchtowers detect geographic variation (Statewide/National tiers)

### Monitoring Frequency

- Monthly (standard)
- Weekly (premium)
- Daily (premium)

### Sample Report

For a complete example of Panopticon output, see **[Appendix: Sample Panopticon Report](ky-appendix-panopticon-sample-report.md)**. This real AI Presence Report for a 2026 congressional campaign demonstrates the full Monitor → Analyze → Fix workflow, including:

- Platform-by-platform scoring (Google AI Overview, ChatGPT, Knowledge Panel)
- Root cause analysis tracing AI errors to their sources
- Prioritized action items ranked by campaign control and impact
- CMS-specific implementation instructions (Squarespace)
- Third-party platform guidance (Wikipedia, Ballotpedia, Knowledge Panel claims)

---

## GoodInk: Positive Press Discovery

GoodInk finds and recommends journalistic articles that campaigns can feature on their websites to boost digital authority.

### What It Does

- Discovers positive coverage across news sources
- Analyzes sentiment, source credibility, and paywall status
- Recommends articles worth featuring
- Provides structured data markup for featured articles

### Key Features

- Source credibility scoring (Tier 1-4 classification)
- Sentiment analysis with confidence levels
- Paywall detection (free, metered, registration, hard paywall)
- Freshness scoring and age warnings
- Campaign isolation (each campaign's discoveries are private)

### Value

GoodInk detects opportunities that campaigns can exploit to gain coverage, which in turn improves AI visibility. Third-party articles provide social proof, SEO value, and credibility transfer.

---

## Adwatch: Political Ad Monitoring

Adwatch tracks political advertising across Google and Meta transparency libraries.

### What It Does

- Monitors ads mentioning the candidate
- Tracks opponent ad spend and messaging
- Classifies ad tone (attack, support, contrast, issue)
- Alerts on new ads, spend changes, and new advertisers

### Key Features

- Real-time monitoring of ad transparency libraries
- Tone classification using AI with confidence thresholds
- Spend tracking and trend analysis
- New advertiser detection
- Source links to original platform transparency pages

### Value

Know what opponents are saying in paid media before voters tell you. Detect messaging shifts and spending surges early.

---

## TripWire: Opponent Website Monitoring

TripWire watches opponent websites for changes and alerts campaigns when competitors shift their messaging.

### What It Does

- Monitors specified opponent sites on schedule
- Detects content changes (new pages, modified content, removed content)
- Classifies significance of changes
- Alerts campaign when opponents shift messaging

### Key Features

- Scheduled monitoring (hourly, daily, weekly)
- Content diff detection with change summaries
- AI classification of change significance (high, medium, low)
- Category classification (messaging, issues, attack, structural, minor)
- Archive of historical snapshots for comparison

### Value

Early warning when opponents change strategy. Track when they update issues pages, launch new sections, or add attack content.

---

## Watchtowers: Geographic Monitoring

Watchtowers are Kyanos's distributed observation network. Sensor stations in multiple geographic locations detect if AI platforms and search engines serve different information to different regions. They're included at the Statewide and National tiers.

### For Campaigns (Statewide/National)

- See how the campaign appears in different parts of the state/country
- Detect if swing regions see different AI responses
- Identify geographic targeting opportunities

### For Watchdog/Research

- Document geographic manipulation by platforms
- Build evidence base for accountability
- Support Research Institute publications

---

## Surface Coverage

### Core Surfaces (Recommended)

| Surface | Priority | Notes |
|---------|----------|-------|
| Google (Search + AI Overviews) | Highest | Traditional search and AI Overviews |
| ChatGPT | High | Influential early adopters |
| Meta AI | High | Critical for Hispanic voters |

### Additional Surfaces (Available)

- Perplexity
- Microsoft Copilot
- Google Gemini
- Anthropic Claude
- X/Grok
- Voice assistants

**Strategic implication:** We can monitor any surface. Optimizing for the core platforms improves results across all others.

---

## Shared Infrastructure: Bentham

All Kyanos products are powered by **Bentham**, our multi-tenant extraction infrastructure.

### What Bentham Does

- Runs AI extraction studies at scale
- Manages geographic variation through regional proxy infrastructure
- Provides consistent, reliable data collection across platforms
- Supports multiple tenants (Kyanos products + commercial services)

### Why This Matters

- **Scale:** Run thousands of queries across multiple surfaces efficiently
- **Reliability:** Consistent methodology for comparable results
- **Cost efficiency:** Shared infrastructure reduces per-study costs
- **Proven:** Bentham is currently serving a commercial client of Ed Forman, demonstrating real-world viability

### Commercial Potential

Bentham is highly adaptable and marketable. The same infrastructure that powers Kyanos products can serve commercial AI monitoring clients across industries. However, aggressively pursuing commercial revenue before the 2028 cycle is complete could distract from the core political mission. Commercial services will remain a secondary revenue stream until Kyanos has established itself as essential progressive infrastructure.

---

## Technology Stack

| Component | Technology |
|-----------|------------|
| Extraction Infrastructure | Bentham (Node.js/TypeScript) |
| Database | PostgreSQL |
| API Framework | Fastify |
| AI Classification | Claude API |
| Web Scraping | Playwright |
| Deployment | Cloud infrastructure with regional nodes |

---

## Security & Compliance

### Data Protection

- Campaign data siloed with strict access controls
- Client data encrypted at rest and in transit
- No sharing between campaigns
- Campaign isolation enforced at database level

### Privacy

- Store only what's needed for analysis
- No indefinite archiving of competitor content
- Clear data retention policies

### Auditability

- All queries and responses logged
- Audit trails for compliance and verification
- Source links required for all recommendations

---

## Future Roadmap

### Agentic AI Integration

We are monitoring the adoption of agentic AI technologies that could enable direct updating of client CMS systems. For the foreseeable future, Kyanos will use copy-and-paste instructions and CSV exports for implementation. This is a deliberate choice: the agentic AI landscape is immature and the risks of automated site modifications outweigh the benefits. We will revisit this as the technology matures.

### Expanded Services

Beyond the current product suite, we see opportunities to help progressive campaigns and organizations stay ahead in online presence management. Future services may include proactive content recommendations, competitive positioning analysis, and deeper integration with campaign tech stacks.

---

<div class="callout-bottomline">
<p><strong>One platform. Four products. Complete visibility into how AI and search engines see progressive campaigns.</strong></p>
</div>
