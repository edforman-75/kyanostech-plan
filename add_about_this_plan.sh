#!/usr/bin/env bash
# Adds "About This Plan" between Home and Executive Summary in MkDocs

set -euo pipefail

# --- Config (override by passing a different source path as $1) ---
SRC="${1:-$HOME/Downloads/about_this_plan_markdown.md}"
DOCS_DIR="docs"
DEST_BASENAME="about-this-plan.md"
DEST_PATH="$DOCS_DIR/$DEST_BASENAME"
MKDOCS_YML="mkdocs.yml"
NAV_LABEL="About This Plan"

# --- Preconditions ---
[[ -f "$MKDOCS_YML" ]] || { echo "❌ Run from repo root (missing $MKDOCS_YML)."; exit 1; }
[[ -f "$SRC" ]] || { echo "❌ Source not found: $SRC"; exit 1; }

# --- Move/Rename into docs/ (with backup if replacing) ---
mkdir -p "$DOCS_DIR"
if [[ -f "$DEST_PATH" ]]; then
  cp "$DEST_PATH" "${DEST_PATH%.md}.bak-$(date +%Y%m%d-%H%M%S).md"
fi
mv -f "$SRC" "$DEST_PATH"
echo "✅ Placed content at $DEST_PATH"

# --- Update nav (insert after Home, or before Executive Summary as fallback) ---
if grep -q "$DEST_BASENAME" "$MKDOCS_YML"; then
  echo "ℹ️ Nav already references $DEST_BASENAME; skipping nav edit."
else
  cp "$MKDOCS_YML" "${MKDOCS_YML}.bak"

  awk -v dest="$DEST_BASENAME" -v label="$NAV_LABEL" '
    BEGIN { added=0; seenAbout=0 }
    {
      line=$0
      # If we ever find our entry (defensive), mark seen
      if (match(line, dest)) { seenAbout=1 }

      # Primary rule: insert *after* a Home line (any filename)
      if (!added && match(line, /^[[:space:]]*-[[:space:]]*Home:[[:space:]]*[[:graph:]]+[[:space:]]*$/)) {
        print line
        print "  - " label ": " dest
        added=1
        next
      }

      # Fallback rule: insert *before* Executive Summary if we didn’t hit Home
      if (!added && match(line, /^[[:space:]]*-[[:space:]]*Executive Summary:[[:space:]]*[[:graph:]]+[[:space:]]*$/)) {
        print "  - " label ": " dest
        added=1
      }

      print line
    }
    END {
      if (!added && !seenAbout) {
        # Last-resort: append at end of file with a hint
        print ""                                >> "/dev/stderr"
        print "⚠️ Could not locate Home or Executive Summary in mkdocs.yml; appending to end." >> "/dev/stderr"
        print "  - " label ": " dest
      }
    }
  ' "$MKDOCS_YML" > "${MKDOCS_YML}.tmp"

  mv "${MKDOCS_YML}.tmp" "$MKDOCS_YML"
  echo "✅ Updated nav in $MKDOCS_YML"
fi

# --- Stage with git (optional) ---
if command -v git >/dev/null 2>&1; then
  git add "$DEST_PATH" "$MKDOCS_YML" || true
  git status --short || true
  echo "✅ Staged changes. Commit with:"
  echo "git commit -m \"Add ‘About This Plan’ page between Home and Executive Summary\""
fi

echo "🚀 Preview with: mkdocs serve"
