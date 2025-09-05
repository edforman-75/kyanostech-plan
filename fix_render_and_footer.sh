#!/usr/bin/env bash
set -euo pipefail

HOME_MD="docs/index.md"
MK="mkdocs.yml"

[[ -f "$HOME_MD" ]] || { echo "❌ $HOME_MD not found"; exit 1; }
[[ -f "$MK" ]] || { echo "❌ $MK not found"; exit 1; }

# 0) Backups
cp "$HOME_MD" "$HOME_MD.bak.$(date +%Y%m%d-%H%M%S)"
cp "$MK" "$MK.bak.$(date +%Y%m%d-%H%M%S)"

# 1) Ensure Markdown inside HTML is enabled (_very_ likely the cause of the funky text)
#    We’ll guarantee 'markdown_extensions' exists and includes 'md_in_html' and 'attr_list'
if ! grep -q '^markdown_extensions:' "$MK"; then
  printf "\nmarkdown_extensions:\n  - footnotes\n  - md_in_html\n  - attr_list\n" >> "$MK"
else
  # add md_in_html if missing
  grep -q '^[[:space:]]*-[[:space:]]*md_in_html[[:space:]]*$' "$MK" || \
    awk '1; /^markdown_extensions:/ {print "  - md_in_html"}' "$MK" > "$MK.tmp" && mv "$MK.tmp" "$MK"
  # add attr_list if missing
  grep -q '^[[:space:]]*-[[:space:]]*attr_list[[:space:]]*$' "$MK" || \
    awk '1; /^markdown_extensions:/ {print "  - attr_list"}' "$MK" > "$MK.tmp" && mv "$MK.tmp" "$MK"
fi

# 2) Make sure our wrapper allows Markdown (with md_in_html, the attribute is not required)
#    Also normalize the inner headings to H2 (##) so they render and style correctly.
#    We work strictly inside the wrapper region.
perl -0777 -i -pe 's/<div class="guide"[^>]*>/<div class="guide">/' "$HOME_MD"

awk '
  BEGIN{in=0}
  /<div class="guide">/{in=1; print; next}
  /<\/div>/{in=0; print; next}
  {
    if(in==1){
      sub(/^[[:space:]]*#[[:space:]]+/,"## ");
    }
    print
  }
' "$HOME_MD" > "$HOME_MD.tmp" && mv "$HOME_MD.tmp" "$HOME_MD"

# 3) Normalize links on Home (idempotent)
perl -0777 -i -pe 's#\]\(sections/([^)/]+)/\)#](sections/\1/index.md)#g' "$HOME_MD"
perl -0777 -i -pe 's#\]\(appendices/([^)/]+)/\)#](appendices/\1/index.md)#g' "$HOME_MD"
perl -0777 -i -pe 's#\]\(white-papers/([^)/]+)/\)#](white-papers/\1/index.md)#g' "$HOME_MD"
perl -0777 -i -pe 's#\]\(changelog/\)#](changelog/index.md)#g' "$HOME_MD"
perl -0777 -i -pe 's#\]\(/about-this-plan/\)#](about-this-plan.md)#g' "$HOME_MD"

# 4) Footer override: center the notice, and change link text to “About This Plan”
mkdir -p overrides/partials
cat > overrides/partials/footer.html <<'HTML'
{% set base = base_url | d('', true) %}
<nav class="md-footer__inner md-grid md-footer-slim">
  <span></span>
  <div class="md-footer__center">
    <a class="toc-link" href="{{ base }}/about-this-plan/">About This Plan</a>
    <span class="sep">·</span>
    <span class="confidential"><strong>Confidential &amp; Proprietary</strong></span>
  </div>
  {% if page.next_page %}
    <a href="{{ page.next_page.url | url }}" class="md-footer__link md-footer__link--next" rel="next">
      <span class="md-footer__title"><span class="md-ellipsis">{{ page.next_page.title }}</span></span>
    </a>
  {% else %}
    <span></span>
  {% endif %}
</nav>
HTML

# 5) Point theme to overrides (idempotent)
if grep -q '^\s*custom_dir:' "$MK"; then
  : # already set somewhere; assume good
else
  # add under the theme block; if no theme block, append a minimal one
  if grep -q '^theme:' "$MK"; then
    awk '1; /^theme:/ {print "  custom_dir: overrides"}' "$MK" > "$MK.tmp" && mv "$MK.tmp" "$MK"
  else
    cat >> "$MK" <<'YML'
theme:
  name: material
  custom_dir: overrides
YML
  fi
fi

# 6) Small CSS tweak for nicer spacing (safe to append)
CSS="docs/assets/extra.css"
if [[ -f "$CSS" ]] && ! grep -q '/* GUIDE TWEAK: footer centering */' "$CSS"; then
  cat >> "$CSS" <<'CSS'

/* GUIDE TWEAK: footer centering */
.md-footer__inner.md-footer-slim .md-footer__center {
  text-align: center;
  justify-self: center;
}
CSS
fi

echo "✅ Fixed Markdown rendering, updated footer, and normalized links."
echo "🚀 Preview: mkdocs serve -a 127.0.0.1:8010"
