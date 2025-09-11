#!/usr/bin/env bash
set -euo pipefail

add_defs() {
  file="$1"; shift
  defs=("$@")
  for d in "${defs[@]}"; do
    if ! grep -q "^\[\^$d\]:" "$file"; then
      echo "[^$d]: (placeholder) definition not yet supplied" >> "$file"
      echo "✅ Added placeholder for $d in $file"
    fi
  done
}

# Add missing placeholders
add_defs docs/ky-business-model.md fn-bm-margins-2028 fn-bm-arr-2028
add_defs docs/ky-solution-theory.md sol-2028-competition-outcome sol-prob-2028

echo "Done adding placeholders."
