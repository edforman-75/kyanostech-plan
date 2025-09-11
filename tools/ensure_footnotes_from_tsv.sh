#!/usr/bin/env bash
set -euo pipefail
shopt -s nullglob

TSV="${TSV:-tools/citations.tsv}"

# Usage: TSV=tools/citations.tsv bash tools/ensure_footnotes_from_tsv.sh docs/file1.md [...]

declare -A MAP
while IFS=$'\t' read -r id text || [ -n "${id:-}" ]; do
  [[ -z "${id// }" || "${id:0:1}" == "#" ]] && continue
  MAP["$id"]="$text"
done < "$TSV"

add_defs() {
  local file="$1"
  local need=()
  # collect refs present in the file
  while IFS= read -r id; do
    [[ -z "$id" ]] && continue
    # if definition missing, queue it
    if ! grep -qE "^\[\^\Q${id}\E\]:" "$file"; then
      need+=("$id")
    fi
  done < <(grep -oE '\[\^[^]]+\]' "$file" | sed -E 's/^\[\^([^]]+)\]$/\1/' | sort -u || true)

  [[ ${#need[@]} -eq 0 ]] && return 0

  # ensure Footnotes section exists
  if ! grep -qE '^##[[:space:]]+Footnotes\b' "$file"; then
    printf '\n\n## Footnotes\n' >> "$file"
  fi

  for id in "${need[@]}"; do
    text="${MAP[$id]:-(placeholder) definition not yet supplied}"
    printf '[^%s]: %s\n' "$id" "$text" >> "$file"
    echo "added: $file  [^$id]"
  done
}

for f in "$@"; do
  [ -f "$f" ] || continue
  add_defs "$f"
done
