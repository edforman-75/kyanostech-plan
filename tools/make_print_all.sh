#!/usr/bin/env bash
set -euo pipefail

out="docs/print-all.md"
tmp="$(mktemp)"

# Front matter and intro
cat > "$out" <<'EOF'
---
title: Print — Full Plan
---

<!-- This page concatenates all chapters in the order they appear in the nav. -->
<div class="print-only"><p><em>Tip:</em> In the print dialog, enable background graphics.</p></div>

EOF

# Pull page paths from mkdocs.yml nav (simple, robust parse)
# Matches lines like:  - Title: ky-solution-theory.md
awk '
  /^[[:space:]]*-[[:space:]]/ && /:[[:space:]]*[A-Za-z0-9_.\/-]+$/ {
    # last field should be the path
    path=$NF
    gsub(/"/, "", path)
    print path
  }
' mkdocs.yml > "$tmp"

# Append each existing doc in order, separated by a controlled page break
while IFS= read -r p; do
  [ -f "docs/$p" ] || continue
  echo "" >> "$out"
  echo "<div class=\"print-break\"></div>" >> "$out"
  echo "" >> "$out"
  # Optional heading showing which file started (comment out if not wanted)
  # echo "> Source: $p" >> "$out"
  cat "docs/$p" >> "$out"
  echo "" >> "$out"
done < "$tmp"

rm -f "$tmp"

echo "✅ Wrote $out"
