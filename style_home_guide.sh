#!/usr/bin/env bash
set -euo pipefail

HOME_MD="docs/index.md"
CSS="docs/assets/extra.css"

[[ -f "$HOME_MD" ]] || { echo "❌ $HOME_MD not found"; exit 1; }
[[ -f "$CSS" ]] || { echo "❌ $CSS not found"; exit 1; }

# 1) Backup
cp "$HOME_MD" "$HOME_MD.bak.$(date +%Y%m%d-%H%M%S)"
cp "$CSS" "$CSS.bak.$(date +%Y%m%d-%H%M%S)"

# 2) Wrap the guide content in a .guide container (only once)
if ! grep -q '<div class="guide">' "$HOME_MD"; then
  awk '
    BEGIN{wrapped=0}
    # Insert opening tag right after the H1
    /^#[[:space:]]+Guide to This Plan[[:space:]]*$/ && !wrapped {
      print $0
      print ""
      print "<div class=\"guide\">"
      wrapped=1
      next
    }
    { print $0 }
    END{
      if (wrapped) print "</div>"
    }
  ' "$HOME_MD" > "$HOME_MD.tmp" && mv "$HOME_MD.tmp" "$HOME_MD"
fi

# 3) Append CSS (if not already present)
if ! grep -q '/* GUIDE STYLES START */' "$CSS"; then
  cat >> "$CSS" <<'CSS'

/* GUIDE STYLES START */
.md-typeset .guide h1 {
  margin-bottom: 1.2rem;
}

/* More breathing room between items */
.md-typeset .guide h2 {
  margin-top: 1.8rem;       /* space above each link-title */
  margin-bottom: .3rem;
  font-weight: 700;
}

/* Make the H2s read as links */
.md-typeset .guide h2 a {
  text-decoration: underline;
  text-underline-offset: 4px;
}
.md-typeset .guide h2 a:hover {
  text-decoration-thickness: 3px;
}
.md-typeset .guide h2 a::after {
  content: " →";
  font-weight: 700;
  opacity: .6;
}

/* Larger summaries, up to 2 lines */
.md-typeset .guide h2 + p {
  font-size: 1.05rem;       /* bump size */
  line-height: 1.55;
  color: var(--md-default-fg-color--light);
  margin-top: .15rem;
  margin-bottom: .8rem;

  /* clamp to two lines (Safari/Chromium/WebKit) */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (min-width: 960px) {
  .md-typeset .guide h2 { margin-top: 2.0rem; }
  .md-typeset .guide h2 + p { font-size: 1.1rem; }
}
/* GUIDE STYLES END */
CSS
fi

echo "✅ Styles applied. Rebuilding…"
mkdocs serve -a 127.0.0.1:8010
