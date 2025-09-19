# KyanosTech Business Plan - Build & Deploy Guide

## Overview

This guide provides instructions for reliably building and deploying the KyanosTech Business Plan site. The build script ensures consistent deployments without navigation or link issues.

## Prerequisites

Before using the build script, ensure you have:

1. **MkDocs with Material Theme**:
   ```bash
   pip install mkdocs-material
   ```

2. **Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   netlify login
   ```

3. **Python 3** (for configuration validation)

## Build Script Usage

The `build-deploy.sh` script provides several commands:

### Build Locally
```bash
./build-deploy.sh build
```
- Validates navigation structure
- Fixes common configuration issues  
- Builds the site with MkDocs
- Runs quality checks
- Output: `site/` directory with built website

### Deploy to Preview
```bash
./build-deploy.sh deploy
```
- Performs full build process
- Creates backup of current state
- Deploys to Netlify preview URL
- Safe for testing changes

### Deploy to Production
```bash
./build-deploy.sh deploy-prod
```
- Performs full build process with extra quality checks
- Creates backup of current state
- Deploys to production URL: https://kyanostech-plan-edf.netlify.app
- Use only for final releases

### Validate Configuration
```bash
./build-deploy.sh validate
```
- Checks prerequisites
- Validates navigation structure
- Verifies all referenced files exist
- Quick health check without building

## What the Script Fixes

The build script automatically addresses common issues:

1. **Duplicate Configuration Sections**: Removes duplicate `markdown_extensions` entries
2. **Missing Files**: Validates all navigation references exist
3. **Build Artifacts**: Cleans old build files before new builds
4. **Link Validation**: Reports unrecognized relative links for manual review
5. **Backup Creation**: Creates timestamped backups before major operations

## Site Structure

### Navigation Components

- **Main Sections**: Core business plan content
- **White Papers**: "The Progressive AI Imperative" and "From Search to Conversation"
- **Changelog**: Version history and technical notes
- **Appendices**: Supporting documentation in alphabetical order (A-G)

### Key Files

- `mkdocs.yml`: Site configuration and navigation
- `netlify.toml`: Netlify build and function configuration
- `netlify/functions/chat-ai.js`: AI chatbot serverless function
- `docs/assets/js/kyanos-chatbot.js`: Chatbot frontend

## Chatbot v2.0.0 Features

The site includes an integrated AI chatbot with:

- Natural language processing for business plan questions
- Context-aware responses about KyanosTech solutions
- Professional conversation handling
- Error handling and fallback responses

## Troubleshooting

### Build Failures

1. **Missing Prerequisites**: Run `./build-deploy.sh validate` to check setup
2. **Navigation Errors**: Script will report missing files - add them or update navigation
3. **Link Issues**: Review reported "unrecognized relative links" and fix manually if needed

### Deployment Issues

1. **Netlify Authentication**: Run `netlify login` and authenticate
2. **Function Errors**: Check `netlify/functions/chat-ai.js` for syntax errors
3. **Build Command Issues**: Verify `netlify.toml` contains `command = "mkdocs build"`

### Common Link Issues

The script reports links like `ky-executive-summary/` that should be `ky-executive-summary.md`. These are typically in the index.md file and may be intentional for navigation purposes.

## Manual Build Process (Alternative)

If the script fails, you can build manually:

```bash
# Clean previous build
rm -rf site/

# Build with MkDocs
mkdocs build

# Deploy to Netlify
netlify deploy --prod
```

## Version History

- **v2.0.0**: Added AI chatbot integration and white papers
- **v1.5.0**: Comprehensive appendix structure
- **v1.0.0**: Initial business plan with core sections

## Support

For build issues or questions about the business plan content:

1. Check the Changelog for recent changes
2. Review the build script output for specific error messages
3. Validate your environment with `./build-deploy.sh validate`

---

*This documentation is part of the KyanosTech Impact Business Plan project.*