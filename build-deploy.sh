#!/bin/bash

# KyanosTech Business Plan - Build & Deploy Script
# Ensures reliable builds and deployments with proper validation

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check for MkDocs
    if ! command -v mkdocs &> /dev/null; then
        print_error "MkDocs is not installed. Install with: pip install mkdocs-material"
        exit 1
    fi
    
    # Check for Netlify CLI (optional for local builds)
    if [ "$1" = "deploy" ] || [ "$1" = "deploy-prod" ]; then
        if ! command -v netlify &> /dev/null; then
            print_error "Netlify CLI is not installed. Install with: npm install -g netlify-cli"
            exit 1
        fi
    fi
    
    print_success "Prerequisites check passed"
}

# Function to create backup
create_backup() {
    print_status "Creating backup of current state..."
    BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    # Backup key files
    if [ -f "mkdocs.yml" ]; then cp "mkdocs.yml" "$BACKUP_DIR/"; fi
    if [ -f "docs/index.md" ]; then cp "docs/index.md" "$BACKUP_DIR/"; fi
    if [ -d "docs/assets" ]; then cp -r "docs/assets" "$BACKUP_DIR/"; fi
    if [ -d "netlify" ]; then cp -r "netlify" "$BACKUP_DIR/"; fi
    
    print_success "Backup created in $BACKUP_DIR"
}

# Function to validate navigation structure
validate_navigation() {
    print_status "Validating navigation structure..."
    
    if [ ! -f "mkdocs.yml" ]; then
        print_error "mkdocs.yml not found"
        exit 1
    fi
    
    # Extract markdown files from navigation
    nav_files=$(grep -E "\.md$" mkdocs.yml | sed 's/.*: //' | tr -d '"' | tr -d "'")
    
    missing_files=0
    for file in $nav_files; do
        if [ ! -f "docs/$file" ]; then
            print_warning "Missing file: docs/$file"
            missing_files=$((missing_files + 1))
        fi
    done
    
    if [ $missing_files -gt 0 ]; then
        print_error "Found $missing_files missing files referenced in navigation"
        exit 1
    fi
    
    print_success "All navigation files exist"
}

# Function to fix common configuration issues
fix_config_issues() {
    print_status "Fixing common link and configuration issues..."
    
    # Remove duplicate markdown_extensions if they exist
    if grep -q "markdown_extensions:" mkdocs.yml; then
        # Count occurrences
        count=$(grep -c "markdown_extensions:" mkdocs.yml)
        if [ $count -gt 1 ]; then
            print_warning "Found duplicate markdown_extensions sections, cleaning up..."
            # Keep only the first occurrence and remove duplicates
            awk '!seen[$0]++' mkdocs.yml > mkdocs_temp.yml && mv mkdocs_temp.yml mkdocs.yml
        fi
    fi
    
    print_success "Configuration issues fixed"
}

# Function to clean build directory
clean_build() {
    print_status "Cleaning previous build..."
    if [ -d "site" ]; then
        rm -rf site/
    fi
    print_success "Build directory cleaned"
}

# Function to build site
build_site() {
    print_status "Building site with MkDocs..."
    
    # Build the site
    mkdocs build
    
    if [ ! -d "site" ]; then
        print_error "Build failed - site directory not created"
        exit 1
    fi
    
    print_success "Site built successfully"
}

# Function to validate build output
validate_build() {
    print_status "Validating build output..."
    
    # Check for essential files
    if [ ! -f "site/index.html" ]; then
        print_error "Build validation failed - index.html not found"
        exit 1
    fi
    
    # Check for CSS and JS assets
    if [ ! -d "site/assets" ]; then
        print_warning "Assets directory not found in build output"
    fi
    
    print_success "Build validation passed"
}

# Function to deploy to Netlify
deploy_site() {
    local prod_flag=""
    if [ "$1" = "prod" ]; then
        prod_flag="--prod"
        print_status "Deploying to production..."
    else
        print_status "Deploying to preview..."
    fi
    
    netlify deploy $prod_flag
    
    print_success "Deployment successful"
}

# Main command handling
show_usage() {
    echo "🚀 KyanosTech Business Plan - Build & Deploy Script"
    echo "=================================================="
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  build        Build the site locally"
    echo "  deploy       Deploy to Netlify preview"
    echo "  deploy-prod  Deploy to Netlify production"
    echo "  validate     Validate configuration without building"
    echo "  help         Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 build        # Build locally for testing"
    echo "  $0 deploy       # Deploy to preview URL"
    echo "  $0 deploy-prod  # Deploy to production"
    echo ""
}

# Main execution
case "${1:-help}" in
    "build")
        echo "🚀 KyanosTech Business Plan - Build & Deploy Script"
        echo "=================================================="
        check_prerequisites "build"
        create_backup
        validate_navigation
        fix_config_issues
        clean_build
        build_site
        validate_build
        print_success "🎉 Build completed successfully!"
        ;;
    "deploy")
        echo "🚀 KyanosTech Business Plan - Build & Deploy Script"
        echo "=================================================="
        check_prerequisites "deploy"
        create_backup
        validate_navigation
        fix_config_issues
        clean_build
        build_site
        validate_build
        deploy_site "preview"
        print_success "🎉 Preview deployment completed!"
        ;;
    "deploy-prod")
        echo "🚀 KyanosTech Business Plan - Build & Deploy Script"
        echo "=================================================="
        check_prerequisites "deploy"
        create_backup
        validate_navigation
        fix_config_issues
        clean_build
        build_site
        validate_build
        deploy_site "prod"
        print_success "🎉 Production deployment completed!"
        ;;
    "validate")
        echo "🚀 KyanosTech Business Plan - Build & Deploy Script"
        echo "=================================================="
        check_prerequisites "validate"
        validate_navigation
        print_success "🎉 Validation completed!"
        ;;
    "help")
        show_usage
        ;;
    *)
        echo "Unknown command: $1"
        echo ""
        show_usage
        exit 1
        ;;
esac