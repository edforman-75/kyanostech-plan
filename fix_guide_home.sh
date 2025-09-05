#!/usr/bin/env bash
set -euo pipefail

DOCS="docs"
EXEC="$DOCS/sections/executive-summary/index.md"
HOME="$DOCS/index.md"
MK="mkdocs.yml"

[[ -f "$EXEC" ]] || { echo "❌ Missing $EXEC"; exit 1; }
[[ -f "$HOME" ]] || { echo "❌ Missing $HOME"; exit 1; }
[[ -f "$MK"   ]] || { echo "❌ Missing $MK";   exit 1; }

# Backups
cp "$HOME" "$HOME.bak.$(date +%Y%m%d-%H%M%S)" 2>/dev/null || true
cp "$EXEC" "$EXEC.bak.$(date +%Y%m%d-%H%M%S)"
cp "$MK"   "$MK.bak.$(date +%Y%m%d-%H%M%S)"

# Normalize NBSP to space (can break regex matches)
perl -CSD -pe 's/\x{00A0}/ /g' "$EXEC" > /tmp/exec_norm.md

# Find the Guide section start line (H2)
start_line="$(grep -nE '^[[:space:]]*##[[:space:]]+Guide to This Plan[[:space:]]*$' /tmp/exec_norm.md | head -1 | cut -d: -f1 || true)"
if [[ -z "${start_line:-}" ]]; then
  echo "❌ Could not find the '## Guide to This Plan' section."
  echo "Headings present:"
  grep -nE '^[[:space:]]*##[[:space:]]+' /tmp/exec_norm.md || true
  exit 1
fi

# Find next H2 after the Guide section; if none, use EOF+1
next_line="$(awk -v s="$start_line" 'NR>s && $0 ~ /^[[:space:]]*##[[:space:]]+/ {print NR; exit}' /tmp/exec_norm.md || true)"
if [[ -z "${next_line:-}" ]]; then
  next_line=$(( $(wc -l < /tmp/exec_norm.md) + 1 ))
fi

# Extract the section CONTENT (lines between start and next H2)
awk -v s="$start_line" -v e="$next_line" 'NR>s && NR<e {print}' /tmp/exec_norm.md > /tmp/guide_block.md

if [[ ! -s /tmp/guide_block.md ]]; then
  echo "❌ Guide section found but empty after extraction (start=$start_line, next=$next_line)."
  exit 1
fi

# Make Home = H1 + extracted content (deleting previous Home text)
{
  echo "# Guide to This Plan"
  echo
  cat /tmp/guide_block.md
  echo
} > "$HOME"

# Fix links for Home’s root location
perl -0777 -i -pe 's#\]\(\.\./#](sections/#g'                           "$HOME"   # ../X -> sections/X
perl -0777 -i -pe 's#\]\(\.\./\.\./appendices/#](appendices/#g'         "$HOME"   # ../../appendices -> appendices
perl -0777 -i -pe 's#\]\(changelog/\)#](changelog/index.md)#g'          "$HOME"   # changelog/ -> changelog/index.md
perl -0777 -i -pe 's#\]\((?:about-this-plan(?:\.md|/)?|/about-this-plan/?|about_this_plan_markdown\.md)\)#](/about-this-plan/)#g' "$HOME"
# Clean orphan footnotes / backrefs that may have come with the block
perl -0777 -i -pe 's/\[\^\d+\]//g'                                      "$HOME"
perl -0777 -i -pe 's/^\[\^\d+\]:.*\n?//mg'                               "$HOME"
perl -0777 -i -pe 's/\[[^\]]+\]\(#fnref:\d+\)//g'                       "$HOME"
perl -0777 -i -pe 's/\(#fnref:\d+\)//g'                                 "$HOME"
perl -0777 -i -pe 's/\n{3,}/\n\n/g'                                     "$HOME"

# Remove the section from Executive Summary so it’s not duplicated
awk -v s="$start_line" -v e="$next_line" '(NR<s || NR>=e) {print}' /tmp/exec_norm.md > "$EXEC"

# Rename the nav label so the first item reads “Guide to This Plan”
perl -0777 -i -pe 's/^(\s*)-\s*Home:\s*index\.md\s*$/\1- Guide to This Plan: index.md/m' "$MK"

echo "✅ Home replaced with Guide section, links fixed, Exec Summary cleaned, nav label updated."
echo "🚀 Preview locally with: mkdocs serve -a 127.0.0.1:8010"
