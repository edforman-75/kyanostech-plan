#!/usr/bin/env bash
set -euo pipefail

WROOT="Kyanos Business Plan"
WDOCS="$WROOT/docs"
mkdir -p "$WDOCS" backups

cp mkdocs.yml "backups/mkdocs.yml.$(date +%Y%m%d_%H%M%S).bak"

# 1) Collect all files currently referenced in nav:
nav_files_tmp="$(mktemp)"
awk '
  BEGIN{in_nav=0}
  /^nav:/ {in_nav=1; next}
  /^[^[:space:]-]/ && in_nav==1 {in_nav=0}
  in_nav==1 && $0 ~ /\.md[[:space:]]*$/ {
    if (match($0,/[^": ]+\.md/)) print substr($0,RSTART,RLENGTH)
  }
' mkdocs.yml | sort -u > "$nav_files_tmp"

# 2) Find appendix candidates under docs/
appendix_list_tmp="$(mktemp)"
find docs -maxdepth 1 -type f -name 'ky-appendix-*.md' ! -name '*footnotes-methodology*' -print \
  | sed -E 's!.*/(.*)\.md$!\1!' \
  | sort -u > "$appendix_list_tmp"

# If none, exit cleanly
if [ ! -s "$appendix_list_tmp" ]; then
  echo "No appendix files found."
  exit 0
fi

# 3) Determine which base names are NOT already in nav
need_tmp="$(mktemp)"
while IFS= read -r base; do
  canonical="${base}.md"
  if ! grep -qx "$canonical" "$nav_files_tmp"; then
    echo "$base" >> "$need_tmp"
  fi
done < "$appendix_list_tmp"

if [ ! -s "$need_tmp" ]; then
  echo "All appendices already in nav."
  exit 0
fi

# Helper: pick latest file for a base using ls -t
pick_latest() {
  base="$1"
  # shellcheck disable=SC2046
  set +e
  latest="$(ls -1t docs/"$base"* 2>/dev/null | grep -E '\.md$' | head -n1)"
  rc=$?
  set -e
  if [ $rc -ne 0 ] || [ -z "${latest:-}" ]; then
    return 1
  fi
  printf '%s\n' "$latest"
}

# Helper: extract title from first H1
title_from_h1() {
  awk '/^# /{sub(/^# /,""); print; exit}' "$1"
}

# 4) Insert entries under nav: (append just after the 'nav:' line)
ins_at="$(awk 'BEGIN{ln=0}/^nav:/{ln=NR}END{print ln}' mkdocs.yml)"
if [ "$ins_at" = "0" ]; then
  echo "Missing nav: in mkdocs.yml"; exit 1
fi

tmp_yaml="$(mktemp)"
awk -v ln="$ins_at" 'NR<=ln{print}' mkdocs.yml > "$tmp_yaml"
echo "" >> "$tmp_yaml"

added_any=0
while IFS= read -r base; do
  latest="$(pick_latest "$base" || true)"
  [ -n "${latest:-}" ] || continue
  canonical="$(basename "$base").md"
  # Copy latest into canonical name if canonical missing
  [ -f "docs/$canonical" ] || cp "$latest" "docs/$canonical"
  # Title from H1 or fallback to filename prettified
  title="$(title_from_h1 "docs/$canonical")"
  [ -n "$title" ] || title="$(echo "$canonical" | sed -E 's/[-_]/ /g; s/\.md$//')"
  echo "  - $title: $canonical" >> "$tmp_yaml"
  # Also copy into the working directory mirror
  cp "docs/$canonical" "$WDOCS/"
  added_any=1
done < "$need_tmp"

awk 'NR>'"$ins_at"'{print}' mkdocs.yml >> "$tmp_yaml"
mv "$tmp_yaml" mkdocs.yml

if [ "$added_any" = "1" ]; then
  echo "Updated mkdocs.yml and copied new appendices into \"$WDOCS\"."
else
  echo "Nothing new added."
fi
