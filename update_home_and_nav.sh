#!/usr/bin/env bash
set -euo pipefail

# --- Inputs ---
HOME_SRC="${1:-}"   # optional: path to a markdown file to become the new Home
MK="mkdocs.yml"
DOCS="docs"

[[ -f "$MK" ]] || { echo "❌ mkdocs.yml not found here"; exit 1; }
mkdir -p "$DOCS"

# 0) backup
cp "$MK" "$MK.bak.$(date +%Y%m%d-%H%M%S)"

# 1) Replace Home if a file was provided
if [[ -n "$HOME_SRC" ]]; then
  [[ -f "$HOME_SRC" ]] || { echo "❌ Home source not found: $HOME_SRC"; exit 1; }
  cp "$HOME_SRC" "$DOCS/index.md"
  echo "✅ Home updated from: $HOME_SRC"
fi

# 2) Fix legacy link to changelog/
if [[ -f "$DOCS/index.md" ]]; then
  perl -0777 -i -pe 's#\]\(changelog/\)#](changelog/index.md)#g' "$DOCS/index.md"
  echo "🔗 Fixed Change Log link in docs/index.md (-> changelog/index.md)"
fi

# 3) Ensure About page path exists for nav link (created earlier by us)
if [[ ! -f "$DOCS/about-this-plan.md" && -f "$DOCS/about_this_plan_markdown.md" ]]; then
  mv -f "$DOCS/about_this_plan_markdown.md" "$DOCS/about-this-plan.md"
fi

# 4) Rebuild nav with full groups
#    (keeps your existing top section list, then appends Appendices, White Papers, Changelog)
awk '
  BEGIN{ in_nav=0; }
  /^nav:[[:space:]]*$/ { print; in_nav=1; next }
  in_nav==1 && /^[A-Za-z0-9_]+:[[:space:]]*$/ { in_nav=0 }
  { print }
' "$MK" > _mk.tmp1

# Compose the full desired nav block
cat > _nav.full <<'YML'
nav:
  - Home: index.md
  - About This Plan: about-this-plan.md
  - Executive Summary: sections/executive-summary/index.md
  - Problem & Urgency: sections/market-financial-opportunity/index.md
  - Solution & Theory of Change: sections/product-strategy-technology/index.md
  - Go-to-Market Strategy: sections/go-to-market-strategy/index.md
  - Business Model & Unit Economics: sections/business-model-unit-economics/index.md
  - Impact Measurement & Reporting: sections/impact-measurement-reporting/index.md
  - Investment Ask & Use of Funds: sections/investment-ask-use-of-funds/index.md
  - Risk Analysis: sections/section-11-risk-analysis/index.md
  - Strategic Moat & Partnerships: sections/strategic-moat-partnerships/index.md
  - Team & Governance: sections/team-governance/index.md
  - Appendices:
      - Appendix B: appendices/appendix-b/index.md
      - Appendix C: appendices/appendix-c/index.md
      - Appendix D (AI + Podcast Demographics): appendices/appendix-d-ai-and-podcast-demographic-convergence-analysis/index.md
      - Appendix D (Other): appendices/appendix-d/index.md
      - Appendix E: appendices/appendix-e/index.md
      - Appendix F (Online Media Influence): appendices/appendix-f-the-evolution-of-online-media-political-influence/index.md
      - Appendix G (Biased Chatbots): appendices/appendix-g-biased-chatbots-and-political-influence/index.md
      - Appendix H (Invisible Hand): appendices/appendix-h-the-invisible-hand-audio-investigation/index.md
      - Appendix I (Compliance Framework): appendices/appendix-i-campaign-finance-compliance-framework/index.md
  - White Papers:
      - From Search to Conversation: white-papers/from-search-to-conversation/index.md
      - Progressive AI Imperative: white-papers/progressive-ai-imperative/index.md
  - Change Log: changelog/index.md
YML

# Stitch new nav + tail of original file
#   Take everything before original nav, then our full nav, then the remainder after nav.
head -n "$(awk '/^nav:[[:space:]]*$/{print NR; exit}' "$MK" 2>/dev/null || echo 0)" "$MK" > _mk.head || true
if [[ -s _mk.head ]]; then
  # drop the old nav prepended part from tmp1
  tail -n +$(( $(awk '/^nav:[[:space:]]*$/{print NR; exit}' "$MK" 2>/dev/null || echo 0) + 1 )) "$MK" > _mk.afterNav || : 
else
  cp "$MK" _mk.afterNav
fi

# find next top-level key after nav in the original, to keep config below nav
nextkey=$(awk 'f==0&&/^nav:[[:space:]]*$/{f=1;next} f==1&&/^[A-Za-z0-9_]+:[[:space:]]*$/{print NR; exit}' "$MK")
if [[ -n "${nextkey:-}" ]]; then
  tail -n +$nextkey "$MK" > _mk.tail
else
  : > _mk.tail
fi

cat _mk.head _nav.full _mk.tail > mkdocs.yml.new && mv mkdocs.yml.new "$MK"
rm -f _mk.head _mk.tail _mk.afterNav _nav.full _mk.tmp1

echo "✅ Home (if provided) and full navigation updated."
echo "🚀 Serve with: mkdocs serve -a 127.0.0.1:8010"
