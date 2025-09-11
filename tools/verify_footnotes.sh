#!/usr/bin/env bash
set -euo pipefail
fail=0
shopt -s nullglob
for f in docs/*.md; do
  refs=$(grep -oE '\[\^[^]]+\]' "$f" | sed -E 's/^\[\^([^]]+)\]$/\1/' | sort -u || true)
  defs=$(grep -oE '^\[\^[^]]+\]:' "$f" | sed -E 's/^\[\^([^]]+)\]:$/\1/' | sort -u || true)
  t1=$(mktemp); t2=$(mktemp)
  printf "%s\n" $refs | sort -u > "$t1"
  printf "%s\n" $defs | sort -u > "$t2"
  mis=$(comm -23 "$t1" "$t2" || true)
  orf=$(comm -13 "$t1" "$t2" || true)
  rm -f "$t1" "$t2"
  if [[ -n "$mis$orf" ]]; then
    echo "⚠️  $f"
    [[ -n "$mis" ]] && echo "   missing: $mis"
    [[ -n "$orf" ]] && echo "   orphan:  $orf"
    fail=1
  fi
done
[[ $fail -eq 0 ]] && echo "✅ All footnotes paired" || exit 1
