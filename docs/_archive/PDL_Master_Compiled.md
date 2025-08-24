# Progressive Digital Labs Impact Business Plan



# Market & Financial Opportunity

## 1. Urgency of Digital Discovery
By 2026–2028, it’s projected that **over half of all voter interactions**—from research to decision-making—will occur via **AI-mediated interfaces and structured discovery**, rather than traditional media. For example, political ad spending on digital platforms alone **surged to $619 million by August 2024**, with total online ad spend reaching **$1.35 billion for the full cycle** ([brennancenter.org](https://www.brennancenter.org/our-work/analysis-opinion/online-ad-spending-2024-election-topped-135-billion)).

## 2. Market Definition
We focus exclusively on **organic digital infrastructure**—CMS, analytics, structured-content platforms, compliance tooling—not paid media, travel, or administrative budgets.

### Market Funnel Overview

| Layer | Definition | 2026–28 Estimate | Notes / Sources |
|-------|-------------|------------------|------------------|
| **TAM** | Non-media digital/technology budgets of Democratic & Independent federal/state campaigns, committees, and officeholders | **$600–800 M** | Based on ~3–5% of campaign spend in budget line items like SaaS/CMS/content tools ([emarketer.com](https://www.emarketer.com/press-releases/2024-political-ad-spending-will-jump-nearly-30-vs-2020), [brennancenter.org](https://www.brennancenter.org/our-work/analysis-opinion/online-political-spending-2024)). |
| **SAM** | Portion of TAM relevant to AI-discovery tools and structured data systems | **$20–40 M** | Leaning representation due to tool specificity and conservative assumption of allocation. |
| **SOM** | Attainable market via platform integration (limited CMS support + top-race targeting) | **$30–50 M** | Conservative penetration assumption aligned with early SaaS adoption trends. |

## 3. Growth Dynamics
- **Digital Dominance (Contextual Insight):** In late-cycle 2024, campaigns spent roughly **$23M on digital ads** vs. **$24.5M on TV ads**, showing near parity ([brennancenter.org](https://www.brennancenter.org/our-work/analysis-opinion/online-political-spending-2024), [mediaproject.wesleyan.edu](https://mediaproject.wesleyan.edu/releases-103124/)).  
- **Technology Budget Expansion:** Campaigns are increasingly investing in digital infrastructure (web platforms, analytics, structured data tools).  
- **Cyclical Uptake:** We expect SOM-driven ARR to peak in 2028, trough slightly in off-years, but remain supported through recurring officeholder/committee contracts, creating sustainable revenue flows across cycles.

---

## Methodology Notes
1. **Ad Spend as Context—not Inclusion**: Digital ad figures are used solely to demonstrate voter behavior shifts, not to inflate TAM.  
2. **Digital-Tech Share Benchmark (TAM)**: Industry reporting shows total political advertising will exceed $12B in 2024, with digital media accounting for ~28% of that. We use conservative 3–5% estimate for non-media digital infrastructure.  
3. **Proportional Allocation (SAM)**: SAM is derived conservatively from TAM, factoring in tool specificity and practical adoption constraints.  
4. **SOM Penetration**: Based on early-stage SaaS adoption timelines and limited CMS integration paths.

# Risk & Mitigation

<!-- cross-ref: Risk & Mitigation -->

Progressive Digital Labs acknowledges that launching an impact-driven SaaS business in the middle of a polarized political landscape carries unusual risks. Rather than minimizing them, we make them explicit and present clear mitigations.  

| **Risk** | **Mitigation** |
|----------|----------------|
| **Execution Risk**<br>Scaling three products (DANA, DREW, BENCH) simultaneously may overextend a lean team. | Phased roadmap: prioritize MVP and pilots in 2026; add features incrementally. Contractors for campaign surges. Explicit SEED-phase validation of assumptions before scale. |
| **Market Adoption Risk**<br>Campaigns may be slow to adopt structured data tools. | Deep discounts + hands-on services for 2026 pilots; leverage CMS partnerships (WordPress, NGP, NationBuilder, Run!) to reduce friction. Case studies to prove ROI before 2028. |
| **Political / Regulatory Risk**<br>Scrutiny of political tech vendors is increasing. Risk of accusations of bias or unlawful coordination. | Maintain B-Corp structure with part-time General Counsel and outside counsel validating compliance【web†source】. Strict firewall between B-Corp and 501(c) arms. All schemas traceable to public source material. |
| **Credit Risk**<br>Campaigns are notorious for late or partial payments, especially after losing elections【web†source】. | Up-front payment policies, milestone billing, and PAC/union partnerships as intermediaries. Officeholder/committee accounts provide steadier recurring revenue. |
| **Competitive Risk**<br>Republican campaigns or large commercial vendors may replicate similar tools. | Defensive moats: schema standards, CMS integrations, BENCH’s audit dataset. First-mover advantage in Democratic ecosystem. |
| **Technology Risk**<br>AI platforms may change APIs, models, or discovery mechanisms. | Continuous monitoring via BENCH. Academic and legal partnerships to detect/respond. Roadmap flexibility to adapt schemas and authoring tools. |
| **Reputational Risk**<br>Any perception of manipulation of AI answers could undermine credibility. | Transparency: publish methodology, validation pilots, and dashboards. Independent academic oversight. |

---

**Footnotes & Evidence**  
1. *Election law compliance*: Legal analyses warn that nonprofits funding campaign tech risk violating coordination rules; counsel oversight is critical (see [Bolder Advocacy guide on 501(c) political activity](https://bolderadvocacy.org/)).  
2. *Credit risk*: Coverage of campaign vendors repeatedly shows unpaid invoices after losses, e.g., Politico 2021: “Campaigns stiff consultants” documenting millions in unpaid bills.  
3. *Market adoption barriers*: FEC data and campaign tech surveys show Democratic campaigns lag Republicans in adopting structured digital tools, especially schema markup.

<!--
Consolidated Cross-Reference Map — Progressive Digital Labs (Hidden, non-rendering)

# Anchor ID Conventions
- Use kebab-case anchors at top of each section header, e.g., `## Executive Summary {#executive-summary}`.
- For product subsections, prefix with product: `# DANA {#product-dana}`.
- For tables/charts, add explicit anchors: `### 2028 Revenue Table {#rev-2028-table}`.

# Sections & Anchors

[1] Executive Summary {#executive-summary}
  - Outbound links:
    - Info Shift & Two Scares → {#info-shift}
    - Market & Financial Opportunity → {#market-opportunity}
    - Business Model (BMC) → {#business-model}
    - Financial Plan (2028 sensitivity) → {#financial-plan}
    - Go-to-Market Overview → {#go-to-market}
    - Team & Governance → {#team-governance}
  - Inbound links from:
    - All modules referencing “Four-Year Ramp (2025–2028)” → anchor {#four-year-ramp}

[2] The Next Media Revolution & Two Scares {#info-shift}
  - Sub-anchors:
    - Podcasts → {#podcasts-lesson}
    - Scare 1 (AI gatekeeper) → {#scare-ai-gatekeeper}
    - Scare 2 (Oligarch concentration) → {#scare-oligarchs}
    - 2028 AI-Answered Curve (chart) → {#ai-answered-curve}
    - Evidence & Methods (footnotes) → {#info-shift-evidence}
  - Outbound:
    - Product Strategy intro (without naming products) → {#product-philosophy}
    - Market sizing (organic discovery share) → {#market-opportunity}
  - Inbound:
    - Executive Summary → {#executive-summary}

[3] Product Strategy & Technology {#product-tech}
  - Philosophy/Validation Block → {#product-philosophy}
  - Schema Specification → {#schema-spec}
  - Example Q&A (with/without schema) → {#schema-example}
  - Security & Compliance → {#security-compliance}
  - R&D / Future Extensions → {#rd-future}
  - Diagram: DANA ↔ BENCH ↔ DREW → {#product-diagram}
  - Outbound:
    - Business Model (Value Prop, Key Activities) → {#business-model}
    - Impact Measurement (QII, bias audits) → {#impact-measurement}
  - Inbound:
    - Info Shift & Two Scares → {#info-shift}

[3a] DANA — Campaign Authoring {#product-dana}
  - Pricing anchor (for cross-ref) → {#pricing-dana}
  - Users → {#users-dana}
  - Why it matters → {#why-dana}

[3b] DREW — Officeholder/Committee Authoring {#product-drew}
  - Compliance (.gov, House Drupal CMS) → {#drew-compliance}
  - Users → {#users-drew}
  - Why it matters → {#why-drew}

[3c] BENCH — Measurement & Auditing {#product-bench}
  - Weekly/continuous reporting → {#bench-reporting}
  - Academic partnerships & litigation support → {#bench-audit-trail}
  - QII algorithm notes → {#qii-method}

[4] Market & Financial Opportunity {#market-opportunity}
  - Organic Discovery Market (non-media tech TAM/SAM/SOM) → {#organic-market}
  - Methodology footnotes → {#market-methods}
  - 2028 Revenue Table (locked) → {#rev-2028-table}
  - Sensitivity tie-in → {#financial-plan}
  - Outbound: Business Model (pricing, channels) → {#business-model}

[5] Business Model (Strategyzer Canvas) {#business-model}
  - Customer Segments → {#bm-customers}
  - Value Proposition → {#bm-value-prop}
  - Channels (partners/direct/CMS) → {#bm-channels}
  - Customer Relationships (Partner Success) → {#bm-relationships}
  - Revenue Streams (pricing) → {#bm-revenue}
  - Key Resources (teams, IP, schema) → {#bm-resources}
  - Key Activities (R&D, audits, partner enablement) → {#bm-activities}
  - Key Partners (CMS, PACs/unions, consultants) → {#bm-partners}
  - Cost Structure (baseline vs. cycle) → {#bm-costs}
  - Assumptions validation (Seed) → {#bm-assumptions}
  - Footnote: Strategyzer BMC → {#bmc-footnote}

[6] Go-to-Market Strategy {#go-to-market}
  - Channels split (25% direct / 75% partner) → {#gtm-channels}
  - Limited CMS Support (WordPress, NGP VAN, NationBuilder, Run!) → {#gtm-cms}
  - Year-by-year activities (2025–2028) → {#gtm-timeline}
  - Responsible leader (Chief Commercial & Impact Officer) → {#gtm-owner}
  - PAC/Union distribution strategy → {#gtm-pacs}
  - Inbound: Business Model Channels → {#bm-channels}

[7] Impact Measurement & Reporting {#impact-measurement}
  - Metrics (Campaigns, QII, RMS%) → {#impact-metrics}
  - Dashboards & on-demand reports → {#impact-dashboards}
  - QII algorithm & precedents → {#qii-method}
  - Footnotes (SEO, validators, readability) → {#impact-footnotes}

[8] Financial Plan {#financial-plan}
  - Locked 2028 revenue ($4.2M) & expense structure → {#fp-locked-2028}
  - Sensitivity (Low/Base/High) table → {#fp-sensitivity}
  - CAC/LTV definition & table → {#fp-cac-ltv}
  - Multi-year cash flow narrative (2025–2028) → {#fp-cashflow}
  - Capital plan ($0.5M seed, $2.5M Series A, $2.0M convertible) → {#fp-capital}
  - Footnotes & methods → {#fp-methods}

[9] Team & Governance {#team-governance}
  - B-Corp vs. PAC rationale → {#bcorp-vs-pac}
  - Part-time General Counsel & separation controls → {#gc-separation}
  - Board composition (odd, with partner rep) → {#board-composition}
  - Compensation philosophy (85th percentile DC) → {#comp-philosophy}

# Cross-Section Links To Insert (once HTML build happens)
- Exec Summary → info shift curve: link {#executive-summary} → {#ai-answered-curve}
- Product Strategy schema → Impact Measurement QII: {#schema-spec} → {#qii-method}
- Market 2028 table → Financial sensitivity: {#rev-2028-table} → {#fp-sensitivity}
- Go-to-Market CMS list → Product Tech integrations: {#gtm-cms} → {#product-dana}, {#product-drew}
- Team & Governance GC → Financial Plan (legal budget): {#gc-separation} → {#fp-methods}

# To-Do (will update as sections are reviewed)
- Verify final anchor names exactly when converting to HTML.
- Add chart IDs for any new visuals created during layout.
- Ensure Evidence & Methods footnotes are deduped project-wide.
-->