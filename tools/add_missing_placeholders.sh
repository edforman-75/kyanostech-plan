#!/usr/bin/env bash
set -euo pipefail
ids=(fn-bm-margins-2028 fn-bm-arr-2028 sol-union-prob-2028)
for f in docs/*.md; do
  [[ -f "$f" ]] || continue
  need=0
  for id in "${ids[@]}"; do
    if grep -q "\[\^$id\]" "$f" && ! grep -qE "^\[\^$id\]:" "$f"; then
      need=1
    fi
  done
  [[ $need -eq 0 ]] && continue
  grep -qE "^##[[:space:]]*Footnotes" "$f" || printf "\n\n## Footnotes\n" >> "$f"
  for id in "${ids[@]}"; do
    if grep -q "\[\^$id\]" "$f" && ! grep -qE "^\[\^$id\]:" "$f"; then
      printf "[^%s]: (placeholder – add citation)\n" "$id" >> "$f"
      echo "added $id → $f"
    fi
  done
done
