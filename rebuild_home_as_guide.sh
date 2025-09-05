#!/usr/bin/env bash
set -euo pipefail

DOCS="docs"
HOME="$DOCS/index.md"
MK="mkdocs.yml"

[[ -f "$MK" ]]   || { echo "❌ mkdocs.yml not found"; exit 1; }
mkdir -p "$DOCS"

# 0) Back up the current Home
cp -f "$HOME" "$HOME.bak.$(date +%Y%m%d-%H%M%S)" 2>/dev/null || true

# 1) Write a fresh Home page where each entry is an H1 that LINKS to the target page
#    (All paths are from docs/ root; adjust labels if you prefer different wording.)
cat > "$HOME" <<'MD'
# Guide to This Plan

# [About This Plan](/about-this-plan/)
What this site is, how to read it, and what changed recently.

# [Executive Summary](sections/executive-summary/)
A concise overview of the case, what we’re building, and why now.

# [Problem & Urgency](sections/market-financial-opportunity/)
Why AI creates both a risk and an opportunity for Democratic visibility.

# [Solution & Theory of Change](sections/product-strategy-technology/)
How AGON (campaign), POLIS (officeholder), and SCOPE (verification) secure trusted visibility.

# [Market & Financial Opportunity](sections/market-financial-opportunity/)
Sizing the reachable market and how we get to ~$6.4M in 2028.

# [Business Model & Unit Economics](sections/business-model-unit-economics/)
Why the economics are sustainable and resilient.

# [Go-to-Market Strategy](sections/go-to-market-strategy/)
How we sequence customers, channels, and proof points.

# [Impact Measurement & Reporting](sections/impact-measurement-reporting/)
How we will prove Democratic value—not just financial returns.

# [Investment Ask & Use of Funds](sections/investment-ask-use-of-funds/)
Why $5M matters now and how it is allocated.

# [Financial Plan](sections/financial-plan/)
Conservative projections tied to validated assumptions.

# [Risk & Mitigation](sections/section-11-risk-analysis/)
What could go wrong and how we manage it.

# [Strategic Moat & Partnerships](sections/strategic-moat-partnerships/)
How relationships and technology create barriers to entry.

# [Team & Governance](sections/team-governance/)
Experienced leadership committed to both mission and discipline.

# [Exit & Legacy](sections/section-16-long-term-vision-exit-strategy/)
Options for acquisition, nonprofit spin-out, or durable independent growth.

# Appendices

# [Appendix B — Financial Model & Unit Economics](appendices/appendix-b/)
Grounded model with stress tests.

# [Appendix C — Impact Metrics](appendices/appendix-c/)
Quality and coverage benchmarks.

# [Appendix D — AI + Podcast Demographic Convergence](appendices/appendix-d-ai-and-podcast-demographic-convergence-analysis/)
Detailed sizing and media-behavior insight that informs timing.

# [Appendix D — Organizational Forms & Funding](appendices/appendix-d/)
Comparative structures and funding pathways.

# [Appendix E — Brand Identity System](appendices/appendix-e/)
KyanosTech visual identity and product suite branding.

# [Appendix F — The Evolution of Online Media](appendices/appendix-f-the-evolution-of-online-media-political-influence/)
The shift from social to AI and why timing matters.

# [Appendix G — Biased Chatbots & Political Influence](appendices/appendix-g-biased-chatbots-and-political-influence/)
Evidence that conversational AI can move opinions.

# [Appendix H — The Invisible Hand (Audio)](appendices/appendix-h-the-invisible-hand-audio-investigation/)
Narrative investigation into how AI influenced 2028.

# [Appendix I — Campaign Finance Compliance Framework](appendices/appendix-i-campaign-finance-compliance-framework/)
Legal guardrails for PACs, campaigns, and B-Corps.

# White Papers

# [From Search to Conversation](white-papers/from-search-to-conversation/)
Why the interface shift rewires discovery and persuasion.

# [The Progressive AI Imperative](white-papers/progressive-ai-imperative/)
Principles for building aligned, durable AI advantage.

# [Change Log](changelog/)
Version history and notable edits.
MD

# 2) Normalize any fragile links now that Home lives at docs root
#    (safe no-ops if already correct)
perl -0777 -i -pe 's#\]\(changelog/\)#](changelog/index.md)#g' "$HOME"
perl -0777 -i -pe 's#\]\((?:about-this-plan\.md|about-this-plan/?)\)#](/about-this-plan/)#g' "$HOME"

# 3) (Optional) Rename nav’s first item to “Guide to This Plan”
perl -0777 -i -pe 's/^(\s*)-\s*Home:\s*index\.md\s*$/\1- Guide to This Plan: index.md/m' "$MK" || true

echo "✅ Home rebuilt as a linked guide. You can preview with: mkdocs serve -a 127.0.0.1:8010"
