#!/bin/bash
set -e

echo "🧹 Cleaning old site build..."
rm -rf site

echo "🏗️ Rebuilding docs..."
./.venv/bin/mkdocs build

echo "🛑 Stopping any running mkdocs serve..."
pkill -f "mkdocs serve" 2>/dev/null || true

echo "🚀 Starting mkdocs dev server at http://127.0.0.1:8000 ..."
exec ./.venv/bin/mkdocs serve -a 127.0.0.1:8000
