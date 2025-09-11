#!/usr/bin/env bash
set -euo pipefail

ensure_section() { local f="$1"; grep -qE '^[[:space:]]*##[[:space:]]+Footnotes' "$f" || printf '\n## Footnotes\n' >> "$f"; }

add_if_missing() { local f="$1" id="$2" ; grep -qE "^\[\^${id}\]:" "$f" || printf '[^%s]: (placeholder)\n' "$id" >> "$f"; }

ensure_file() { local f="$1"; shift; ensure_section "$f"; for id in "$@"; do add_if_missing "$f" "$id"; done; }

ensure_file docs/ky-business-model.md fn-bm-margins-2028 fn-bm-arr-2028
ensure_file docs/ky-solution-theory.md sol-2028-competition-outcome sol-prob-2028

echo "OK"
