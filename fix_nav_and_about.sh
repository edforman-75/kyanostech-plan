#!/usr/bin/env bash
set -euo pipefail

MK="mkdocs.yml"
DOCS="docs"
DEST="$DOCS/about-this-plan.md"
SRC_DEFAULT="$HOME/Downloads/about_this_plan_markdown.md"

[[ -f "$MK" ]] || { echo "❌ mkdocs.yml not found in this directory"; exit 1; }

# 0) Backup and remove any tabs (tabs break YAML)
cp "$MK" "$MK.bak.$(date +%Y%m%d-%H%M%S)"
expand -t 2 "$MK" > "$MK.tmp" && mv "$MK.tmp" "$MK"

# 1) Ensure docs/about-this-plan.md exists
mkdir -p "$DOCS"
if [[ ! -f "$DEST" ]]; then
  if [[ -f "$SRC_DEFAULT" ]]; then
    mv -f "$SRC_DEFAULT" "$DEST"
    echo "✅ Moved source from $SRC_DEFAULT -> $DEST"
  else
    # create a minimal placeholder so nav doesn’t 404
    cat > "$DEST" <<'MD'
# About This Plan

*(Placeholder page created automatically. Replace with your real content.)*
MD
    echo "ℹ️ Created placeholder at $DEST (replace with your content when ready)."
  fi
fi

# 2) Rewrite ONLY the nav block with correct indentation,
#    inserting About This Plan after Home if not already present.
awk '
  BEGIN{
    in_nav=0; done=0; added=0; about_present=0;
  }
  # detect a top-level key (column 1, letters/underscores, then :)
  function is_top_key(s) { return match(s, /^[A-Za-z0-9_]+:[[:space:]]*$/); }

  # normalize a list line: strip leading spaces -> ensure two-space indent before "-"
  function norm_line(s,   t) {
    sub(/^[[:space:]]+/, "", s);
    if (s ~ /^- /) { t=s; } else { t=s; }
    return "  " t;
  }

  {
    if (!in_nav && $0 ~ /^nav:[[:space:]]*$/) {
      print "nav:";
      in_nav=1;
      next;
    }

    if (in_nav) {
      # Stop at next top-level key
      if (is_top_key($0)) {
        if (!done) {
          done=1;
        }
        in_nav=0;
        print $0;     # print the new top-level key we just encountered
        next;
      }

      # Keep comments/blank lines inside nav as-is (but keep them indented)
      if ($0 ~ /^[[:space:]]*$/) { print ""; next; }
      if ($0 ~ /^[[:space:]]*#/) { sub(/^[[:space:]]*/, "  ", $0); print; next; }

      # Normalize list item indentation
      line=$0
      sub(/^[[:space:]]+/, "", line)
      if (line ~ /^- /) {
        # detect About presence
        if (line ~ /about-this-plan\.md/) { about_present=1; }
        # print Home and inject About (if missing) right after it
        if (line ~ /^- +Home: +index\.md[[:space:]]*$/) {
          print "  " line
          if (!about_present && !added) {
            print "  - About This Plan: about-this-plan.md"
            added=1
          }
          next
        }
        print "  " line
        next
      } else {
        # Non-list content inside nav (e.g., nested dict) – indent safely
        print "  " line
        next
      }
    }

    # Outside nav, just print
    print
  }
  END{
    if (in_nav && !done) {
      # nav reached EOF; ensure About added if missing
      if (!about_present && !added) {
        print "  - About This Plan: about-this-plan.md"
      }
    }
  }
' "$MK" > "$MK.tmp"

mv "$MK.tmp" "$MK"
echo "✅ mkdocs.yml nav normalized and updated."

# 3) Quick validation
python3 - <<'PY'
import sys, yaml
with open("mkdocs.yml") as f:
    cfg=yaml.safe_load(f)
assert isinstance(cfg.get("nav"), list), "nav must be a list"
print("✅ Basic YAML check passed (nav is a list).")
PY

echo "🚀 Try: mkdocs serve"
