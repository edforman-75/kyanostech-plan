#!/usr/bin/env bash
set -euo pipefail

tsv="tools/citations.tsv"
[ -f "$tsv" ] || { echo "Missing $tsv"; exit 1; }

# read id<TAB>text lines and apply to any file that references [^id]
while IFS=$'\t' read -r id text; do
  # skip blank or comment lines
  [ -n "${id// }" ] || continue
  case "$id" in \#*) continue ;; esac
  [ -n "${text// }" ] || continue

  # escape for perl replacement
  esc_text=$(printf '%s' "$text" | sed -e 's/[\/&]/\\&/g')

  for f in docs/*.md; do
    [ -f "$f" ] || continue
    if grep -q "\[\^$id\]" "$f"; then
      if grep -qE "^\[\^$id\]:" "$f"; then
        perl -0777 -pe 's/^\[\^'"$id"'\]:.*$/[^'"$id"']: '"$esc_text"'/m' -i "$f"
      else
        grep -qE "^##[[:space:]]*Footnotes" "$f" || printf "\n\n## Footnotes\n" >> "$f"
        printf "[^%s]: %s\n" "$id" "$text" >> "$f"
      fi
    fi
  done
done < "$tsv"

echo "✅ Applied citation texts from $tsv"
