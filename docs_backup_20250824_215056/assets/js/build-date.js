(function(){
  var n=document.querySelector('.git-revision-date-localized-plugin-date');
  var t=n?(n.getAttribute('title')||n.textContent).trim():'';
  var f=document.querySelector('.md-footer');
  if(f){f.setAttribute('data-build-date',t||'');}
})();
