# KyanosTech Business Plan Website

This repository contains the KyanosTech business plan website built with MkDocs Material, featuring an AI-powered chatbot assistant.

## Features

- Interactive business plan documentation
- AI chatbot powered by OpenAI GPT-4 Turbo
- RAG (Retrieval-Augmented Generation) for accurate, context-aware responses
- Responsive design with Material theme

## Local Development Setup

### Prerequisites

- Python 3.x
- Node.js and npm (for Netlify CLI)
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/edforman-75/kyanostech-plan.git
   cd kyanostech-plan
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_actual_api_key_here
   ```

   Get your API key from: https://platform.openai.com/api-keys

3. **Install dependencies**
   ```bash
   pip install mkdocs-material
   npm install -g netlify-cli
   ```

4. **Run locally**
   ```bash
   netlify dev
   ```

## Deployment to Netlify

### Environment Variables Setup

**IMPORTANT**: Never commit your `.env` file. The OpenAI API key must be configured as a Netlify environment variable.

1. **Log in to Netlify Dashboard**
   - Go to https://app.netlify.com
   - Select your site

2. **Configure Environment Variables**
   - Navigate to: `Site settings > Environment variables`
   - Click `Add a variable`
   - Add:
     - **Key**: `OPENAI_API_KEY`
     - **Value**: Your OpenAI API key
     - **Scopes**: Check both "Same value for all deploy contexts" or configure separately for production/preview

3. **Redeploy**
   - Go to `Deploys` tab
   - Click `Trigger deploy > Deploy site`

### Build Settings

The site will automatically build when you push to the main branch:

```yaml
# netlify.toml configuration
[build]
  command = "mkdocs build"
  publish = "site"

[functions]
  directory = "netlify/functions"
```

## Chatbot Architecture

The chatbot uses:
- **Frontend**: `/docs/assets/js/kyanos-chatbot.js` (v2.5.0)
- **Backend**: `/netlify/functions/chat-ai.js`
- **Knowledge Base**: `/netlify/functions/business-plan-embeddings.json`

### How It Works

1. User asks a question via the chat widget
2. Backend generates embeddings and performs semantic search
3. Retrieves top 8 relevant sections from the business plan
4. GPT-4 generates a focused answer based only on the business plan content
5. Response is displayed with markdown formatting

## Security

- ✅ `.env` files are in `.gitignore`
- ✅ API keys must be configured as Netlify environment variables
- ✅ No sensitive data should be committed to the repository
- ✅ CORS properly configured for API endpoints

## Repository Structure

```
kyanostech-plan/
├── docs/                          # MkDocs documentation source
│   ├── assets/
│   │   ├── js/
│   │   │   └── kyanos-chatbot.js  # Chatbot frontend
│   │   └── css/
│   │       └── chatbot.css        # Chatbot styling
│   └── *.md                       # Business plan content
├── netlify/
│   └── functions/
│       ├── chat-ai.js             # Chatbot backend API
│       └── business-plan-embeddings.json  # Knowledge base
├── mkdocs.yml                     # MkDocs configuration
├── netlify.toml                   # Netlify configuration
├── .env.example                   # Environment variables template
└── .gitignore                     # Git ignore rules
```

## License

[Add your license here]

## Contact

[Add contact information]
