#!/usr/bin/env python3
"""
KyanosTech Changelog Management

Helps maintain the site changelog with consistent formatting and organization.
"""

import os
import re
from datetime import datetime
from typing import List, Dict, Optional

def get_current_date():
    """Get current date in changelog format"""
    return datetime.now().strftime("%B %d, %Y")

def get_current_month_year():
    """Get current month/year for section headers"""
    return datetime.now().strftime("%B %Y")

def read_changelog():
    """Read current changelog content"""
    changelog_path = 'docs/changelog/index.md'
    
    if not os.path.exists(changelog_path):
        return ""
    
    with open(changelog_path, 'r', encoding='utf-8') as f:
        return f.read()

def write_changelog(content: str):
    """Write updated changelog content"""
    changelog_path = 'docs/changelog/index.md'
    
    with open(changelog_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ Updated changelog: {changelog_path}")

def add_entry(title: str, description: str, changes: List[str], entry_type: str = "Added"):
    """Add a new changelog entry"""
    
    current_content = read_changelog()
    current_date = get_current_date()
    current_month = get_current_month_year()
    
    # Create the new entry
    new_entry = f"\n### {current_date} - {title}\n"
    new_entry += f"**{entry_type}:** {description}\n"
    
    for change in changes:
        new_entry += f"- {change}\n"
    
    # Check if we need to add a new month section
    month_pattern = f"## {current_month}"
    if month_pattern not in current_content:
        # Add new month section
        header_pattern = r"(# Change Log\n\nThis is a \*\*living document\*\*[^\n]*\n)"
        if re.search(header_pattern, current_content):
            new_month_section = f"\n## {current_month}\n"
            current_content = re.sub(
                header_pattern,
                f"\\1{new_month_section}",
                current_content
            )
        else:
            # Fallback: add at the end
            current_content += f"\n## {current_month}\n"
    
    # Insert the new entry after the current month header
    month_section_pattern = f"(## {re.escape(current_month)}\n)"
    current_content = re.sub(
        month_section_pattern,
        f"\\1{new_entry}",
        current_content
    )
    
    write_changelog(current_content)
    
    print(f"📝 Added changelog entry: {title}")
    return new_entry

def interactive_add():
    """Interactive mode to add changelog entries"""
    print("🔄 KyanosTech Changelog Entry Creator")
    print("=====================================")
    
    title = input("Entry title (e.g., 'AI Chatbot Integration'): ").strip()
    if not title:
        print("❌ Title is required")
        return
    
    description = input("Brief description: ").strip()
    if not description:
        print("❌ Description is required")
        return
    
    entry_type = input("Entry type (Added/Changed/Fixed/Removed) [Added]: ").strip()
    if not entry_type:
        entry_type = "Added"
    
    print("\nEnter changes (one per line, empty line to finish):")
    changes = []
    while True:
        change = input("- ").strip()
        if not change:
            break
        changes.append(change)
    
    if not changes:
        print("❌ At least one change is required")
        return
    
    # Preview
    print("\n📋 Preview:")
    print(f"Title: {title}")
    print(f"Type: {entry_type}")
    print(f"Description: {description}")
    print("Changes:")
    for change in changes:
        print(f"  - {change}")
    
    confirm = input("\nAdd this entry? (y/n): ").strip().lower()
    if confirm in ['y', 'yes']:
        add_entry(title, description, changes, entry_type)
    else:
        print("❌ Entry cancelled")

def suggest_git_based_entries():
    """Suggest changelog entries based on recent git commits"""
    try:
        import subprocess
        
        # Get recent commits
        result = subprocess.run(
            ['git', 'log', '--oneline', '-10', '--since=1 week ago'],
            capture_output=True,
            text=True,
            cwd='.'
        )
        
        if result.returncode == 0 and result.stdout.strip():
            print("\n💡 Recent git commits (potential changelog entries):")
            print("=" * 50)
            for line in result.stdout.strip().split('\n'):
                print(f"  {line}")
            print("\nConsider adding significant changes to the changelog!")
        else:
            print("ℹ️  No recent git commits found")
            
    except (subprocess.SubprocessError, FileNotFoundError):
        print("⚠️  Could not check git commits (git not available)")

def main():
    """Main execution function"""
    import sys
    
    if len(sys.argv) > 1:
        if sys.argv[1] == 'add':
            interactive_add()
        elif sys.argv[1] == 'suggest':
            suggest_git_based_entries()
        else:
            print("Usage: python update_changelog.py [add|suggest]")
    else:
        print("KyanosTech Changelog Management")
        print("==============================")
        print()
        print("Commands:")
        print("  add     - Interactive entry creation")
        print("  suggest - Show recent git commits")
        print()
        print("Example usage:")
        print("  python scripts/update_changelog.py add")

if __name__ == "__main__":
    main()