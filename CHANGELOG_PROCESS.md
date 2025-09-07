# Changelog Maintenance Process

## Overview
The site changelog (`docs/changelog/index.md`) tracks all significant updates to the KyanosTech business plan site.

## What to Track

### Always Include
- **New features** (chatbots, analytics, new sections)
- **Content updates** (major revisions to business plan sections)
- **Design changes** (branding updates, layout changes)
- **Technical improvements** (performance, accessibility, SEO)
- **Bug fixes** that affect user experience

### Don't Include
- Minor typo fixes
- Internal development changes
- Dependency updates
- Behind-the-scenes maintenance

## Process

### Manual Updates
For significant changes, manually add to `docs/changelog/index.md`:

```markdown
### [Date] - [Title]
**[Added/Changed/Fixed/Removed]:** [Description]
- Bullet point of specific change
- Another specific change
- Technical details if relevant
```

### Automated Helper
Use the changelog script for consistent formatting:

```bash
# Interactive entry creation
python scripts/update_changelog.py add

# See recent commits for ideas
python scripts/update_changelog.py suggest
```

### Integration with Deployment
Consider adding to your deployment checklist:

1. Review changes since last deployment
2. Add significant changes to changelog
3. Commit changelog updates
4. Deploy

## Example Entries

### Good Changelog Entry
```markdown
### September 7, 2025 - AI Chatbot Integration
**Added:** Comprehensive AI chatbot interface with KyanosTech branding
- In-page chat functionality with instant responses to common questions
- Problem & solution focused quick questions for investors and stakeholders  
- Maximize/minimize interface allowing expansion to most of the page
- Question logging with analytics tracking for visitor engagement
```

### Poor Changelog Entry
```markdown
### September 7, 2025 - Updates
**Changed:** Fixed some stuff
- Updated files
- Made improvements
```

## Changelog Categories

- **Added**: New features, content, or functionality
- **Changed**: Updates to existing features or content
- **Fixed**: Bug fixes or corrections
- **Removed**: Deleted features or content

## Timing
- Update changelog **before** deploying changes
- Group related changes into single entries when logical
- Add entries for major milestones even if spread across multiple commits