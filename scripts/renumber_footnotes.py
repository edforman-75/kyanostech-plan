#!/usr/bin/env python3
from pathlib import Path
import sys, re

if len(sys.argv) < 2:
    print("Usage: renumber_footnotes.py <section.md> [appendix.md]")
    sys.exit(1)

section_path = Path(sys.argv[1])
appendix_path = Path(sys.argv[2]) if len(sys.argv) > 2 else Path("docs/ky-appendix-footnotes-methodology.md")

t = section_path.read_text(encoding="utf-8")
apx = appendix_path.read_text(encoding="utf-8")

# 1) Strip any existing numbered <sup> footnotes so we can re-number cleanly
t = re.sub(r'<sup class="fn-ref".*?</sup>', '', t, flags=re.I | re.S)

# 2) Collect {FN:slug} in first-appearance order
slugs, seen = [], set()
for m in re.finditer(r'\{FN:([^}]+)\}', t):
    s = m.group(1).strip()
    if s not in seen:
        seen.add(s); slugs.append(s)

if not slugs:
    print("ℹ️  No {FN:...} placeholders found – nothing changed.")
    sys.exit(0)

# 3) Read appendix anchors we can link to
anchors = set(re.findall(r'<a id="fn-([a-z0-9\-]+)"', apx, flags=re.I))
slug_to_num = {s: i+1 for i, s in enumerate(slugs)}

def repl(m):
    s = m.group(1).strip()
    n = slug_to_num.get(s)
    if s in anchors:
        return f'<sup class="fn-ref"><a href="../ky-appendix-footnotes-methodology/#fn-{s}">{n}</a></sup>'
    else:
        # visible "missing" marker; keeps place in text
        return f'<sup class="fn-ref" style="color:#d32f2f;">[?]</sup>'

new_t = re.sub(r'\{FN:([^}]+)\}', repl, t)
section_path.write_text(new_t, encoding="utf-8")

missing = [s for s in slugs if s not in anchors]
ok = [s for s in slugs if s in anchors]

print(f"✅ Numbered {len(slugs)} footnotes in {section_path}.")
if ok:
    print("   Linked:", ", ".join(ok))
if missing:
    print("   ⚠️  Missing anchors in appendix for:", ", ".join(missing))
