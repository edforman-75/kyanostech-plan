#!/usr/bin/env bash
set -euo pipefail
shopt -s nullglob

fail=0
for f in docs/*.md; do
  # refs like [^id]
  refs=$(grep -hoE '\[\^[^]]+\]' "$f" | sed -E 's/^\[\^([^]]+)\]$/\1/' | sort -u || true)
  [[ -z "$refs" ]] && continue

  # defs like [^id]:
  # (ignore math lines that contain carets, they aren’t footnotes)
  defs=$(grep -hoE '^\[\^[^]]+\]:' "$f" | sed -E 's/^\[\^([^]]+)\]:$/\1/' | sort -u || true)

  mis=$(comm -23 <(printf "%s\n" $refs | sort -u) <(printf "%s\n" $defs | sort -u) || true)
  orf=$(comm -13 <(printf "%s\n" $refs | sort -u) <(printf "%s\n" $defs | sort -u) || true)

  if [[ -n "${mis}${orf}" ]]; then
    echo "⚠️  $f"
    [[ -n "$mis" ]] && echo "   - missing defs for: $mis"
    [[ -n "$orf" ]] && echo "   - orphan defs:      $orf"
    fail=1
  fi
done

[[ $fail -eq 0 ]] && echo "✅ All footnote refs resolve within their own files."
