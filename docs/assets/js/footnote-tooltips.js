// Attach tooltip text to each footnote reference
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("a.footnote-ref").forEach(ref => {
    const id = ref.getAttribute("href").substring(1);
    const note = document.getElementById(id);
    if (note) {
      ref.setAttribute("data-footnote", note.innerText.trim());
    }
  });
});
