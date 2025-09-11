#!/bin/bash
# Restart MkDocs and open Problem & Urgency page

# Stop any running mkdocs serve
pkill -f "mkdocs serve" 2>/dev/null || true

# Start new server in background
./.venv/bin/mkdocs serve &
PID=$!

# Give it a few seconds to start
sleep 3

# Open directly to Problem & Urgency page
open "http://127.0.0.1:8000/ky-problem-urgency/"

wait $PID
