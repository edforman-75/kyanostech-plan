#!/usr/bin/env bash
set -euo pipefail

FILE="docs/ky-solution-theory.md"

add_or_update_note() {
  local id="$1" txt="$2"
  if ! grep -qE '(^|\n)##[[:space:]]*Footnotes' "$FILE"; then
    printf "\n\n## Footnotes\n" >> "$FILE"
  fi
  if grep -qE "^\[\^${id}\]:" "$FILE"; then
    perl -0777 -pe 's/^\[\^'"$id"'\]:.*$/[^'"$id"']: '"$(printf '%s' "$txt" | sed "s/[&/\]/\\&/g")"'/m' -i "$FILE"
  else
    printf "[^%s]: %s\n" "$id" "$txt" >> "$FILE"
  fi
}

note_sparktoro='SparkToro (2024) analysis of Similarweb panel data: **58.5% of U.S. Google searches ended without a click**. Source: SparkToro, “Zero-Click Searches” (2024).'
note_zero27='Search Engine Land (Mar 2025) reporting Similarweb panel data: **27.2% of U.S. Google searches in March 2025 ended without a click**, up from 24.4%% a year earlier.'
note_pew='Pew Research Center (July 2025) field survey: **AI Overviews appeared on ~18% of all Google queries in March 2025**, and **~60% of U.S. adults encountered at least one Overview during the month**.'
note_semrush='Semrush study (July 2025) of ~31M queries: **AI Overviews appeared on ~13.14% of U.S. desktop queries**.'

add_or_update_note "sol-sparktoro-zero-click-us-2024" "$note_sparktoro"
add_or_update_note "sol-zero-click-27-2-mar-2025" "$note_zero27"
add_or_update_note "sol-pew-ai-overviews-2025" "$note_pew"
add_or_update_note "sol-semrush-ai-overviews-2025" "$note_semrush"

perl -0777 -pe '
  s/(58\.5%\s+of\s+U\.S\.\s+Google\s+searches\s+ended\s+without\s+a\s+click)(?!\]\))/\1[^\(sol-sparktoro-zero-click-us-2024\)]/i;
  s/(27\.2%\s+in\s+March\s+2025)(?!\]\))/\1[^\(sol-zero-click-27-2-mar-2025\)]/i;
  s/(majority\s+of\s+users\s+encountered\s+at\s+least\s+one\s+AI\s+Overview)(?!\]\))/\1[^\(sol-pew-ai-overviews-2025\)]/i;
  s/(Overviews\s+appear\s+on\s+roughly\s+half\s+of\s+queries)(?!\]\))/\1[^\(sol-pew-ai-overviews-2025\)][^\(sol-semrush-ai-overviews-2025\)]/i;
' -i "$FILE"

perl -0777 -pe 's/\[\^\(([^)]+)\)\]/[^\1]/g' -i "$FILE"

echo "✅ Inserted fine-grained footnotes and references in $FILE"
