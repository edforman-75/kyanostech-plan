#!/usr/bin/env bash
set -euo pipefail
shopt -s nullglob

# Usage: bash tools/convert_inline_to_md.sh docs/file1.md [docs/file2.md ...]
# Rewrites <sup class="fn-ref"><a href="#fn-...">…</a></sup>  ->  [^id]

for f in "$@"; do
  [ -f "$f" ] || continue
  perl -0777 -i -pe '
    s{
      <sup\s+class="fn-ref">\s*
      <a[^>]*?\s+href="#fn-([A-Za-z0-9_\-:]+)".*?>
      .*?
      </a>\s*
      </sup>
    }{[^\1]}gsx;
    s{
      <a[^>]*?\s+class="fn-ref"[^>]*?\s+href="#fn-([A-Za-z0-9_\-:]+)".*?>
      .*?
      </a>
    }{[^\1]}gsx;
  ' "$f"
  echo "converted: $f"
done
