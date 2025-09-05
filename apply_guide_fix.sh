#!/usr/bin/env bash
set -euo pipefail

HOME_MD="docs/index.md"
MK="mkdocs.yml"
CSS="docs/assets/extra.css"

[[ -f "$HOME_MD" ]] || { echo "❌ $HOME_MD not found"; exit 1; }
[[ -f "$MK" ]] || { echo "❌ $MK not found"; exit 1; }
[[ -f "$CSS" ]] || { echo "❌ $CSS not found"; exit 1; }

# --- Backups ---
cp "$HOME_MD" "$HOME_MD.bak.$(date +%Y%m%d-%H%M%S)"
cp "$MK" "$MK.bak.$(date +%Y%m%d-%H%M%S)"
cp "$CSS" "$CSS.bak.$(date +%Y%m%d-%H%M%S)"

# --- Ensure Markdown-in-HTML is enabled (append block if missing) ---
if ! grep -q '^markdown_extensions:' "$MK"; then
  cat >> "$MK" <<'YML'

markdown_extensions:
  - md_in_html
  - attr_list
YML
else
  grep -q '^[[:space:]]*-[[:space:]]*md_in_html[[:space:]]*$' "$MK" || \
    awk '1; /^markdown_extensions:/ {print "  - md_in_html"}' "$MK" > "$MK.tmp" && mv "$MK.tmp" "$MK"
  grep -q '^[[:space:]]*-[[:space:]]*attr_list[[:space:]]*$' "$MK" || \
    awk '1; /^markdown_extensions:/ {print "  - attr_list"}' "$MK" > "$MK.tmp" && mv "$MK.tmp" "$MK"
fi

# --- Make the wrapper parse Markdown, and render H2s inside it ---
# 1) ensure markdown="1" on the guide div
perl -0777 -i -pe 's/<div class="guide"(?![^>]*markdown="1")/<div class="guide" markdown="1"/g' "$HOME_MD"

# 2) demote inner "# " to "## " only inside the wrapper
awk '
  BEGIN{in=0}
  /<div class="guide" markdown="1">/ {in=1; print; next}
  /<\/div>/ {in=0; print; next}
  {
    if(in==1){
      sub(/^[[:space:]]*#[[:space:]]+/,"## ");
    }
    print
  }
' "$HOME_MD" > "$HOME_MD.tmp" && mv "$HOME_MD.tmp" "$HOME_MD"

# --- Normalize Home links (idempotent) ---
perl -0777 -i -pe 's#\]\(sections/([^)/]+)/\)#](sections/\1/index.md)#g' "$HOME_MD"
perl -0777 -i -pe 's#\]\(appendices/([^)/]+)/\)#](appendices/\1/index.md)#g' "$HOME_MD"
perl -0777 -i -pe 's#\]\(white-papers/([^)/]+)/\)#](white-papers/\1/index.md)#g' "$HOME_MD"
perl -0777 -i -pe 's#\]\(changelog/\)#](changelog/index.md)#g' "$HOME_MD"
perl -0777 -i -pe 's#\]\(/about-this-plan/\)#](about-this-plan.md)#g' "$HOME_MD"

# --- Footer override (center + rename link) ---
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

# --- Point theme to overrides (idempotent) ---
if ! grep -q '^[[:space:]]*custom_dir:[[:space:]]*overrides[[:space:]]*$' "$MK"; then
  if grep -q '^theme:' "$MK"; then
    awk '
      BEGIN{done=0}
      /^theme:[[:space:]]*$/ && !done {print; print "  custom_dir: overrides"; done=1; next}
      {print}
      END{if(!done){print "theme:\n  name: material\n  custom_dir: overrides"}}
    ' "$MK" > "$MK.tmp" && mv "$MK.tmp" "$MK"
  else
    cat >> "$MK" <<'YML'
theme:
  name: material
  custom_dir: overrides
YML
  fi
fi

# --- CSS: center the footer middle block (safe to append) ---
if ! grep -q 'GUIDE TWEAK: footer centering' "$CSS"; then
  cat >> "$CSS" <<'CSS'

/* GUIDE TWEAK: footer centering */
.md-footer__inner.md-footer-slim .md-footer__center {
  text-align: center;
  justify-self: center;
}
CSS
fi

echo "✅ Guide rendering fixed and footer updated."
echo "👉 Now run: mkdocs serve -a 127.0.0.1:8010"
