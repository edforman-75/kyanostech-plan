#!/usr/bin/env bash
set -euo pipefail

APPENDIX="docs/ky-appendix-footnotes-methodology.md"

# upsert_footnote <slug> "<markdown content>"
# Example: upsert_footnote zero-click-2025 "Search Engine Land… <https://…>"
upsert_footnote() {
  local slug="$1"; shift
  local body="$*"

  # Ensure Appendix file exists with heading
  if [[ ! -f "$APPENDIX" ]]; then
    mkdir -p "$(dirname "$APPENDIX")"
    cat > "$APPENDIX" <<'EOF'
# Appendix – Footnotes & Methodology

All numbered citations from the plan are consolidated here in order of appearance.

---

EOF
  fi

  # If slug exists, replace; else append
  if grep -q "^\[\^${slug}\]:" "$APPENDIX"; then
    # Replace the whole definition line (single-line footnotes by convention)
    gsed -i "s#^\[\^${slug}\]:.*#\[\^${slug}\]: ${body//\//\\/}#g" "$APPENDIX" 2>/dev/null \
    || sed -i "" "s#^\[\^${slug}\]:.*#\[\^${slug}\]: ${body}#g" "$APPENDIX"
  else
    printf '\n[^%s]: %s\n' "$slug" "$body" >> "$APPENDIX"
  fi
}

# tag_placeholder <file> <slug>
# Replaces {{FN:slug}} in a section with a footnote call [^slug]
tag_placeholder() {
  local file="$1"
  local slug="$2"
  gsed -i "s/{{FN:${slug}}}/[\\^${slug}]/g" "$file" 2>/dev/null \
  || sed -i "" "s/{{FN:${slug}}}/[\\^${slug}]/g" "$file"
}

# inject_after <file> "<regex to match a sentence or phrase>" <slug>
# Puts a [^slug] immediately after the first regex match.
inject_after() {
  local file="$1" ; shift
  local pat="$1" ; shift
  local slug="$1"
  perl -0777 -i -pe "s/(${pat})/\$1[\\^${slug}]/s" "$file"
}

# replace_old_numeric <file> <oldnum> <slug>
# Converts legacy [1] style links (rendered as <a class="fn-ref">[1]</a> or literal [1])
replace_old_numeric() {
  local file="$1" ; shift
  local n="$1" ; shift
  local slug="$1"
  # Replace HTML anchors like <a ...>[1]</a>
  perl -0777 -i -pe "s#<a[^>]*>\\[${n}\\]</a>#[\\^${slug}]#g" "$file"
  # Replace plain [1] if present
  perl -0777 -i -pe "s#\\[${n}\\]#[\\^${slug}]#g" "$file"
}

case "${1:-}" in
  upsert) shift; upsert_footnote "$@";;
  tag) shift; tag_placeholder "$@";;
  inject) shift; inject_after "$@";;
  convert) shift; replace_old_numeric "$@";;
  *) cat <<EOU
Usage:
  bin/fn.sh upsert <slug> "<markdown footnote content>"
  bin/fn.sh tag <file> <slug>
  bin/fn.sh inject <file> "<regex>" <slug>
  bin/fn.sh convert <file> <old-number> <slug>

Examples:
  bin/fn.sh upsert zero-click-2025 "Search Engine Land, “Zero-click searches rise…” (Jun 5, 2025). <https://searchengineland.com/zero-click-searches-up-organic-clicks-down-456660>"
  bin/fn.sh convert docs/ky-problem-urgency.md 1 zero-click-2025
EOU
  ;;
esac
