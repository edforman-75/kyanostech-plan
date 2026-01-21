// Hamburger menu and footer copyright
document.addEventListener('DOMContentLoaded', function() {
  // Add copyright to footer nav (works on all devices)
  const footerInner = document.querySelector('.md-footer-nav__inner');
  if (footerInner) {
    const copyright = document.createElement('div');
    copyright.className = 'footer-copyright';
    copyright.innerHTML = '© 2026 KyanosTech<br><a href="https://squidfunk.github.io/mkdocs-material/">Material for MkDocs</a>';

    // Insert between prev and next links
    const nextLink = footerInner.querySelector('.md-footer-nav__link--next');
    if (nextLink) {
      footerInner.insertBefore(copyright, nextLink);
    } else {
      footerInner.appendChild(copyright);
    }
  }

  // Hamburger menu - only apply on desktop
  if (window.innerWidth < 1220) return;

  // Create hamburger button
  const hamburger = document.createElement('button');
  hamburger.className = 'hamburger-btn';
  hamburger.setAttribute('aria-label', 'Toggle navigation menu');
  hamburger.innerHTML = '<span></span><span></span><span></span>';
  document.body.appendChild(hamburger);

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'menu-overlay';
  document.body.appendChild(overlay);

  // Get sidebar
  const sidebar = document.querySelector('.md-sidebar--primary');

  // Toggle function
  function toggleMenu() {
    hamburger.classList.toggle('open');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
    document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
  }

  // Event listeners
  hamburger.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', toggleMenu);

  // Close on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
      toggleMenu();
    }
  });

  // Close menu when clicking a nav link
  sidebar.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function() {
      if (sidebar.classList.contains('open')) {
        toggleMenu();
      }
    });
  });
});
