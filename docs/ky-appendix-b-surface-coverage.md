# Appendix 2 — AI Surface Market Share

## Estimated Share of Election Information Discovery

| Surface | 2026 Estimate | 2028 Estimate | Notes |
|---------|---------------|---------------|-------|
| **Google Search (traditional)** | 45-50% | 35-40% | Still dominant, declining[^1] |
| **Google AI Overviews** | 15-18% | 20-25% | Cannibalizing traditional search[^2] |
| **ChatGPT** | 8-10% | 14-18% | Fastest growth trajectory[^3] |
| **Meta AI** | 5-7% | 10-12% | Critical for Hispanic voters[^4] |
| **Perplexity** | 2-3% | 5-7% | Search replacement use case[^5] |
| **Microsoft Copilot** | 3-4% | 4-6% | Enterprise crossover |
| **X/Grok** | 1-2% | 3-5% | Political audience skew |
| **Other (Gemini, Claude, etc.)** | 3-5% | 6-8% | Fragmented but growing |

**Key trend:** Traditional search declining from ~50% to ~35% as AI surfaces grow from ~25% to ~40%+ of election queries[^6]

---

## Kyanos Surface Coverage

### Browser-Based Surfaces (User-Facing)

| Surface | Kyanos Support | Access Method |
|---------|----------------|---------------|
| Google AI Overviews | **Core** | Browser automation |
| ChatGPT | **Core** | Browser automation |
| Meta AI | **Core** | Browser automation |
| Perplexity | Available | Browser automation |
| Microsoft Copilot | Available | Browser automation |
| Google Gemini | Available | Browser automation |
| X/Grok | Available | Browser automation |

### API-Based Surfaces (Programmatic)

| Surface | Kyanos Support | Access Method |
|---------|----------------|---------------|
| OpenAI API | Available | Direct API |
| Anthropic Claude API | Available | Direct API |
| Google Gemini API | Available | Direct API |
| Perplexity API | Available | Direct API |
| Meta Llama (via providers) | Available | Direct API |

### Future Surfaces (Roadmap)

- **WhatsApp AI** — Expected 2027; critical for Hispanic and international voters
- **Apple Intelligence** — Monitoring development; significant iOS user base

---

## Methodology Notes

Kyanos monitors both browser-based (what voters see) and API-based (what developers build on) surfaces. Browser automation captures the actual user experience including personalization and geographic variation. API access enables systematic testing at scale.

**Core surfaces** receive daily monitoring. **Available surfaces** can be added based on campaign needs and race level.

---

## Sources and Assumptions

[^1]: Google Search remains the default entry point for most voters, but share is declining as AI alternatives grow. Based on [StatCounter GlobalStats](https://gs.statcounter.com/search-engine-market-share) and [Pew Research internet usage surveys](https://www.pewresearch.org/internet/).

[^2]: Google AI Overviews appeared on 50%+ of informational queries by Q4 2025. Election-specific share estimated based on [Search Engine Land analysis](https://searchengineland.com/google-ai-overviews-study-413320). Growth assumes continued default integration into search results.

[^3]: ChatGPT monthly active users exceeded 300M by late 2025. Election query share estimated from [Reuters/Oxford Digital News Report](https://reutersinstitute.politics.ox.ac.uk/digital-news-report/2025) and Pew Research polling on AI usage for news.

[^4]: Meta AI integrated across Facebook, Instagram, WhatsApp (3B+ users). Hispanic voter over-indexing based on [Pew Hispanic Center social media usage data](https://www.pewresearch.org/hispanic/).

[^5]: Perplexity reported 15M+ monthly queries by 2025. Growth rate extrapolated from [company announcements](https://www.perplexity.ai/hub/blog) and positioning as "answer engine" replacing traditional search.

[^6]: Baseline from [Pew Research Center survey](https://www.pewresearch.org/internet/2024/03/26/americans-use-of-chatgpt-is-ticking-up-but-few-trust-its-election-information/) showing 15% of voters used AI for election information in 2024. Growth projection based on adoption curves and AI integration into default search experiences.
