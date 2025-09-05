#!/usr/bin/env bash
set -euo pipefail

[[ -f mkdocs.yml ]] || { echo "run from repo root"; exit 1; }

# 1) fail if any with_suffix( remains (exclude generated/hidden/tool dirs)
if grep -RIn \
  --exclude-dir=.git --exclude-dir=.venv --exclude-dir=node_modules \
  --exclude-dir=site --exclude-dir=.bak --exclude-dir=tools \
  -e 'with_suffix(' . >/dev/null 2>&1; then
  echo "with_suffix() found"; exit 1
else
  echo "No with_suffix() uses found."
fi

# 2) preview (or delete with --delete) editor/backup files
tmp="$(mktemp)"
find . \
  -type d \( -name .git -o -name .venv -o -name node_modules -o -name site -o -name .bak -o -name tools \) -prune -o \
  -type f \( -name '*~' -o -name '*.bak' -o -name '*.bak_*' \) -print >"$tmp"

count="$(wc -l <"$tmp" | tr -d ' ')"
if (( count > 0 )); then
  echo "Found $count stray backup file(s):"
  cat "$tmp"
  if [[ "${1:-}" == "--delete" ]]; then
    xargs -r rm -f <"$tmp"
    echo "Removed $count file(s)."
  else
    echo "Preview only. Re-run with --delete to remove."
  fi
else
  echo "No stray backup/editor files found."
fi
rm -f "$tmp"

# 3) build
command -v mkdocs >/dev/null 2>&1 || { echo "mkdocs not found"; exit 1; }
mkdocs build >/dev/null && echo "MkDocs build OK"
