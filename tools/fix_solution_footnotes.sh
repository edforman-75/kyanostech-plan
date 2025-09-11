#!/usr/bin/env bash
set -euo pipefail

FILE="docs/ky-solution-theory.md"

# 1) Replace the first bare [^] with our 2028 forecast note
# 2) Replace any remaining bare [^] on this page with the coverage/probability note
tmp="$(mktemp)"
awk '
  BEGIN{first=1}
  {
    line=$0
    while (match(line, /\[\^\]/)) {
      if (first) {
        line = substr(line,1,RSTART-1) "[^sol-2028-competition-outcome]" substr(line,RSTART+3)
        first=0
      } else {
        line = substr(line,1,RSTART-1) "[^sol-prob-2028]" substr(line,RSTART+3)
      }
    }
    print line
  }
' "$FILE" > "$tmp" && mv "$tmp" "$FILE"

# Ensure Footnotes section header exists
grep -qE '^\s*##\s+Footnotes\s*$' "$FILE" || printf "\n\n## Footnotes\n\n" >> "$FILE"

# Add (or update) the two footnote definitions
add_or_update() {
  local id="$1" text="$2"
  if grep -qE "^\[\^${id}\]:" "$FILE"; then
    # update in place (single-line def assumed)
    perl -0777 -pe "s/^\\[\\^${id}\\]:.*\$/[^${id}]: ${text}/m" -i "$FILE"
  else
    printf "[^%s]: %s\n" "$id" "$text" >> "$FILE"
  fi
}

note1='Directional forecast. Zero-click behavior and AI answers are already shrinking traditional link-clicking: Similarweb panel data (reported by Search Engine Land) shows **27.2% of U.S. Google searches in March 2025 ended without a click** (up from 24.4% a year earlier). Pew’s March 2025 field study found **AI Overviews appeared for ~18% of queries and 60% of U.S. adults encountered at least one Overview that month**. Combined with rising assistant adoption, multiple industry trackers expect AI answers to mediate a large share of discovery by the late-2020s; we therefore treat a **major, possibly dominant, AI-mediated share by 2028** as a planning assumption, to be updated with new data. Sources: Search Engine Land (Mar 2025, Similarweb), Pew Research Center (Jul 2025), Semrush study (Jul 2025).'

note2='As of 2025, **AI Overviews show up on ~13% of U.S. desktop queries** (Semrush, 31M queries; Jul 2025) and **~18% of all queries in March 2025** (Pew Research Center). **60% of U.S. adults saw at least one Overview that month.** These figures indicate rapid, broadening coverage of AI answers. Sources: Semrush (2025 AI Overviews study), Pew Research Center (Jul 2025).'

add_or_update "sol-2028-competition-outcome" "$note1"
add_or_update "sol-prob-2028" "$note2"

# 3) Rebuild and simple checks
./.venv/bin/mkdocs build >/dev/null

echo "—— checks"
grep -n '^\[\^sol-2028-competition-outcome\]:' "$FILE"
grep -n '^\[\^sol-prob-2028\]:'            "$FILE"
grep -RIn 'class="fn-ref"' docs/ky-solution-theory.md || echo "✅ footnote refs are Markdown (no HTML anchors)"
