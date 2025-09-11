(function () {
  function decode(html) {
    var t = document.createElement('textarea');
    t.innerHTML = html;
    return t.value;
  }
  function apply() {
    document.querySelectorAll('a.fn-ref, sup.footnote-ref a').forEach(function (a) {
      var tip = a.getAttribute('data-fn') || (a.dataset ? a.dataset.fn : null);
      if (!tip) return;
      if (!a.hasAttribute('title')) a.setAttribute('title', decode(tip));
    });
  }
  document.addEventListener('DOMContentLoaded', apply);
  document.addEventListener('navigation', apply);              // Material instant nav
  var main = document.querySelector('main');
  if (main) main.addEventListener('md-content-ready', apply);  // Material content ready
  apply();
})();
