#!/usr/bin/env bash
set -euo pipefail
./.venv/bin/mkdocs build >/dev/null || true
for f in docs/ky-problem-urgency.md docs/ky-solution-theory.md docs/ky-products-tech.md; do
  echo "— $f"
  grep -RIn 'fnref' "$f" || echo "OK: no #fnref anchors"
  grep -RIn 'class="fn-ref"' "$f" || echo "OK: no inline HTML anchors"
  grep -RIn '\.\./ky-appendix-footnotes-methodology' "$f" mkdocs.yml || echo "OK: no appendix links"
done
