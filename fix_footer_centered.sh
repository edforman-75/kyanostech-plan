#!/usr/bin/env bash
set -euo pipefail

HOME_MD="docs/index.md"
MK="mkdocs.yml"
CSS="docs/assets/extra.css"

[[ -f "$HOME_MD" ]] || { echo "❌ $HOME_MD not found"; exit 1; }
[[ -f "$MK" ]] || { echo "❌ $MK not found"; exit 1; }
[[ -f "$CSS" ]] || { echo "❌ $CSS not found"; exit 1; }

# Backups
cp "$HOME_MD" "$HOME_MD.bak.$(date +%Y%m%d-%H%M%S)"
cp "$MK" "$MK.bak.$(date +%Y%m%d-%H%M%S)"
cp "$CSS" "$CSS.bak.$(date +%Y%m%d-%H%M%S)"

# 1) Ensure Markdown-in-HTML works (so the guide renders as H2 links)
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

# 2) Make the guide wrapper parse Markdown and use H2 inside
perl -0777 -i -pe 's/<div class="guide"(?![^>]*markdown="1")/<div class="guide" markdown="1"/g' "$HOME_MD"
awk '
  BEGIN{in=0}
  /<div class="guide" markdown="1">/ {in=1; print; next}
  /<\/div>/ {in=0; print; next}
  { if(in==1){ sub(/^[[:space:]]*#[[:space:]]+/,"## "); } print }
' "$HOME_MD" > "$HOME_MD.tmp" && mv "$HOME_MD.tmp" "$HOME_MD"

# 3) Footer override:
#    - Left: default previous-page link (e.g., “About This Plan” when applicable)
#    - Center: "Confidential & Proprietary" (bold), and a small centered link back to About This Plan
#    - Right: default next-page link
mkdir -p overrides/partials
cat > overrides/partials/footer.html <<'HTML'
{% set base = base_url | d('', true) %}
<nav class="md-footer__inner md-grid md-footer-slim">

  {# LEFT: previous page (keep default behavior) #}
  {% if page.previous_page %}
    <a href="{{ page.previous_page.url | url }}" class="md-footer__link md-footer__link--prev" rel="prev">
      <span class="md-footer__title"><span class="md-ellipsis">{{ page.previous_page.title }}</span></span>
    </a>
  {% else %}
    <span></span>
  {% endif %}

  {# CENTER: notice + small link back to About This Plan #}
  <div class="md-footer__center">
    <div class="confidential"><strong>Confidential &amp; Proprietary</strong></div>
    <div class="footer-center-sub">
      <a href="{{ base }}/about-this-plan/">About This Plan</a>
    </div>
  </div>

  {# RIGHT: next page (keep default behavior) #}
  {% if page.next_page %}
    <a href="{{ page.next_page.url | url }}" class="md-footer__link md-footer__link--next" rel="next">
      <span class="md-footer__title"><span class="md-ellipsis">{{ page.next_page.title }}</span></span>
    </a>
  {% else %}
    <span></span>
  {% endif %}

</nav>
HTML

# 4) Point theme at overrides (idempotent)
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

# 5) CSS: center the middle block and style the small link
if ! grep -q 'GUIDE TWEAK: footer centering' "$CSS"; then
  cat >> "$CSS" <<'CSS'

/* GUIDE TWEAK: footer centering */
.md-footer__inner.md-footer-slim .md-footer__center {
  text-align: center;
  justify-self: center;
  display: grid;
  gap: .15rem;
}
.md-footer__inner.md-footer-slim .md-footer__center .footer-center-sub a {
  font-size: .95rem;
  opacity: .9;
  text-decoration: underline;
  text-underline-offset: 3px;
}
CSS
fi

echo "✅ Footer centered correctly; left shows previous-page link; guide rendering fixed."
echo "👉 Now run: mkdocs serve -a 127.0.0.1:8010"
