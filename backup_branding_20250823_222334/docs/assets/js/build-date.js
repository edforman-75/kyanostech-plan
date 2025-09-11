(function () {
  function setFooterDate() {
    const footer = document.querySelector('footer.md-footer');
    const dateEl = document.querySelector('.git-revision-date-localized-plugin-date');
    if (footer && dateEl) {
      const text = (dateEl.textContent || '').trim();
      if (text) {
        footer.setAttribute('data-build-date', text);
        return true;
      }
    }
    return false;
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (setFooterDate()) return;

    // Try again on the next frame (helps when Material swaps content)
    requestAnimationFrame(() => { if (setFooterDate()) return; });

    // Keep watching — Material's instant navigation replaces page content
    const mo = new MutationObserver(() => { setFooterDate(); });
    mo.observe(document.body, { childList: true, subtree: true });
  });
})();
