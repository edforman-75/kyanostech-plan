#!/usr/bin/env bash
set -euo pipefail

: "${NETLIFY_TEAM:=forman-ed}"              # Netlify team slug
: "${SITE_NAME:=kyanostech-plan-edf}"       # site name

echo "== Netlify team: $NETLIFY_TEAM | site: $SITE_NAME"

# Python deps + build
if [ -d .venv ]; then source .venv/bin/activate; fi
python3 -m pip install -r requirements.txt
mkdocs build

# Login (browser first time only)
if ! npx --yes netlify-cli@latest status >/dev/null 2>&1; then
  echo "Logging into Netlify…"
  npx --yes netlify-cli@latest login
fi

# Try to create site (ok if already exists)
npx --yes netlify-cli@latest sites:create --name "$SITE_NAME" --team "$NETLIFY_TEAM" >/dev/null 2>&1 || \
  echo "Site '$SITE_NAME' likely exists — continuing."

# Preview deploy
echo "== Deploying preview build…"
if ! npx --yes netlify-cli@latest deploy --dir=site --message "preview $(date)" \
     --site "$SITE_NAME" --team "$NETLIFY_TEAM"; then
  echo "Linking local folder to site…"
  npx --yes netlify-cli@latest link
  npx --yes netlify-cli@latest deploy --dir=site --message "preview $(date)"
fi

# Production deploy
echo "== Deploying PRODUCTION build…"
npx --yes netlify-cli@latest deploy --dir=site --prod --message "prod $(date)" \
    --site "$SITE_NAME" --team "$NETLIFY_TEAM"

echo
echo "✅ Done."
echo "Enable password protection at:"
echo "https://app.netlify.com/teams/${NETLIFY_TEAM}/sites/${SITE_NAME}/settings/general#site-protection"
