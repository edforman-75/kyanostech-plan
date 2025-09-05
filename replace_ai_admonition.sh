#!/usr/bin/env bash
set -euo pipefail

# Backup original file
cp docs/sections/02_market_opportunity.md docs/sections/02_market_opportunity.md.bak

# Replace the admonition block with inline HTML
sed -i '' '/^!!! note "The AI Abstention Trap"/,/^$/c\
<div role="note" aria-label="The AI Abstention Trap"\
     style="margin:1.25rem 0; padding:1rem 1.25rem; border-left:6px solid #2563eb; background:#f1f5ff; border-radius:8px;">\
  <h4 id="ai-abstention-trap" style="margin:0 0 .5rem 0; font-weight:700;">The AI Abstention Trap</h4>\
  <p><strong>The Risk:</strong> Data show progressives report higher concern about AI’s societal harms than conservatives; this heightened suspicion may leave progressives hesitant to implement AI-optimizing features.</p>\
  <p><strong>The Reality:</strong> <strong>800 million users</strong><sup>†</sup> rely on ChatGPT weekly while <strong>61% distrust AI</strong>—yet usage accelerates across demographics (see Appendix).</p>\
  <p><strong>The Consequence:</strong> <strong>34% of Americans</strong><sup>†</sup> use AI for research; abstaining cedes control over how candidates are represented in AI answers.</p>\
  <p><strong>The Urgency:</strong> Chatbot interactions can shift political views within a handful of exchanges; failing to engage concedes the terrain.</p>\
  <p><strong>Bottom line:</strong> Ideological purity becomes tactical blindness when others shape AI-mediated reality unchallenged.</p>\
</div>' docs/sections/02_market_opportunity.md
