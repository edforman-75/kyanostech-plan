#!/usr/bin/env bash
set -euo pipefail
declare -A defs
while IFS=$'\t' read -r id text || [ -n "${id:-}" ]; do
  [[ -z "${id:-}" || "${id:0:1}" = "#" ]] && continue
  defs["$id"]="$text"
done < tools/citations.tsv
for f in docs/*.md; do
  for id in "${!defs[@]}"; do
    perl -0777 -pe "s/\\[\\^$id\\]:\\s*\\(placeholder[^)]*\\)/[^$id]: ${defs[$id]//\//\\/}/m" -i "$f"
  done
done
echo "Applied citation texts from tools/citations.tsv"
