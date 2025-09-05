#!/usr/bin/env bash
set -euo pipefail

command -v mkdocs >/dev/null 2>&1 || { echo "mkdocs not found"; exit 1; }

# stop any existing server
pkill -f "mkdocs serve" 2>/dev/null || true

# pick a free port: 8000 -> 8001 -> 8002
pick_port() {
  for p in 8000 8001 8002; do
    if ! lsof -ti tcp:$p >/dev/null 2>&1; then
      echo "$p"; return 0
    fi
  done
  return 1
}

PORT="$(pick_port)" || { echo "No free port (8000-8002)"; exit 1; }

# rebuild and serve
mkdocs build >/dev/null
nohup mkdocs serve -a 127.0.0.1:$PORT >/tmp/mkdocs.log 2>&1 &

echo "🌐 MkDocs restarted on http://127.0.0.1:$PORT/"
echo "  (logs: /tmp/mkdocs.log)"
