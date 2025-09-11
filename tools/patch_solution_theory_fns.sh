#!/usr/bin/env bash
set -euo pipefail

FILE="docs/ky-solution-theory.md"

# 0) Remove any lingering (#fnref:...) anchors
#    (these are HTML/anchor leftovers Material warns about)
sed -E -i '' 's/\(#fnref:[^)]+\)//g' "$FILE"

# 1) Ensure Footnotes section exists
grep -qE '^[[:space:]]*##[[:space:]]+Footnotes[[:space:]]*$' "$FILE" || printf "\n\n## Footnotes\n\n" >> "$FILE"

# 2) Define/Update the four fine-grained notes
add_note () {
  local id="$1" text="$2"
  if grep -qE "^\[\^${id}\]:" "$FILE"; then
    # BSD sed in-place
    sed -E -i '' "s|^\[\^${id}\]:.*$|[^${id}]: ${text}|" "$FILE"
  else
    printf "[^%s]: %s\n" "$id" "$text" >> "$FILE"
  fi
}

add_note "sol-sparktoro-zero-click-us-2024" \
"SparkToro (2024) analysis of Similarweb panel data: **58.5% of U.S. Google searches ended without a click**. Source: SparkToro, “Zero-Click Searches” (2024)."

add_note "sol-zero-click-27-2-mar-2025" \
"Search Engine Land (Mar 2025) reporting Similarweb panel data: **27.2% of U.S. Google searches in March 2025 ended without a click**, up from 24.4% a year earlier."

add_note "sol-pew-ai-overviews-2025" \
"Pew Research Center (July 2025) field survey: **AI Overviews appeared on ~18% of all Google queries in March 2025**, and **~60% of U.S. adults encountered at least one Overview during the month**."

add_note "sol-semrush-ai-overviews-2025" \
"Semrush study (July 2025) of ~31M queries: **AI Overviews appeared on ~13.14% of U.S. desktop queries**."

# 3) Idempotent: add refs after the exact phrases (remove if already present, then add)
clean_add () {
  local phrase="$1" id="$2"
  # remove existing marker if already present
  sed -E -i '' "s/(${phrase})\\[\\^${id}\\]/\\1/gI" "$FILE"
  # add marker
  sed -E -i '' "s/${phrase}/\\0[\\^${id}]/I" "$FILE"
}

clean_add '58\.5%[[:space:]]+of[[:space:]]+U\.S\.[[:space:]]+Google[[:space:]]+searches[[:space:]]+ended[[:space:]]+without[[:space:]]+a[[:space:]]+click' 'sol-sparktoro-zero-click-us-2024'
clean_add '27\.2%[[:space:]]+in[[:space:]]+March[[:space:]]+2025' 'sol-zero-click-27-2-mar-2025'
clean_add 'majority[[:space:]]+of[[:space:]]+users[[:space:]]+encountered[[:space:]]+at[[:space:]]+least[[:space:]]+one[[:space:]]+AI[[:space:]]+Overview' 'sol-pew-ai-overviews-2025'
clean_add 'Overviews[[:space:]]+appear[[:space:]]+on[[:space:]]+roughly[[:space:]]+half[[:space:]]+of[[:space:]]+queries' 'sol-pew-ai-overviews-2025'

# Also pair Semrush with that "roughly half of queries" sentence
# (idempotent remove+add)
sed -E -i '' "s/(Overviews[[:space:]]+appear[[:space:]]+on[[:space:]]+roughly[[:space:]]+half[[:space:]]+of[[:space:]]+queries)\\[\\^sol-semrush-ai-overviews-2025\\]/\\1/I" "$FILE"
sed -E -i '' "s/(Overviews[[:space:]]+appear[[:space:]]+on[[:space:]]+roughly[[:space:]]+half[[:space:]]+of[[:space:]]+queries)/\\1[\\^sol-semrush-ai-overviews-2025]/I" "$FILE"

echo "✅ Patched ky-solution-theory.md footnotes and refs."
