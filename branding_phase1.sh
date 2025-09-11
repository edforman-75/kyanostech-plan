set -e

backup=backup_branding_$(date +%Y%m%d_%H%M%S)
mkdir -p "$backup"
rsync -a docs "$backup"/
rsync -a mkdocs.yml "$backup"/ 2>/dev/null || true

find docs -type f \( -name "*.md" -o -name "*.html" -o -name "*.css" \) -print0 | xargs -0 perl -pi -e '
s/\bProgressive Digital Labs\b/KyanosTech/g;
s/\bPDL\b/KyanosTech/g;

s/\bDANA\b/AGON/g;  s/\bDana\b/Agon/g;  s/\bdana\b/agon/g;
s/\bDREW\b/POLIS/g; s/\bDrew\b/Polis/g; s/\bdrew\b/polis/g;
s/\bBENCH\b/SCOPE/g; s/\bBench\b/Scope/g; s/\bbench\b/scope/g;

s/Democratic AI Network Advantage/AGON Campaign Platform/g;
s/Democratic Representation Engagement Web/POLIS Governance Platform/g;
s/Bot Efficacy & Neutrality Checking Hub/SCOPE Verification Platform/g;

s/\bdana\.ai\b/agon.ai/g;
s/\bdrew\.ai\b/polis.ai/g;
s/\bbench\.ai\b/scope.ai/g;
'

find docs -type f \( -name "*.css" -o -name "*.html" \) -print0 | xargs -0 perl -pi -e '
s/#1e3c72/#1f2937/gi;
s/#3498db/#3b82f6/gi;
'

mkdir -p docs/assets/css
cat > docs/assets/css/brand.css <<'EOCSS'
:root{
  --ky-primary:#1f2937;
  --ky-blue:#3b82f6;
  --ky-accent:#1d4ed8;
  --ky-agon:#2563eb;
  --ky-polis:#059669;
  --ky-scope:#dc2626;
  --ky-gold:#f59e0b;
  --ky-silver:#6b7280;
  --ky-bg:#f8fafc;
  --ky-cream:#fefce8;
}
.md-typeset a{color:var(--ky-blue)}
.md-typeset h1,.md-typeset h2{color:var(--ky-primary)}
EOCSS

grep -q 'assets/css/brand.css' mkdocs.yml || printf '\nextra_css:\n  - assets/css/brand.css\n' >> mkdocs.yml

pkill -f "mkdocs serve" 2>/dev/null || true
mkdocs build -q || true
