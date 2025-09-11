#!/usr/bin/env bash
# Add placeholder footnote definitions to files that still reference
# the (removed) appendix, ensuring each file is self-contained.

set -eo pipefail   # (no -u to avoid “unbound variable” edge-cases)

ensure_header_and_defs () {
  local f="$1"; shift
  # keys may be empty; guard everything accordingly
  local keys=("$@")
  local added_any=0

  # If none of the keys are referenced in the file, skip quietly
  local ref_found=0 k
  for k in "${keys[@]}"; do
    if grep -q "\[\^${k}\]" "$f"; then ref_found=1; break; fi
  done
  [[ $ref_found -eq 0 ]] && { echo "↪︎ Skip (no refs): $f"; return 0; }

  # Ensure a “## Footnotes” section exists
  if ! grep -qE '^[[:space:]]*#{2,}[[:space:]]*Footnotes[[:space:]]*$' "$f"; then
    printf "\n\n---\n\n## Footnotes\n\n" >> "$f"
    added_any=1
  fi

  # Add placeholder defs for any missing [^key]:
  local missing=()
  for k in "${keys[@]}"; do
    if ! grep -qE "^\[\^${k}\]:" "$f"; then
      printf "[^%s]: TBD – definition not yet written (migrated from appendix).\n" "$k" >> "$f"
      missing+=("$k")
      added_any=1
    fi
  done

  if [[ $added_any -eq 1 ]]; then
    # Join missing array safely (handles empty case)
    local joined="${missing[*]}"
    [[ -z "$joined" ]] && joined="none"
    echo "✅ Updated $f  (added: $joined)"
  else
    echo "✔︎ Already complete: $f"
  fi
}

# -------- Files & footnote IDs we saw in your repo --------

# ky-business-model family
ensure_header_and_defs "docs/ky-business-model.md" \
  fn-bm-margins-2028 fn-bm-arr-2028
ensure_header_and_defs "docs/ky-business-model.headerfix_20250829_102304.md" \
  fn-bm-margins-2028
ensure_header_and_defs "docs/ky-business-model.prepatch_20250828_220729.md" \
  fn-bm-margins-2028
ensure_header_and_defs "docs/ky-business-model.rm_comparables_20250829_173025.md" \
  fn-bm-margins-2028 fn-bm-arr-2028
ensure_header_and_defs "docs/ky-business-model.scan_20250829_165204.md" \
  fn-bm-margins-2028

# ky-solution-theory (current & snapshots)
ensure_header_and_defs "docs/ky-solution-theory.md" \
  sol-2028-competition-outcome \
  sol-accountability-monitor-audit \
  sol-aio-coverage-roughly-half-2025 \
  sol-invisibility-claim-2028 \
  sol-pew-58pct-ai-overview-exposure-2025 \
  sol-sparktoro-zero-click-us-2024 \
  sol-toc-overview sol-toc-step-1 sol-toc-step-2 sol-toc-step-3 sol-toc-step-4 \
  sol-prob-2028 sol-zero-click-272-mar-2025

ensure_header_and_defs "docs/ky-solution-theory.backup_20250829_193547.md" \
  sol-2028-competition-outcome \
  sol-accountability-monitor-audit \
  sol-aio-coverage-roughly-half-2025 \
  sol-invisibility-claim-2028 \
  sol-pew-58pct-ai-overview-exposure-2025 \
  sol-sparktoro-zero-click-us-2024 \
  sol-toc-overview sol-toc-step-1 sol-toc-step-2 sol-toc-step-3 sol-toc-step-4 \
  sol-prob-2028 sol-zero-click-272-mar-2025

ensure_header_and_defs "docs/ky-solution-theory.bak.cleanup_solution.md" \
  sol-2028-competition-outcome \
  sol-accountability-monitor-audit \
  sol-aio-coverage-roughly-half-2025 \
  sol-invisibility-claim-2028 \
  sol-pew-58pct-ai-overview-exposure-2025 \
  sol-sparktoro-zero-click-us-2024 \
  sol-toc-overview sol-toc-step-1 sol-toc-step-2 sol-toc-step-3 sol-toc-step-4 \
  sol-prob-2028 sol-zero-click-272-mar-2025

# ky-products-tech (current & snapshot)
ensure_header_and_defs "docs/ky-products-tech.md" \
  sol-2028-competition-outcome
ensure_header_and_defs "docs/ky-products-tech.backup_20250829_193518.md" \
  sol-2028-competition-outcome

echo "Done."
