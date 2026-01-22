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

## Market Share Visualization

<div style="display: flex; justify-content: space-around; flex-wrap: wrap; margin: 2rem 0;">

<div style="text-align: center;">
<svg viewBox="0 0 200 200" width="180" height="180">
  <!-- 2026 Pie Chart -->
  <!-- Google Search: 47.5% = 171° -->
  <circle r="80" cx="100" cy="100" fill="transparent" stroke="#4285f4" stroke-width="80" stroke-dasharray="239 264" transform="rotate(-90 100 100)"/>
  <!-- Google AI Overviews: 16.5% = 59.4° -->
  <circle r="80" cx="100" cy="100" fill="transparent" stroke="#34a853" stroke-width="80" stroke-dasharray="83 420" transform="rotate(81 100 100)"/>
  <!-- ChatGPT: 9% = 32.4° -->
  <circle r="80" cx="100" cy="100" fill="transparent" stroke="#10a37f" stroke-width="80" stroke-dasharray="45 458" transform="rotate(140.4 100 100)"/>
  <!-- Other: 27% = 97.2° -->
  <circle r="80" cx="100" cy="100" fill="transparent" stroke="#9ca3af" stroke-width="80" stroke-dasharray="122 381" transform="rotate(172.8 100 100)"/>
  <circle r="40" cx="100" cy="100" fill="white"/>
  <text x="100" y="105" text-anchor="middle" font-size="14" font-weight="bold">2026</text>
</svg>
<div style="font-weight: bold; margin-top: 0.5rem;">2026 Projection</div>
</div>

<div style="text-align: center;">
<svg viewBox="0 0 200 200" width="180" height="180">
  <!-- 2028 Pie Chart -->
  <!-- Google Search: 37.5% = 135° -->
  <circle r="80" cx="100" cy="100" fill="transparent" stroke="#4285f4" stroke-width="80" stroke-dasharray="188 315" transform="rotate(-90 100 100)"/>
  <!-- Google AI Overviews: 22.5% = 81° -->
  <circle r="80" cx="100" cy="100" fill="transparent" stroke="#34a853" stroke-width="80" stroke-dasharray="113 390" transform="rotate(45 100 100)"/>
  <!-- ChatGPT: 16% = 57.6° -->
  <circle r="80" cx="100" cy="100" fill="transparent" stroke="#10a37f" stroke-width="80" stroke-dasharray="80 423" transform="rotate(126 100 100)"/>
  <!-- Other: 24% = 86.4° -->
  <circle r="80" cx="100" cy="100" fill="transparent" stroke="#9ca3af" stroke-width="80" stroke-dasharray="108 395" transform="rotate(183.6 100 100)"/>
  <circle r="40" cx="100" cy="100" fill="white"/>
  <text x="100" y="105" text-anchor="middle" font-size="14" font-weight="bold">2028</text>
</svg>
<div style="font-weight: bold; margin-top: 0.5rem;">2028 Projection</div>
</div>

</div>

<div style="display: flex; justify-content: center; gap: 1.5rem; flex-wrap: wrap; margin-bottom: 2rem;">
<span><span style="display: inline-block; width: 12px; height: 12px; background: #4285f4; margin-right: 4px;"></span> Google Search</span>
<span><span style="display: inline-block; width: 12px; height: 12px; background: #34a853; margin-right: 4px;"></span> Google AI Overviews</span>
<span><span style="display: inline-block; width: 12px; height: 12px; background: #10a37f; margin-right: 4px;"></span> ChatGPT</span>
<span><span style="display: inline-block; width: 12px; height: 12px; background: #9ca3af; margin-right: 4px;"></span> Other AI</span>
</div>

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
