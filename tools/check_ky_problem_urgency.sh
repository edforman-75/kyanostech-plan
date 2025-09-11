
set -euo pipefail
f="docs/ky-problem-urgency.md"

echo "Check 0: rebuild"
./.venv/bin/mkdocs build >/dev/null || true

echo "Check 1: #fnref anchors"
if grep -RIn 'fnref' "$f" ; then
  echo "^^ Found #fnref anchors above"
else
  echo "OK: No #fnref anchors"
fi

echo "Check 2: inline HTML anchors"
if grep -RIn 'class="fn-ref"' "$f" ; then
  echo "^^ Found inline HTML anchors above"
else
  echo "OK: No inline HTML anchors"
fi

echo "Check 3: appendix links"
if grep -RIn '\.\./ky-appendix-footnotes-methodology' "$f" mkdocs.yml ; then
  echo "^^ Found appendix links above"
else
  echo "OK: No appendix links"
fi
