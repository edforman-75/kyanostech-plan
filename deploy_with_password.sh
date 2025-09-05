#!/usr/bin/env bash
set -euo pipefail

SITE_NAME="kyanostech-plan-edf"

# 1) Build the site
if [ -d .venv ]; then source .venv/bin/activate; fi
mkdocs build

# 2) Add Basic Auth header AFTER build so it survives the clean
mkdir -p site
cat > site/_headers <<'HDR'
/*
  Basic-Auth: edf:securepass123 edforman@icloud.com:bujzam-warkY6-wyrvom
HDR

# 3) Ensure Netlify CLI is logged in and linked to the site
if ! npx --yes netlify-cli@latest status > /dev/null 2>&1; then
  npx --yes netlify-cli@latest login
fi

# If not linked yet, this will prompt you to pick "kyanostech-plan-edf"
if ! npx --yes netlify-cli@latest status | grep -q "$SITE_NAME"; then
  npx --yes netlify-cli@latest link
fi

# 4) Deploy to production
npx --yes netlify-cli@latest deploy --prod --dir=site --message "prod $(date)"

echo "If prompted for site selection, choose: $SITE_NAME"
echo "When you visit the URL, you should get a Basic Auth login dialog."
