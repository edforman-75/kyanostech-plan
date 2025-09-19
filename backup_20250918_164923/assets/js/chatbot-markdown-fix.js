// Kyanos Chatbot Markdown Rendering Enhancement
// This script enhances the existing chatbot to properly render markdown formatting

(function() {
    'use strict';
    
    // Wait for the page to load and chatbot to be initialized
    document.addEventListener('DOMContentLoaded', function() {
        // Wait a bit for the chatbot to be fully initialized
        setTimeout(enhanceChatbot, 500);
    });
    
    function enhanceChatbot() {
        // Check if addMessage function exists (from the existing chatbot)
        if (typeof window.addMessage === 'function') {
            console.log('Kyanos Chatbot: Enhancing markdown rendering...');
            
            // Store the original addMessage function
            const originalAddMessage = window.addMessage;
            
            // Create enhanced version with markdown support
            window.addMessage = function(content, sender) {
                // Process markdown formatting before passing to original function
                const formattedContent = formatMarkdown(content);
                return originalAddMessage(formattedContent, sender);
            };
            
            console.log('Kyanos Chatbot: Markdown rendering enhancement applied!');
        } else {
            console.log('Kyanos Chatbot: addMessage function not found, retrying...');
            // Retry after a short delay
            setTimeout(enhanceChatbot, 1000);
        }
    }
    
    /**
     * Convert markdown-style formatting to HTML
     * @param {string} text - Text with markdown formatting
     * @returns {string} - HTML formatted text
     */
    function formatMarkdown(text) {
        if (!text) return text;
        
        // More aggressive bold conversion - handle multiple patterns
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Convert *italic* to <em> (avoid conflicts with bold)
        text = text.replace(/(?<!\*)\*([^*\n]+?)\*(?!\*)/g, '<em>$1</em>');
        
        // Convert line breaks to <br>
        text = text.replace(/\n/g, '<br>');
        
        // Enhanced bullet point conversion - handle various formats
        text = text.replace(/^[•\-\*]\s+(.+)$/gm, '<div class="markdown-list-item bullet">• $1</div>');
        
        // Convert numbered lists (1. item)
        text = text.replace(/^\d+\.\s+(.+)$/gm, '<div class="markdown-list-item numbered">$1</div>');
        
        // Add spacing between list items
        text = text.replace(/(<\/div>)(?=<div class="markdown-list-item")/g, '$1<br>');
        
        // Convert simple links [text](url) to HTML links
        text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
        
        // Convert headings
        text = text.replace(/^###\s+(.+)$/gm, '<div class="markdown-heading h3">$1</div>');
        text = text.replace(/^##\s+(.+)$/gm, '<div class="markdown-heading h2">$1</div>');
        text = text.replace(/^#\s+(.+)$/gm, '<div class="markdown-heading h1">$1</div>');
        
        // Debug logging to console to help troubleshoot
        if (text.includes('**') || text.includes('*')) {
            console.log('Kyanos Chatbot: Remaining unprocessed markdown:', text.match(/\*+[^*]*\*+/g));
        }
        
        return text;
    }
    
    // Add CSS styles for markdown formatting
    const style = document.createElement('style');
    style.textContent = `
        .markdown-list-item {
            margin: 4px 0;
            padding-left: 8px;
        }
        
        .markdown-list-item.numbered {
            padding-left: 16px;
        }
        
        .markdown-heading {
            font-weight: bold;
            margin: 8px 0 4px 0;
        }
        
        .markdown-heading.h1 {
            font-size: 1.2em;
            color: #333;
        }
        
        .markdown-heading.h2 {
            font-size: 1.1em;
            color: #444;
        }
        
        .markdown-heading.h3 {
            font-size: 1.05em;
            color: #555;
        }
        
        /* Ensure bold text is visible and scannable in chat messages */
        .message strong {
            font-weight: 700 !important;
            color: inherit;
            background: rgba(79, 172, 254, 0.1);
            padding: 1px 3px;
            border-radius: 3px;
        }
        
        /* Style for links in chat messages */
        .message a {
            color: #4facfe;
            text-decoration: underline;
        }
        
        .message a:hover {
            color: #00f2fe;
        }
        
        /* Better spacing for formatted content */
        .message br + .markdown-list-item {
            margin-top: 8px;
        }
    `;
    document.head.appendChild(style);
    
})();