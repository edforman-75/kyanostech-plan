#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

usage(){ echo "Usage: $0 --source \"/abs/path/to/final plan sections\" [--include-pdf]"; exit 1; }

SOURCE=""; INCLUDE_PDF=0
while [[ $# -gt 0 ]]; do case "$1" in
  --source) SOURCE="$2"; shift 2 ;;
  --include-pdf) INCLUDE_PDF=1; shift ;;
  *) usage ;;
esac; done

[[ -n "${SOURCE}" && -d "${SOURCE}" ]] || { echo "❌ Source not found: ${SOURCE:-<empty>}"; exit 1; }

UPDATED=0; SKIPPED=0; updated_files=()

copy_one(){  # copy if src is newer or dest missing
  local src="$1" dst="$2" base; base="$(basename "$src")"; mkdir -p "$dst"
  if [[ -f "$dst/$base" && "$src" -ot "$dst/$base" ]]; then ((SKIPPED++))
  else cp -f "$src" "$dst/$base"; ((UPDATED++)); updated_files+=("$base"); fi
}

# Markdown
for p in "${SOURCE}"/*.md; do [[ -e "$p" ]] && copy_one "$p" docs; done
# PDFs (optional)
if [[ $INCLUDE_PDF -eq 1 ]]; then
  mkdir -p docs/assets/downloads
  for p in "${SOURCE}"/*.pdf; do [[ -e "$p" ]] && copy_one "$p" docs/assets/downloads; done
fi

# Log (timestamp + counts + file list)
ts="$(date '+%Y-%m-%d %H:%M')"
{
  echo "${ts} | Updated: ${UPDATED} | Skipped: ${SKIPPED} | Source: ${SOURCE}"
  [[ ${#updated_files[@]} -gt 0 ]] && echo "Updated files: ${updated_files[*]}"
} >> merge.log

# Commit if anything changed
if ! git diff --quiet -- docs; then
  git add docs merge.log
  git commit -m "chore: merge sections (${UPDATED} updated) from ${SOURCE}"
else
  echo "ℹ️ No changes to commit."
fi

echo "Done."
