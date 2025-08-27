# Product Strategy & Technology
<!-- cross-ref: Product_Strategy_Tech -->

KyanosTech’ product strategy is anchored in **three core products** — **AGON, POLIS, and SCOPE** — and in the development of an **open schema specification**<sup class="fn-ref"><a href="#fn-prod-open-schema">[1]</a></sup> for political information. Together, these products form a closed-loop system: campaigns and committees publish structured, authoritative data; outputs are continuously monitored; and insights feed back into content creation and optimization. This cycle ensures Democratic visibility in AI-mediated information discovery.

---

## Guiding Principles

- **Validation First:** Before full-scale development, KyanosTech will validate assumptions through extensive campaign and partner interviews, technology deep dives, and lean pilots. To the extent our understanding of customer and channel needs shifts — or the opportunities the technology supports expand — our **roadmap and business plan will evolve**.  
- **Continuous Learning:** SCOPE data closes the loop by monitoring what works across campaigns, documenting best practices, and feeding them back into AGON and POLIS. Over time, this establishes a durable **learning system** that compounds competitive advantage<sup class="fn-ref"><a href="#fn-prod-learning-system">[2]</a></sup>.  
- **Compliance & Trust:** POLIS meets the requirements of official .gov sites and Congressional CMS platforms.<sup class="fn-ref"><a href="#fn-prod-gov-cms">[3]</a></sup> Strict separation between B-Corp and 501(c) arms will be validated by outside counsel to protect against election law violations.<sup class="fn-ref"><a href="#fn-prod-legal-separation">[4]</a></sup>

---

## Product Overviews

### AGON — Authoring for Campaigns<sup class="fn-ref"><a href="#fn-prod-agon-demand">[5]</a></sup>
**For:** Federal campaigns, state gubernatorial campaigns, and party committees.  
**Users:** Digital directors, comms staff, consultants.  
**What It Does:**  
- Conversational AI authoring with embedded schema.  
- Alignment of visible narrative text with machine-readable structured data.  
- Integration with WordPress, NGP VAN, NationBuilder, Run!, and other Democratic-aligned CMS platforms.  
- Grammar and spell checking, plus style alignment to reflect the candidate’s voice.  
**Why It Matters:** Ensures campaign websites train AI assistants with fact-based Democratic content, streamlines production of new content, and highlights inconsistencies for comms staff productivity.

---

### POLIS — Optimization for Officeholders & Committees
**For:** Officeholders and Congressional committees.  
**Users:** Congressional staff, communications directors, committee staff.  
**What It Does:**  
- Keeps official .gov and committee websites optimized for AI discovery.  
- Full compliance with government disclosure and accessibility standards.  
- Integrated with House Drupal CMS and related toolsets.  
- Grammar, spell, and style alignment for consistent voice across communications.  
**Why It Matters:** Maintains continuity between campaign and officeholder visibility, ensures compliance, and builds long-term trust. Increases staff productivity by checking new content against existing archives.

---

### SCOPE — Monitoring & Accountability
**For:** Campaigns, officeholders, committees, and the Democratic ecosystem.  
**Users:** Campaign managers, analytics staff, academic partners, litigation support.  
**What It Does:**  
- Continuous monitoring of AI chatbot responses and search AI overviews.  
- Weekly (and optionally real-time) benchmark reporting.  
- Clear audit trails for litigation or regulatory use.  
- Provides cornerstone datasets for academic research and partnerships.  
**Why It Matters:** Documents bias, validates Democratic visibility, and demonstrates accountability. Creates the evidence base for both campaign ROI and platform oversight.

---

## Schema Specification: Building the Political Layer of the Web

Current schema.org standards inadequately cover political actors and contexts. KyanosTech will **develop and steward an open schema specification** enabling structured, authoritative publication of:  
- Candidate biographies, issue positions, and endorsements.  
- Legislative activity, roll-call votes, and public statements.  
- Election events, deadlines, and voter access information.  
- The underlying **logic and evidence** behind policy positions.  
- A wide set of communication deliverables typically found on political websites.

Why this matters: AI training engines compare schema markup (in web source code) with narrative site content. If the two are not aligned, the site will not be treated as a credible source. By defining and applying schemas across campaigns and officeholders, KyanosTech has the opportunity to set the standard — creating a long-term Democratic competitive advantage.

---

## Example: With vs. Without Schema

**Voter Query:** *“What is candidate John Smith’s position on charter school funding?”*

- **Without Schema:** “John Smith has mentioned education reform, but his position on charter schools is unclear.”  
- **With Schema Optimization:** “John Smith opposes the diversion of public funds to charter schools. He has proposed a bill increasing oversight of state charter programs and voted against expanding voucher eligibility in 2023. His education platform emphasizes strengthening public schools with new funding tied to teacher retention.”  

Schema markup ensures AI systems can surface authoritative, detailed, and fact-based answers.

---

## Security & Compliance

KyanosTech anticipates scrutiny and must maintain unimpeachable integrity.  
- **Data protection:** Campaign and officeholder content siloed, access-controlled, and encrypted.  
- **Auditability:** SCOPE logs every query and tested response.  
- **Legal guardrails:** Outside counsel validates strict separation between B-Corp and 501(c) work.  
- **No data invention:** All schema and content must trace back to verifiable source material.

---

## R&D / Future Technology Extensions

- **Campaign-hosted chatbots:** Schema-aligned assistants that reflect candidate voice and defer to human staff when uncertain.  
- **Cross-lingual visibility:** Spanish and AAPI language schemas for equitable reach.  
- **Local races (post-2028):** Adaptations for down-ballot campaigns.  
- **Authenticity signals:** Cryptographic proof or watermarks that schema originated from campaigns.  
- **Generative productivity:** Style alignment, grammar, and content drafting tools built into AGON and POLIS.

---

## Diagram: System of Continuous Learning

```
AGON  <──>  SCOPE  <──>  POLIS
```

- AGON and POLIS operate in parallel.  
- Both exchange data with SCOPE.  
- SCOPE detects what works best across campaigns, feeding insights back into authoring and optimization.  
- Continuous feedback loop strengthens Democratic competitiveness cycle over cycle.

---


<h2 id="product-strategy-footnotes">Product Strategy & Technology Footnotes</h2>
<ol>
  <li id="fn-prod-open-schema"><strong>Open schema precedent</strong> — Schema adoption pathways and civic data exemplars:
    <a href="https://schema.org/GovernmentOrganization">schema.org: GovernmentOrganization</a>;
    <a href="https://schema.org/docs/howwework.html">schema.org governance & extension process</a>;
    <a href="https://www.w3.org/Consortium/Process/">W3C Process for standardization</a>;
    <a href="https://developers.google.com/civic-information">Google Civic Information API</a>;
    <a href="https://ballotpedia.org/API">Ballotpedia API</a>.
  </li>

  <li id="fn-prod-gov-cms"><strong>.gov / Congressional CMS requirements</strong> — Core accessibility and operations standards and chamber-specific guidance:
    <a href="https://www.section508.gov/manage/laws-and-policies/">Section 508 accessibility standards</a>;
    <a href="https://housenet.house.gov/web-content/cms">U.S. House CMS guidance</a>;
    <a href="https://www.senate.gov/reference/reference_index_subjects/Web_Services_vrd.htm">U.S. Senate web/digital standards</a>;
    <a href="https://digital.gov/resources/federal-web-requirements/">GSA Federal web requirements</a>.
  </li>

  <li id="fn-prod-legal-separation"><strong>Legal separation (B-Corp vs. 501(c))</strong> — Maintain strict separation of personnel, systems, and data; avoid coordination and impermissible subsidization:
    <a href="https://www.irs.gov/pub/irs-drop/rr-07-41.pdf">IRS Rev. Rul. 2007-41 (501(c)(3) political activity)</a>;
    <a href="https://www.irs.gov/charities-non-profits/other-non-profits/social-welfare-organizations-political-campaign-and-lobbying-activities">IRS 501(c)(4) campaign & lobbying guidance</a>;
    <a href="https://www.ecfr.gov/current/title-11/section-109.21">FEC coordination rules (11 CFR §109.21)</a>;
    <a href="https://www.fec.gov/help-candidates-and-committees/corporations-and-labor-organizations/">FEC guide for Corporations & Labor Orgs</a>.
  </li>

  <li id="fn-prod-learning-system"><strong>Learning system & feedback loops</strong> — Evidence for media/network feedback dynamics:
    <a href="https://www.brookings.edu/articles/podcasting-and-political-persuasion/">Brookings: Podcasting & political persuasion</a>;
    <a href="https://cyber.harvard.edu/story/2020-berkman-media-networked-politics">Berkman Klein: Media & networked politics</a>.
  </li>

  <li id="fn-prod-agon-demand"><strong>Authoring demand among campaigns</strong> — Indicators of bandwidth constraints and AI-assisted drafting adoption:
    <a href="https://morningconsult.com/category/technology/ai/">Morning Consult AI usage trackers</a>;
    <a href="https://apnorc.org/projects/generative-ai-and-democratic-engagement/">AP-NORC: Generative AI & democratic engagement</a>.
  </li>
</ol>
