#!/usr/bin/env bash
set -euo pipefail

# ---------- Inputs ----------
HOME_SRC="${1:-}"   # path to your new Home text (required)
MK="mkdocs.yml"
DOCS="docs"
HOME_MD="$DOCS/index.md"
ABOUT_MD="$DOCS/about-this-plan.md"
ABOUT_FALLBACK="$HOME/Downloads/about_this_plan_markdown.md"  # auto-pickup if present

# ---------- Preconditions ----------
[[ -f "$MK" ]] || { echo "❌ mkdocs.yml not found here"; exit 1; }
[[ -n "$HOME_SRC" ]] || { echo "❌ Please provide the path to your Home text, e.g.: bash build_home_from_text.sh ~/Downloads/home_text.md"; exit 1; }
[[ -f "$HOME_SRC" ]] || { echo "❌ Home source not found: $HOME_SRC"; exit 1; }

# ---------- Backups ----------
cp "$MK" "$MK.bak.$(date +%Y%m%d-%H%M%S)"

# ---------- Ensure docs/ exists ----------
mkdir -p "$DOCS"

# ---------- Write Home from provided text ----------
# We drop the content in as-is. If you want an H1 added, prepend "# KyanosTech Plan\n\n" before copying.
cp "$HOME_SRC" "$HOME_MD"

# Fix links in Home:
#   - changelog/ -> changelog/index.md
#   - any about-this-plan references -> site path /about-this-plan/
perl -0777 -i -pe 's#\]\(changelog/\)#](changelog/index.md)#g' "$HOME_MD"
perl -0777 -i -pe 's#\]\((?:about-this-plan\.md|about-this-plan/?)\)#](/about-this-plan/)#g' "$HOME_MD"

# Ensure Home includes a “See also: About This Plan” reference once
grep -q '\[About This Plan\]' "$HOME_MD" || printf '\n**See also:** [About This Plan](/about-this-plan/)\n' >> "$HOME_MD"

echo "✅ Home updated from: $HOME_SRC"

# ---------- Ensure About This Plan exists ----------
if [[ ! -f "$ABOUT_MD" ]]; then
  if [[ -f "$ABOUT_FALLBACK" ]]; then
    mv -f "$ABOUT_FALLBACK" "$ABOUT_MD"
    echo "✅ Moved About from $ABOUT_FALLBACK -> $ABOUT_MD"
  else
    cat > "$ABOUT_MD" <<'MD'
# About This Plan

*(Placeholder page created automatically. Replace with your real content.)*
MD
    echo "ℹ️ Created placeholder at $ABOUT_MD"
  fi
fi

# ---------- Normalize tabs (tabs can break YAML) ----------
expand -t 2 "$MK" > "$MK.tmp" && mv "$MK.tmp" "$MK"

# ---------- Rebuild a clean nav (prevents truncation) ----------
# If you maintain different section paths, adjust below.
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

# Split mkdocs.yml into head/nav/tail and replace nav block
nav_start=$(awk '/^nav:[[:space:]]*$/ {print NR; exit}' "$MK" || true)
if [[ -z "${nav_start:-}" ]]; then
  # no nav found: inject a fresh one at top
  cat _nav.full "$MK" > mkdocs.yml.new && mv mkdocs.yml.new "$MK"
else
  next_key=$(awk -v s="$nav_start" 'NR>s && /^[A-Za-z0-9_]+:[[:space:]]*$/ {print NR; exit}' "$MK" || true)
  [[ -z "${next_key:-}" ]] && next_key=$(( $(wc -l < "$MK") + 1 ))
  (( nav_start>1 )) && sed -n "1,$((nav_start-1))p" "$MK" > _head.yml || : > _head.yml
  sed -n "$next_key,\$p" "$MK" > _tail.yml
  cat _head.yml _nav.full _tail.yml > mkdocs.yml.new && mv mkdocs.yml.new "$MK"
  rm -f _head.yml _tail.yml
fi
rm -f _nav.full

echo "✅ Navigation rebuilt."

# ---------- Optional: stage in git ----------
if command -v git >/dev/null 2>&1; then
  git add "$HOME_MD" "$ABOUT_MD" "$MK" || true
  git status --short || true
fi

echo "🚀 Serve locally with: mkdocs serve -a 127.0.0.1:8010"
