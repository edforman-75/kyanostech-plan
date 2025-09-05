#!/usr/bin/env bash
set -euo pipefail

DOCS="docs"
EXEC="$DOCS/sections/executive-summary/index.md"
HOME="$DOCS/index.md"

[[ -f "$EXEC" ]] || { echo "❌ Missing $EXEC"; exit 1; }
[[ -f "$HOME" ]] || { echo "❌ Missing $HOME"; exit 1; }

# 0) Backups
cp "$HOME" "$HOME.bak.$(date +%Y%m%d-%H%M%S)"
cp "$EXEC" "$EXEC.bak.$(date +%Y%m%d-%H%M%S)"

# 1) Write Home = just the Guide section
awk '
  BEGIN{keep=0}
  /^## Guide to This Plan/{keep=1}
  keep{print}
' "$EXEC" > "$HOME"

# 2) Remove the Guide from Executive Summary
awk '
  BEGIN{skip=0}
  /^## Guide to This Plan/{skip=1; next}
  skip==0{print}
' "$EXEC" > "$EXEC.tmp" && mv "$EXEC.tmp" "$EXEC"

# 3) Fix links in Home (now rooted at docs/)
#    ../X/...               -> sections/X/...
#    ../../appendices/...   -> appendices/...
#    changelog/             -> changelog/index.md
#    About This Plan        -> /about-this-plan/
#    Remove orphan footnotes and #fnref backrefs
perl -0777 -i -pe 's#\]\(\.\./#](sections/#g'                           "$HOME"
perl -0777 -i -pe 's#\]\(\.\./\.\./appendices/#](appendices/#g'         "$HOME"
perl -0777 -i -pe 's#\]\(changelog/\)#](changelog/index.md)#g'          "$HOME"
perl -0777 -i -pe 's#\]\((?:about-this-plan(?:\.md|/)?|/about-this-plan/?|about_this_plan_markdown\.md)\)#](/about-this-plan/)#g' "$HOME"
# footnote refs like [^1] and definitions like [^1]:
perl -0777 -i -pe 's/\[\^\d+\]//g'                                      "$HOME"
perl -0777 -i -pe 's/^\[\^\d+\]:.*\n?//mg'                               "$HOME"
# backrefs like [↩︎](#fnref:1) or any text linked to #fnref:n
perl -0777 -i -pe 's/\[[^\]]+\]\(#fnref:\d+\)//g'                       "$HOME"
perl -0777 -i -pe 's/\(#fnref:\d+\)//g'                                 "$HOME"
# tidy extra blank lines
perl -0777 -i -pe 's/\n{3,}/\n\n/g'                                     "$HOME"

echo "✅ Moved Guide to Home and fixed links."

# 4) Quick build sanity (optional)
if command -v mkdocs >/dev/null 2>&1; then
  mkdocs build
else
  echo "ℹ️ mkdocs not on PATH; skipping build."
fi
