import '@material/mwc-slider';
import '@material/mwc-slider/slider-range';

import '../shared/demo-header';

Array.from(document.querySelectorAll('mwc-slider')).forEach(function(e) {
  e.addEventListener('input', function(e) {
    window.logInput.textContent = `${e.target.value}`;
  });
  e.addEventListener('change', function(e) {
    window.logChange.textContent = `${e.target.value}`;
  });
});

Array.from(document.querySelectorAll('mwc-slider-range')).forEach(function(e) {
  e.addEventListener('input', function(e) {
    window.logInput.textContent =
        `start: ${e.target.valueStart}, end: ${e.target.valueEnd}`;
  });
  e.addEventListener('change', function(e) {
    window.logChange.textContent =
        `start: ${e.target.valueStart}, end: ${e.target.valueEnd}`;
  });
});

addEventListener('load', function() {
  document.body.classList.remove('unresolved');
});
