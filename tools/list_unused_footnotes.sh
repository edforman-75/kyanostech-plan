#!/bin/bash
set -euo pipefail
shopt -s nullglob

any=0

for f in docs/*.md; do
  t_refs="$(mktemp)"; t_defs="$(mktemp)"

  # collect refs like [^id]
  grep -oE '\[\^[^]]+\]' "$f" | sed -E 's/^\[\^([^]]+)\]$/\1/' | sort -u > "$t_refs" || true

  # collect defs like
  # [^id]:
  grep -oE '^\[\^[^]]+\]:' "$f" | sed -E 's/^\[\^([^]]+)\]:$/\1/' | sort -u > "$t_defs" || true

  # defs that are never referenced (orphans)
  ORPH="$(comm -13 "$t_refs" "$t_defs" || true)"

  rm -f "$t_refs" "$t_defs"

  if [[ -n "$ORPH" ]]; then
    any=1
    echo "---- $f"
    echo "$ORPH" | sed 's/^/  unused: /'
  fi
done

if [[ $any -eq 0 ]]; then
  echo "✅ No unused footnotes found in any page."
fi
