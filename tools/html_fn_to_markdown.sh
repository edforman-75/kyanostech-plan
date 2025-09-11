#!/usr/bin/env bash
set -euo pipefail
ts=$(date +%Y%m%d_%H%M%S)
mkdir -p backups/html_fnfix
mapfile -t files < <(grep -RIlE 'class="fn-ref"|\.{2}/ky-appendix-footnotes-methodology' docs || true)
[ ${#files[@]} -eq 0 ] && exit 0
for f in "${files[@]}"; do
  base="$(basename "$f")"
  cp "$f" "backups/html_fnfix/${base}.pre_$ts.bak"
  perl -0777 -i -pe '
    s{<a\s+[^>]*class="fn-ref"[^>]*href="[^"#]*#fn-([^" >#]+)"[^>]*>.*?</a>}{ my $id=$1; "[^$id]" }ge;
    s{<span\s+[^>]*class="fn-ref"[^>]*data-fn="([^"]+)"[^>]*>.*?</span>}{ my $id=$1; "[^$id]" }ge;
  ' "$f"
  grep -qE '^##[[:space:]]*Footnotes' "$f" || printf "\n\n## Footnotes\n" >> "$f"
  refs=$(grep -oE '\[\^[^]]+\]' "$f" | sed -E 's/^\[\^([^]]+)\]$/\1/' | sort -u || true)
  defs=$(grep -oE '^\[\^[^]]+\]:' "$f" | sed -E 's/^\[\^([^]]+)\]:$/\1/' | sort -u || true)
  tmp1=$(mktemp); tmp2=$(mktemp)
  printf "%s\n" $refs | sort -u > "$tmp1"
  printf "%s\n" $defs | sort -u > "$tmp2"
  mis=$(comm -23 "$tmp1" "$tmp2" || true)
  rm -f "$tmp1" "$tmp2"
  if [ -n "${mis:-}" ]; then
    { for id in $mis; do printf "[^%s]: (placeholder – add citation)\n" "$id"; done; } >> "$f"
  fi
done
