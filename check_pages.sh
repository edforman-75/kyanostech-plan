#!/usr/bin/env bash
set -euo pipefail

URL="https://edforman-75.github.io/kyanostech-plan/"

echo "Checking GitHub Pages at: $URL"
status=$(curl -s -o /dev/null -w "%{http_code}" "$URL")

if [[ "$status" == "200" ]]; then
  echo "✅ Site is live!"
  exit 0
else
  echo "❌ Site not ready (HTTP $status)."
  echo "Try again in a few minutes."
  exit 1
fi
