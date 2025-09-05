#!/usr/bin/env bash
set -euo pipefail

MK="mkdocs.yml"
DOCS="docs"
ABOUT_DST="$DOCS/about-this-plan.md"
ABOUT_SRC="${1:-$HOME/Downloads/about_this_plan_markdown.md}"

[[ -f "$MK" ]] || { echo "❌ mkdocs.yml not found here"; exit 1; }

# Backup and normalize tabs (tabs break YAML)
cp "$MK" "$MK.bak.$(date +%Y%m%d-%H%M%S)"
expand -t 2 "$MK" > "$MK.tmp" && mv "$MK.tmp" "$MK"

# Ensure About page exists
mkdir -p "$DOCS"
if [[ ! -f "$ABOUT_DST" ]]; then
  if [[ -f "$ABOUT_SRC" ]]; then
    mv -f "$ABOUT_SRC" "$ABOUT_DST"
    echo "✅ Moved $ABOUT_SRC -> $ABOUT_DST"
  else
    cat > "$ABOUT_DST" <<'MD'
# About This Plan

*(Placeholder page; replace with your real content.)*
MD
    echo "ℹ️ Created placeholder at $ABOUT_DST"
  fi
fi

# Find "nav:" start and the next top-level key after it (if any)
nav_start=$(awk '/^nav:[[:space:]]*$/ {print NR; exit}' "$MK")
if [[ -z "${nav_start:-}" ]]; then
  # No nav at all; we will inject one at the top of the file
  nav_start=0
  next_key=0
else
  next_key=$(awk -v s="$nav_start" 'NR>s && /^[A-Za-z0-9_]+:[[:space:]]*$/ {print NR; exit}' "$MK")
  if [[ -z "${next_key:-}" ]]; then
    next_key=$(( $(wc -l < "$MK") + 1 ))
  fi
fi

# Head = before nav; Tail = after nav block
if (( nav_start > 1 )); then
  sed -n "1,$((nav_start-1))p" "$MK" > _head.yml
else
  : > _head.yml
fi
sed -n "$next_key,\$p" "$MK" > _tail.yml

# Build a clean nav (adjust paths to your structure as needed)
cat > _nav.yml <<'YML'
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
YML

# Stitch new file
cat _head.yml _nav.yml _tail.yml > mkdocs.yml.new && mv mkdocs.yml.new "$MK"
rm -f _head.yml _tail.yml _nav.yml

echo "✅ Wrote a clean nav into mkdocs.yml"
echo "🚀 Now run: mkdocs serve"
