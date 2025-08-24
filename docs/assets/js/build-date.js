(function () {
  function setFooterDate(s) {
    if (!s) return;
    // CSS var + attribute on the Material footer
    document.documentElement.style.setProperty('--build-date', '"' + s + '"');
    var f = document.querySelector('.md-footer');
    if (f) f.setAttribute('data-build-date', s);
  }

  function findDateInPage() {
    // Look for "Last updated:" label in the page body
    var root = document.querySelector('.md-content') || document;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var m;
    while (walker.nextNode()) {
      var t = walker.currentNode.nodeValue || '';
      if ((m = t.match(/Last updated:\s*([A-Za-z]+\s+\d{1,2},\s*\d{4})/))) {
        return m[1];
      }
    }
    return null;
  }

  function meta(name) {
    var el = document.querySelector('meta[name="'+name+'"]');
    return el && el.content ? el.content : null;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var d = findDateInPage() ||
            meta('build-date') ||
            (document.lastModified ? new Date(document.lastModified).toLocaleDateString(undefined, {year:'numeric', month:'long', day:'numeric'}) : null);
    setFooterDate(d);
  });
})();
