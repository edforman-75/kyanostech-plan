#!/usr/bin/env bash
set -euo pipefail

# ---- SETTINGS YOU CAN TWEAK ----
GH_USER="edforman-75"                          # your GitHub username
REPO_NAME="kyanostech-plan"                    # repo name
SITE_URL="https://${GH_USER}.github.io/${REPO_NAME}/"
REPO_URL="https://github.com/${GH_USER}/${REPO_NAME}"
# --------------------------------

echo ">> Ensure CSS + assets exist"
mkdir -p docs/assets docs/appendices/player
# keep our footnotes CSS; delete an old overrides.css if it sneaks back
rm -f docs/assets/overrides.css || true
# audio player asset (source-of-truth lives here)
if [ -f docs/assets/invisible_hand_player.html ]; then
  cp -f docs/assets/invisible_hand_player.html docs/appendices/player/invisible-hand.html
fi

echo ">> Update mkdocs.yml (site_url, repo_url, extra_css, use_directory_urls, exclude_docs)"
python3 - <<'PY'
import yaml, pathlib, sys
p = pathlib.Path("mkdocs.yml")
d = yaml.safe_load(p.read_text(encoding="utf-8")) or {}

# 1) site_url / repo_url
import os
site_url = os.environ.get("SITE_URL")
repo_url = os.environ.get("REPO_URL")
if site_url: d["site_url"] = site_url
if repo_url: d["repo_url"] = repo_url

# 2) extra_css: ensure assets/footnotes.css present; remove assets/overrides.css
css = d.get("extra_css", [])
if not isinstance(css, list): css = [css] if css else []
css = [c for c in css if c != "assets/overrides.css"]
if "assets/footnotes.css" not in css:
    css.append("assets/footnotes.css")
d["extra_css"] = css

# 3) use_directory_urls = true (nice clean URLs)
d.setdefault("use_directory_urls", True)

# 4) exclude_docs: multiline string with patterns (mkdocs wants a string here)
#    Keep existing entries, ensure "_archive/**", and filter empties.
patterns = []
ex = d.get("exclude_docs", "")
if isinstance(ex, str) and ex.strip():
    patterns.extend([ln.strip() for ln in ex.splitlines() if ln.strip()])
elif isinstance(ex, list):
    # If earlier stored as list, preserve items.
    patterns.extend([str(x).strip() for x in ex if str(x).strip()])

# add required & helpful patterns
must_have = ["_archive/**"]
for pat in must_have:
    if pat not in patterns:
        patterns.append(pat)
# keep noisy backups out of /site
for pat in ["**/*.bak", "**/*.md.bak", "**/*.bak_*", "**/*.bak.*"]:
    if pat not in patterns:
        patterns.append(pat)

# write as multiline string
d["exclude_docs"] = "\n".join(patterns)

# save
p.write_text(yaml.safe_dump(d, sort_keys=False), encoding="utf-8")
PY

echo ">> Normalize any old audio-player links (relative path fixes)"
# ../assets/invisible_hand_player.html  ->  ../player/invisible-hand.html
perl -0777 -i -pe 's{\.\./assets/invisible_hand_player\.html}{../player/invisible-hand.html}g' docs/**/**/*.md docs/**/*.md 2>/dev/null || true
# /appendices/player/invisible-hand.html (handle variants)
perl -0777 -i -pe 's{(?:(?:\.\./)?appendices/player/invisible-hand\.html)}{../player/invisible-hand.html}g' docs/**/**/*.md docs/**/*.md 2>/dev/null || true

echo ">> Build site"
mkdocs build

echo ">> Quick internal link check summary (errors only)"
if ! command -v linkchecker >/dev/null 2>&1; then
  python3 -m pip install -q linkchecker >/dev/null
fi
linkchecker site/ --check-extern -F text > /tmp/linkcheck.txt || true
echo "=== LinkChecker summary (errors only) ==="
grep -n "Error:" /tmp/linkcheck.txt | sed -E 's/^\s*//' | head -n 80 || true
echo "Full log: /tmp/linkcheck.txt"

echo ">> Git commit (only if changes)"
if git rev-parse --git-dir >/dev/null 2>&1; then
  if ! git diff --quiet || ! git diff --cached --quiet; then
    git add -A
    git commit -m "Build: mkdocs settings, CSS, audio link normalization, linkcheck log hint"
  else
    echo "No changes to commit."
  fi
else
  echo "Repo not initialized; run:  git init && git add -A && git commit -m 'initial'"
fi

echo ">> Done."
