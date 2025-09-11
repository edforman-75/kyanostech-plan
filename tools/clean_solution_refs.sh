#!/usr/bin/env bash
set -euo pipefail
FILE="docs/ky-solution-theory.md"

# 1) Remove any lingering #fnref:... anchors
sed -E -i '' 's/\(#fnref:[^)]+\)//g' "$FILE"

# 2) Ensure the correct Markdown references exist in the body text
#    (remove dupes, then add if missing)

fix_ref () {
  local phrase="$1" id="$2"
  # drop any old duplicate
  sed -E -i '' "s/(${phrase})\\[\\^${id}\\]/\\1/I" "$FILE"
  # add ref back
  sed -E -i '' "s/${phrase}/\\0[\\^${id}]/I" "$FILE"
}

fix_ref '58\.5% of U\.S\. Google searches ended without a click' 'sol-sparktoro-zero-click-us-2024'
fix_ref '27\.2% of U\.S\. Google searches in March 2025 ended without a click' 'sol-zero-click-27-2-mar-2025'
fix_ref 'AI Overviews appeared on ~18% of all Google queries in March 2025' 'sol-pew-ai-overviews-2025'
fix_ref 'AI Overviews appeared on ~13\.14% of U\.S\. desktop queries' 'sol-semrush-ai-overviews-2025'

echo "✅ Cleaned refs in $FILE"
