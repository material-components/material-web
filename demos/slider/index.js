import '@material/mwc-slider';

import '../shared/demo-header';

function show(element, e) {
  element.textContent = `${e.detail.value}`;
}

Array.from(document.querySelectorAll('mwc-slider')).forEach(function(e) {
  e.addEventListener('input', function(e) {
    show(window.logInput, e)
  });
  e.addEventListener('change', function(e) {
    show(window.logChange, e)
  });
});

addEventListener('load', function() {
  document.body.classList.remove('unresolved');
});
