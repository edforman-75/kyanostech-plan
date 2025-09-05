#!/usr/bin/env bash
set -euo pipefail

DOCS="docs"
EXEC="$DOCS/sections/executive-summary/index.md"
HOME="$DOCS/index.md"
ABOUT_REL="about-this-plan/index.md"              # site URL path
ABOUT_MD="about-this-plan.md"                     # nav/md path

[[ -f "$EXEC" ]] || { echo "❌ Missing $EXEC"; exit 1; }
[[ -f "$HOME" ]] || { echo "❌ Missing $HOME"; exit 1; }

# -------- 1) Extract source block from Exec Summary --------
TMP_SRC="$(mktemp)"

# Prefer explicit markers
if awk '/<!-- HOME-BLOCK:START -->/{f=1;next} /<!-- HOME-BLOCK:END -->/{f=0} f' "$EXEC" > "$TMP_SRC" && [[ -s "$TMP_SRC" ]]; then
  echo "✅ Using marker block from Executive Summary."
else
  # Fallback: top until first level-2 heading
  awk '
    BEGIN{capture=1}
    NR==1{print; next}
    /^##[[:space:]]+/ { if(capture){ capture=0 } }
    capture
  ' "$EXEC" > "$TMP_SRC"
  echo "ℹ️ Using fallback: from top of Executive Summary to first \"##\"."
fi

# Ensure About-link line present at end of block (dedupe-safe)
if ! grep -q '\[About This Plan\]' "$TMP_SRC"; then
  printf '\n**See also:** [About This Plan](/%s)\n' "$ABOUT_REL" >> "$TMP_SRC"
fi

# -------- 2) Patch Home between DEST markers (create if absent) --------
TMP_HOME="$(mktemp)"

if grep -q '<!-- HOME-BLOCK:DEST-START -->' "$HOME"; then
  # Replace existing block
  awk -v src="$TMP_SRC" '
    BEGIN{inblock=0}
    /<!-- HOME-BLOCK:DEST-START -->/ {print; while((getline line < src)>0) print line; inblock=1; next}
    /<!-- HOME-BLOCK:DEST-END -->/ {print; inblock=0; next}
    !inblock {print}
  ' "$HOME" > "$TMP_HOME"
else
  # Insert after H1 (first line starting with # )
  inserted=0
  while IFS= read -r line; do
    echo "$line" >> "$TMP_HOME"
    if [[ $inserted -eq 0 && "$line" =~ ^#[[:space:]] ]]; then
      {
        echo ""
        echo "<!-- HOME-BLOCK:DEST-START -->"
        cat "$TMP_SRC"
        echo "<!-- HOME-BLOCK:DEST-END -->"
        echo ""
      } >> "$TMP_HOME"
      inserted=1
    fi
  done < "$HOME"

  if [[ $inserted -eq 0 ]]; then
    # No H1? append at top
    {
      echo "<!-- HOME-BLOCK:DEST-START -->"
      cat "$TMP_SRC"
      echo "<!-- HOME-BLOCK:DEST-END -->"
      echo ""
      cat "$HOME"
    } > "$TMP_HOME"
  fi
fi

# -------- 3) Fix links and About-doc references on Home --------
# changelog/ -> changelog/index.md
perl -0777 -i -pe 's#\]\(changelog/\)#](changelog/index.md)#g' "$TMP_HOME"

# if using md path anywhere for About, allow both styles; normalize to site path for safety
perl -0777 -i -pe 's#\]\((?:about-this-plan\.md|about-this-plan/?)\)#](/about-this-plan/)#g' "$TMP_HOME"

mv "$TMP_HOME" "$HOME"
rm -f "$TMP_SRC"

echo "✅ Home updated from Executive Summary."
echo "🚀 Preview: mkdocs serve -a 127.0.0.1:8010"
