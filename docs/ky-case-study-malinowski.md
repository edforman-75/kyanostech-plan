# Case Study: Tom Malinowski for NJ-11

**Digital Authority Report | January 2026**

*NJ-11 Special Election • February 11, 2026*

---

<div class="callout-info">
<div class="callout-title">About This Report</div>
<p>This case study demonstrates Kyanos Panopticon in action during a live special election cycle. All data is real, drawn from our monitoring of AI platforms in January 2026 — 32 days before Election Day.</p>
</div>

## Executive Summary

**Campaign:** Tom Malinowski for Congress (NJ-11 Special Election)

**Overall Digital Authority Score:** 68/100 — *Needs Improvement Before Election Day*

**Critical Finding:** ChatGPT is failing to correctly identify Malinowski on 80% of queries. With 40M+ daily users, this represents the campaign's top priority.

**Key Insight:** Outdated Wikipedia content is the root cause of AI inaccuracies across multiple platforms. A single Wikipedia update could improve AI accuracy by 30-40 points.

---

## Phase 1: Monitor (SCOPE)

### AI Platform Performance

We queried each AI platform with 25 questions voters commonly ask: "Who is Tom Malinowski?", "What party is Tom Malinowski?", "Is Tom Malinowski running for office?", "What are Tom Malinowski's positions?", and more.

| Platform | Accuracy Score | Status |
|----------|----------------|--------|
| Google AI Overview | 100% | Excellent |
| Google Search | 95% | Excellent |
| Claude | 100% | Excellent |
| Gemini | 100% | Excellent |
| Grok | 100% | Excellent |
| Perplexity | 96% | Good |
| Microsoft Copilot | 96% | Good |
| Meta AI | 96% | Good |
| **ChatGPT** | **20%** | **Critical Problem** |

### Sample AI Responses

<div class="sample-responses">

**Perplexity (Accurate):**

> "Tom Malinowski is an American politician and diplomat running in the 2026 special election for New Jersey's 11th Congressional District. He is a Democrat who previously served as U.S. Representative for NJ-7 from 2019 to 2023. He secured the endorsement of the Morris County Democratic Committee..."

**ChatGPT (Outdated):**

> "Tom Malinowski is a former U.S. Representative who served New Jersey's 7th congressional district from 2019 to 2023. He lost his reelection bid in 2022 to Republican Tom Kean Jr. Before Congress, he worked at Human Rights Watch and served as Assistant Secretary of State..."

*Note: ChatGPT makes no mention of the 2026 campaign.*

</div>

### Google Search Analysis

| Metric | Result |
|--------|--------|
| Knowledge Panel | Present but outdated |
| Featured Snippet | Wikipedia content |
| "Tom Malinowski" | #1 result: Wikipedia |
| "NJ-11 candidates" | #2 result (after news) |

**Top Sources Cited by AI:**

1. en.wikipedia.org — 17× (Needs update)
2. ballotpedia.org — 7×
3. congress.gov — 7×
4. nj.com — 5×
5. newjerseyglobe.com — 3×

---

## Phase 2: Prioritize (ORTHOS)

### Root Cause Analysis

We traced each AI error back to its source. The causality chain revealed:

**Primary Cause:** Wikipedia article describes Malinowski as a "former" congressman with no mention of the 2026 NJ-11 special election. AI systems — especially ChatGPT — pull heavily from Wikipedia for political figures.

**Secondary Causes:**

- Google Knowledge Panel shows outdated information
- Campaign website lacks structured data (JSON-LD schema)
- Missing immigration position content despite AILA endorsement
- Endorsements (Andy Kim, Jamie Raskin) not consistently surfaced

### Prioritized Recommendations

Ranked by: **(Voter Reach × Error Severity × Fixability)**

| Priority | Issue | Type | Confidence |
|----------|-------|------|------------|
| **Critical** | Stock trading disclosure narrative | Counter Narrative | 92% |
| **High** | Missing immigration position | Add Content | 88% |
| **High** | Endorsement visibility | SEO Enhancement | 85% |
| **Medium** | Anti-machine positioning | Amplify Positive | 78% |
| **Medium** | Tariff/economic messaging | Trending Topic | 82% |

---

## Phase 3: Act (PRAXIS)

### Action Card #1: Wikipedia Update
**Priority: High | Timeline: 3-7 days for response, 2-4 weeks for AI propagation**

<div class="action-card">

**Problem:** Wikipedia article says Malinowski is a "former" congressman with no mention of the 2026 NJ-11 special election. This is why ChatGPT fails 80% of the time.

**Important:** Wikipedia's conflict of interest policy prohibits candidates and staff from directly editing their own pages. Use approved methods:

**Option A: Request Edit via Talk Page (Recommended)**

URL: `https://en.wikipedia.org/wiki/Talk:Tom_Malinowski`

Post a polite request on the Talk page asking volunteer editors to update the article. Be transparent about campaign affiliation. Provide reliable sources.

**Sample Talk Page Post:**

> Hello, I'm writing on behalf of the Malinowski campaign (declaring COI per Wikipedia policy). The article doesn't reflect that Tom Malinowski is currently a candidate in the 2026 NJ-11 special election. Here are reliable sources that could be used to update the article:
>
> - [NJ.com article about candidacy announcement]
> - [Press release about Morris County Democratic Committee endorsement]
> - [NJ Globe coverage of the special election]
>
> Would an uninvolved editor be willing to add this information? Thank you.

**What the Article Needs:**

- **Introduction:** Add that he is "currently a candidate in the 2026 special election for New Jersey's 11th congressional district."
- **New section "2026 congressional campaign":**
  - Announcement of candidacy for NJ-11 special election
  - Endorsement from U.S. Senator Andy Kim (D-NJ)
  - Morris County Democratic Committee endorsement
  - J Street PAC endorsement
  - Special election date: February 11, 2026
  - Campaign themes

**Expected Impact:** Wikipedia updates propagate to AI systems within 2-4 weeks. Could improve ChatGPT accuracy from 20% to 80%+.

</div>

### Action Card #2: Google Knowledge Panel
**Priority: High | Timeline: 1-3 weeks**

<div class="action-card">

**Problem:** Knowledge Panel shows "Former U.S. Representative" without mentioning current candidacy.

**Step 1:** Claim your Knowledge Panel

URL: `https://support.google.com/knowledgepanel/answer/7534842`

Search for "Tom Malinowski" on Google, click the Knowledge Panel, then "Claim this knowledge panel."

**Step 2:** Submit a suggested edit

**Current Description:**
> "Tom Malinowski is an American politician and diplomat who served as U.S. Representative for New Jersey's 7th congressional district from 2019 to 2023."

**Suggested Change:**
> "Tom Malinowski is an American politician and diplomat. He served as U.S. Representative for New Jersey's 7th congressional district from 2019 to 2023 and is currently the Democratic candidate in the 2026 special election for New Jersey's 11th congressional district."

**Expected Impact:** Knowledge Panel updates improve Google AI Overview accuracy and establish authoritative source for other AI systems.

</div>

### Action Card #3: Ballotpedia Verification
**Priority: Medium | Timeline: 3-5 business days**

<div class="action-card">

**Problem:** Ballotpedia is the #3 most-cited source in AI responses about political candidates.

**Step 1:** Review current page at `https://ballotpedia.org/Tom_Malinowski`

**Step 2:** Submit updates via Candidate Connection

URL: `https://ballotpedia.org/Ballotpedia:Candidate_Connection`

**Key Information to Verify:**

- Current candidacy: NJ-11 Special Election, February 11, 2026
- Party: Democratic
- Endorsements:
  - U.S. Senator Andy Kim (D-NJ)
  - Morris County Democratic Committee
  - J Street PAC
  - Rep. Jamie Raskin
- Campaign website: malinowskifornj.com
- Campaign priorities: Lower Costs, Protect Democracy, Fight Corruption, Regulate Technology

**Expected Impact:** Ballotpedia updates within 3-5 business days. They prioritize candidate-provided information for active elections.

</div>

### Action Card #4: Website Structured Data
**Priority: Medium | Timeline: Immediate upon implementation**

<div class="action-card">

**Problem:** Campaign website lacks JSON-LD structured data, making it harder for AI systems to extract authoritative information.

**For Web Developer: Add to website's `<head>` section:**

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Tom Malinowski",
  "jobTitle": "Democratic Candidate for U.S. House, NJ-11",
  "description": "Tom Malinowski is the Democratic candidate in the 2026 special election for New Jersey's 11th Congressional District. Former U.S. Representative (NJ-7, 2019-2023) and former Assistant Secretary of State for Democracy, Human Rights, and Labor under President Obama.",
  "birthDate": "1965-09-23",
  "birthPlace": "Poland",
  "nationality": "American",
  "affiliation": {
    "@type": "Organization",
    "name": "Democratic Party"
  },
  "knowsAbout": ["Foreign Policy", "Human Rights", "Democracy", "Anti-Corruption", "Technology Regulation"],
  "sameAs": [
    "https://en.wikipedia.org/wiki/Tom_Malinowski",
    "https://ballotpedia.org/Tom_Malinowski"
  ]
}
```

**Expected Impact:** Search engines pick up structured data within 1-2 weeks. Helps AI systems understand who the candidate is directly from the authoritative source.

</div>

### Action Card #5: Address Stock Trading Narrative
**Priority: Critical | Ongoing**

<div class="action-card">

**Problem:** AI prominently surfaces ethics complaints and "pandemic profiteering" accusations when voters ask about criticism. The blind trust resolution is mentioned but buried.

**Current AI Response (Perplexity):**
> "Failed to disclose over 100 stock trades worth $1.3-$5 million... Critics accused him of 'pandemic profiteering'... These issues fueled attacks during his close 2020 race."

**Recommended Action:**

Publish a clear FAQ page addressing:

1. Blind trust established July 2021
2. No fines or penalties issued
3. Support for congressional stock trading reforms

**Suggested Website Statement:**

> **On Financial Disclosure:** In 2022, the House Ethics Committee reviewed stock trades made by my financial advisor and found no evidence of wrongdoing. I support the STOCK Act and have advocated for stronger congressional trading restrictions.

**Expected Impact:** Having the campaign's own statement on the record allows AI to present both sides rather than only the accusation.

</div>

---

## Projected Impact

If all action items are implemented:

| Metric | Current | Projected (4 weeks) |
|--------|---------|---------------------|
| Digital Authority Score | 68 | 85-90 |
| ChatGPT Accuracy | 20% | 80-90% |
| Google AI Overview | 100% | 100% |
| Overall AI Accuracy | 83% | 95%+ |

---

## Monitoring Schedule

| Date | Activity |
|------|----------|
| January 17, 2026 | Re-test all platforms, measure impact |
| January 24, 2026 | Weekly update |
| January 31, 2026 | Pre-election check |
| February 11, 2026 | **Election Day** |

---

<div class="callout-bottomline">
<p><strong>This is what Panopticon delivers: not just what's wrong, but exactly how to fix it.</strong></p>
<p>From monitoring 8 AI platforms to tracing errors to root causes to providing step-by-step action cards your team can execute — all in a format designed for busy campaign staff.</p>
</div>

---

*Report prepared by Kyanos Labs • Digital Authority Platform*

*SCOPE • ORTHOS • PRAXIS*

*Questions? Contact support@kyanos.tech*
