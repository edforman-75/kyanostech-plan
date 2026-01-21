# Impact Analysis: Internet Presence Optimization vs. Traditional Voter Contact

**Internal Reference Document**
**January 2026**

---

## The Core Argument

Political campaigns spend $50-200 per voter moved through traditional channels. Internet Presence Optimization costs a fraction of that and reaches voters at the moment they're actively researching—when they're most persuadable.

This analysis compares two campaigns in contrasting environments to demonstrate the ROI of Internet Presence Optimization.

---

## Two Campaigns, Two Markets

| Factor | NJ-11 (Malinowski) | Idaho Senate (Achilles) |
|--------|-------------------|------------------------|
| **Race Type** | Congressional special election | U.S. Senate |
| **Party** | Democrat | Independent |
| **Media Market** | New York DMA (most expensive in US) | Boise, ID (affordable) |
| **Broadcast TV viable?** | ❌ No (prohibitive waste) | ✅ Yes |
| **Incumbent situation** | Open seat (Sherrill → Governor) | Risch (4-term, $30M Super PAC backup) |
| **AI challenge** | Ethics violations dominate responses | Zero presence in training data |
| **Primary/General** | Dem primary Feb 5, 2026 | General Nov 3, 2026 |

---

## Research Foundation: When Does Persuasion Work?

### Kalla & Broockman (2018): "The Minimal Persuasive Effects of Campaign Contact"

Meta-analysis of 49 field experiments found:

> **"The best estimate of the effects of campaign contact and advertising on Americans' candidate choices in general elections is zero."**

**But persuasion DOES work when:**

1. **Low-information environments** — Voters don't know much about candidates
2. **Primary elections** — Less partisan sorting
3. **Down-ballot races** — Less media coverage, more persuadable voters
4. **Early contact** — Before opinions crystallize (though effects decay)

**Sources:**
- [Kalla & Broockman SSRN](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3042867)
- [Cambridge/APSR](https://www.cambridge.org/core/journals/american-political-science-review/article/how-experiments-help-campaigns-persuade-voters-evidence-from-a-large-archive-of-campaigns-own-experiments/FF5BE6ED1553475F8321F7C4209357F7)

### Why This Matters for AI

AI provides first impressions in exactly the environments where persuasion works:

- **Voters actively researching** = high intent, persuadable moment
- **Primary elections** = low information, less partisan
- **Challenger campaigns** = building name ID from scratch
- **Down-ballot races** = voters seeking information they don't have

---

## Cost Per Voter Moved: Traditional Methods

### Door-to-Door Canvassing

| Metric | Value | Source |
|--------|-------|--------|
| Contacts per hour | 12 | Green & Gerber |
| Hourly wage | $16-20 | Industry standard |
| Votes per 14 contacts | 1 | Green & Gerber |
| **Cost per vote** | **$19-29** | [Chronicle of Philanthropy](https://www.philanthropy.com/news/cost-of-door-to-door-canvassing-is-19-per-vote-research-finds/) |

**Note:** This is cost per vote *turned out*, not persuaded. Kalla & Broockman found canvassing has near-zero persuasion effect in general elections.

### Phone Banking

| Method | Cost per Additional Vote |
|--------|-------------------------|
| Volunteer phone calls | $35-50 |
| Paid phone calls | $100-200 |
| Robocalls | No detectable effect |

### Direct Mail

| Metric | Value |
|--------|-------|
| Cost per piece | $0.50-1.50 |
| Pieces needed for effect | 5-8 touches |
| Response rate | 1-2% |
| **Cost per vote** | **$59-200** |

---

## Cost Per Voter Moved: Broadcast Television

### National Averages

| Market Size | 30-Second Spot | CPM | Cost per Persuaded Voter |
|-------------|----------------|-----|--------------------------|
| Top 10 DMA | $5,000-50,000 | $30-50 | $150-300 |
| Mid-size DMA | $500-5,000 | $15-30 | $75-150 |
| Small DMA | $100-1,000 | $8-15 | $40-100 |

**Persuasion rate assumption:** 0.5-1% of viewers (industry standard for well-executed ads)

### NJ-11: New York DMA Reality

| Factor | Impact |
|--------|--------|
| DMA Rank | #1 (largest in US) |
| 30-second primetime spot | $30,000-80,000 |
| Weekly flight (50 GRPs) | $150,000-400,000 |
| NJ-11 population | ~760,000 |
| NYC metro population | ~20,000,000 |
| **Waste factor** | **96%** (paying for NYC, Long Island, CT, etc.) |

**Effective cost per NJ-11 voter reached:** 25x higher than face value

A $300,000 TV buy in NY DMA:
- Reaches ~20M people
- ~760,000 in NJ-11 (3.8%)
- Effective NJ-11 cost: $7.9M equivalent
- Estimated voters persuaded: 500-1,500
- **Cost per persuaded voter: $200-600**

### Idaho Senate: Boise DMA Reality

| Factor | Impact |
|--------|--------|
| DMA Rank | #112 |
| 30-second primetime spot | $200-800 |
| Weekly flight (50 GRPs) | $10,000-40,000 |
| Idaho population | ~2,000,000 |
| Boise DMA coverage | ~70% of state |
| **Waste factor** | Low (most viewers are voters) |

**Effective cost per Idaho voter reached:** Near face value

A $50,000 TV buy in Boise:
- Reaches ~1.4M people
- ~1.2M potential voters
- Estimated voters persuaded: 500-1,000
- **Cost per persuaded voter: $50-100**

---

## Cost Per Voter: Streaming/CTV

### Platform CPM Comparison (2024-2025)

| Platform | CPM Range | Political Ads? | Min Spend | Hyperlocal? |
|----------|-----------|----------------|-----------|-------------|
| **Roku** | $15-35 | ✅ Yes | $500 | Zip code |
| **YouTube TV** | $32+ | ✅ Yes | ~$1,000 | +$5/layer |
| **Hulu** | ~$70 | ✅ Yes | $5,000 | DMA |
| **Amazon Fire** | $25-40 | ✅ Yes | $1,000 | Zip code |
| **Netflix** | $20-65 | ❌ No | N/A | N/A |

**Sources:** [Vibe/Roku](https://www.vibe.co/blog/how-to/roku-advertising-cost), [MediaPost](https://www.mediapost.com/publications/article/403906/roku-cpm-cuts-to-yield-major-ad-gains-analyst-say.html), [Gupta Media](https://www.guptamedia.com/insights/youtubetv-ads)

### CTV Advantage in Expensive Markets (NJ-11)

| Metric | Broadcast TV | CTV (Roku/YouTube) |
|--------|--------------|-------------------|
| Minimum buy | $150,000/week | $500-5,000 |
| Geographic waste | 96% | ~0% (zip targeting) |
| Frequency control | Limited | Precise |
| Effective CPM (NJ-11 only) | $750-1,500 | $25-50 |

**CTV ROI in NY DMA:** 15-30x more efficient than broadcast

### CTV in Affordable Markets (Idaho)

| Metric | Broadcast TV | CTV |
|--------|--------------|-----|
| 30-second spot | $200-800 | $25-35 CPM |
| Geographic targeting | DMA-wide | Zip code |
| Reach (weekly) | 50%+ of market | 10-20% |
| Cost efficiency | Comparable | Slightly higher CPM, lower reach |

**CTV ROI in Boise:** Roughly comparable to broadcast, but with better targeting

---

## Cost Per Voter: Internet Presence Optimization

### What It Costs

| Component | One-Time | Monthly |
|-----------|----------|---------|
| Website audit & fixes | $2,000-5,000 | — |
| Schema markup implementation | $500-1,000 | — |
| Content creation (5-7 pages) | $2,000-4,000 | — |
| Panopticon monitoring | — | $500-2,000 |
| Ongoing optimization | — | $1,000-2,000 |
| **Total Year 1** | **$5,000-10,000** | **$2,000-4,000/mo** |

### Estimated Reach: NJ-11

| Funnel Stage | Estimate | Calculation |
|--------------|----------|-------------|
| Primary turnout | 60,000-80,000 | Historical + special election factor |
| Research online | 37,000-50,000 | 62% of voters (Pew) |
| Encounter AI | 15,000-22,000 | 40-45% see AI Overview or use ChatGPT |
| **Influenced by improved AI** | **1,500-4,400** | 10-20% persuasion rate in low-info primary |

**Cost per influenced voter:** $5,000-15,000 ÷ 1,500-4,400 = **$1.15-10.00**

### Estimated Reach: Idaho Senate

| Funnel Stage | Estimate | Calculation |
|--------------|----------|-------------|
| General election turnout | 700,000-800,000 | Presidential year boost |
| Research online | 430,000-500,000 | 62% of voters |
| Encounter AI | 170,000-225,000 | 40-45% see AI responses |
| **Influenced by improved AI** | **8,500-22,500** | 5-10% (lower rate, general election) |

**Cost per influenced voter:** $10,000-20,000 ÷ 8,500-22,500 = **$0.45-2.35**

**Note:** Achilles has ZERO presence in AI training data. Any Internet Presence Optimization creates presence from nothing—potentially higher impact per dollar.

---

## Summary: Cost Per Voter Moved

### NJ-11 (Malinowski) — Expensive Market, Primary Election

| Method | Cost per Voter Moved | Viable? |
|--------|---------------------|---------|
| Broadcast TV | $200-600 | ❌ Waste too high |
| CTV (Roku/YouTube) | $50-150 | ✅ Hyperlocal works |
| Digital ads | $50-100 | ✅ Standard |
| Direct mail | $59-200 | ✅ Targeted |
| Canvassing | $19-29 (turnout only) | ⚠️ Limited persuasion |
| **Internet Presence Optimization** | **$1-10** | ✅ **Best ROI** |

### Idaho Senate (Achilles) — Affordable Market, General Election

| Method | Cost per Voter Moved | Viable? |
|--------|---------------------|---------|
| Broadcast TV | $50-100 | ✅ Affordable here |
| CTV | $40-80 | ✅ Comparable |
| Digital ads | $30-75 | ✅ Standard |
| Direct mail | $40-100 | ✅ Statewide viable |
| Canvassing | $19-29 (turnout only) | ⚠️ Scale challenge |
| **Internet Presence Optimization** | **$0.50-2.50** | ✅ **Best ROI** |

---

## The Strategic Argument

### For Malinowski (NJ-11)

> "You cannot afford broadcast TV in the New York market. CTV gets you hyperlocal targeting but still costs $50-150 per voter moved. Internet Presence Optimization costs $1-10 per voter and reaches people at the exact moment they're researching your name. In a competitive primary, 2,000-4,000 voters seeing accurate information instead of ethics violations first could be decisive."

### For Achilles (Idaho)

> "You can afford broadcast TV, but you have a bigger problem: you don't exist in AI. Gemini API returns 'I don't have information about Todd Achilles.' Every dollar spent on TV reaches voters who then Google you and find nothing—or worse, only find Risch. Internet Presence Optimization doesn't just improve your presence; it creates it from zero. At $0.50-2.50 per voter influenced, it's the foundation everything else builds on."

---

## Key Sources

**Research:**
- [Kalla & Broockman: Minimal Persuasive Effects](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3042867)
- [Chronicle of Philanthropy: Canvassing Costs](https://www.philanthropy.com/news/cost-of-door-to-door-canvassing-is-19-per-vote-research-finds/)
- [Pew Research: Online Political Research](https://www.pewresearch.org/)

**Advertising Costs:**
- [Basis: 2024 CTV Political Trends](https://basis.com/blog/2024-us-elections-digital-advertising-trends-ctv-drove-programmatic-ad-spending)
- [Vibe: Roku Advertising Costs](https://www.vibe.co/blog/how-to/roku-advertising-cost)
- [MediaPost: Roku CPM Trends](https://www.mediapost.com/publications/article/403906/roku-cpm-cuts-to-yield-major-ad-gains-analyst-say.html)
- [MarTech: Regional CTV Costs](https://martech.org/political-ad-spending-shifts-regional-ctv-costs-for-brands/)

**Campaign Data:**
- NJ Division of Elections: Voter registration statistics
- FEC: Campaign finance data
- AdWatch reports (internal)
- Bentham study results (internal)

---

*Internal reference document — not for distribution*
