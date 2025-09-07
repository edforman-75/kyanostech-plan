#!/usr/bin/env python3
"""
Update KyanosTech Chatbot Knowledge Base

This script extracts key content from the business plan and updates
the chatbot's knowledge base automatically during the build process.
"""

import os
import json
import yaml
from pathlib import Path
import re
from typing import Dict, List, Any

def extract_key_sections():
    """Extract key sections from markdown files"""
    knowledge = {}
    
    # Define key sections to extract
    sections = {
        'problem': 'docs/sections/problem_statement.md',
        'solution': 'docs/sections/solution_overview.md', 
        'products': 'docs/sections/products_and_technology.md',
        'market': 'docs/sections/market_analysis.md',
        'business_model': 'docs/sections/business_model.md',
        'financial_projections': 'docs/sections/financial_projections.md',
        'funding_ask': 'docs/sections/funding_ask.md'
    }
    
    for key, filepath in sections.items():
        if os.path.exists(filepath):
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Extract key points from markdown
            knowledge[key] = extract_key_points(content, key)
    
    return knowledge

def extract_key_points(content: str, section_type: str) -> Dict[str, str]:
    """Extract key points from markdown content"""
    
    # Remove markdown headers and formatting for cleaner text
    clean_content = re.sub(r'^#+\s+', '', content, flags=re.MULTILINE)
    clean_content = re.sub(r'\*\*(.*?)\*\*', r'\1', clean_content)
    clean_content = re.sub(r'\*(.*?)\*', r'\1', clean_content)
    
    # Extract bullet points
    bullet_points = re.findall(r'^[•\-\*]\s+(.+)$', content, re.MULTILINE)
    
    # Generate summary based on section type
    if section_type == 'problem':
        question = 'What fundamental problem does KyanosTech solve in progressive politics?'
    elif section_type == 'solution':
        question = 'How do AGON, POLIS, and SCOPE work together to solve progressive campaign challenges?'
    elif section_type == 'products':
        question = 'Tell me about KyanosTech\'s products'
    elif section_type == 'market':
        question = 'What is the market opportunity for KyanosTech?'
    elif section_type == 'business_model':
        question = 'How does KyanosTech make money?'
    elif section_type == 'funding_ask':
        question = 'What is the funding ask and how will the money be used?'
    else:
        question = f'Tell me about {section_type}'
    
    # Take first 2000 characters as summary
    summary = clean_content[:2000].strip()
    
    return {
        'question': question,
        'answer': summary,
        'bullet_points': bullet_points[:10]  # Top 10 bullet points
    }

def update_chatbot_html(knowledge: Dict[str, Any]):
    """Update the chatbot HTML file with new knowledge"""
    
    html_file = 'overrides/partials/branded-chatgpt-interface.html'
    
    if not os.path.exists(html_file):
        print(f"Chatbot HTML file not found: {html_file}")
        return
    
    # Read current HTML
    with open(html_file, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    # Convert knowledge to JavaScript object
    js_knowledge = "const knowledgeBase = " + json.dumps(knowledge, indent=4) + ";"
    
    # Find and replace the knowledge base section
    pattern = r'// Comprehensive KyanosTech Knowledge Base\s*const knowledgeBase = \{[^}]+\};'
    replacement = f"// Comprehensive KyanosTech Knowledge Base (Auto-updated: {get_timestamp()})\n    {js_knowledge}"
    
    if re.search(pattern, html_content, re.DOTALL):
        html_content = re.sub(pattern, replacement, html_content, flags=re.DOTALL)
    else:
        # If pattern not found, add it after GPT_URL
        gpt_url_pattern = r"(const GPT_URL = '[^']+';)"
        replacement_with_url = f"\\1\n    \n    {replacement}"
        html_content = re.sub(gpt_url_pattern, replacement_with_url, html_content)
    
    # Write updated HTML
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print(f"✅ Updated chatbot knowledge base in {html_file}")

def create_knowledge_json(knowledge: Dict[str, Any]):
    """Create a separate JSON file for the knowledge base"""
    
    output_file = 'site/assets/js/chatbot-knowledge.json'
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    
    # Add metadata
    knowledge_with_meta = {
        'updated': get_timestamp(),
        'version': '1.0',
        'knowledge': knowledge
    }
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(knowledge_with_meta, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Created knowledge JSON at {output_file}")

def update_custom_gpt_knowledge(knowledge: Dict[str, Any]):
    """Update the Custom GPT knowledge file"""
    
    gpt_knowledge_file = 'kyanostech_complete_knowledge_base.txt'
    
    if os.path.exists(gpt_knowledge_file):
        # Read existing knowledge
        with open(gpt_knowledge_file, 'r', encoding='utf-8') as f:
            existing_content = f.read()
        
        # Add updated timestamp at the top
        updated_content = f"# KyanosTech Business Plan - Knowledge Base\n"
        updated_content += f"# Last Updated: {get_timestamp()}\n"
        updated_content += f"# Auto-generated from latest content\n\n"
        updated_content += existing_content
        
        # Write back
        with open(gpt_knowledge_file, 'w', encoding='utf-8') as f:
            f.write(updated_content)
        
        print(f"✅ Updated Custom GPT knowledge base timestamp")
    else:
        print(f"⚠️  Custom GPT knowledge file not found: {gpt_knowledge_file}")

def get_timestamp():
    """Get current timestamp"""
    from datetime import datetime
    return datetime.now().isoformat()

def main():
    """Main execution function"""
    print("🤖 Updating KyanosTech Chatbot Knowledge Base...")
    
    # Extract knowledge from content
    knowledge = extract_key_sections()
    
    if not knowledge:
        print("❌ No content found to extract")
        return
    
    print(f"📚 Extracted knowledge for {len(knowledge)} sections")
    
    # Update HTML file
    update_chatbot_html(knowledge)
    
    # Create JSON file for dynamic loading
    create_knowledge_json(knowledge)
    
    # Update Custom GPT knowledge if needed
    update_custom_gpt_knowledge(knowledge)
    
    print("✨ Chatbot knowledge base updated successfully!")
    print("\n📋 Knowledge sections updated:")
    for section in knowledge.keys():
        print(f"  • {section}")

if __name__ == "__main__":
    main()