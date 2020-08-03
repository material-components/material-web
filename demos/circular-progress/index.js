import '@material/mwc-circular-progress';
import '@material/mwc-circular-progress-four-color';
import '@material/mwc-button';

import '../shared/demo-header';

window.toggle.onclick = function() {
  window.progress1.closed = !window.progress1.closed;
};

addEventListener('load', function() {
  document.body.classList.remove('unresolved');
});
