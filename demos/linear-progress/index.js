import '@material/mwc-linear-progress';
import '@material/mwc-button';

import '../shared/demo-header';

window.toggle.onclick = function() {
  window.progress1.closed = !window.progress1.closed;
};

addEventListener('load', function() {
  document.body.classList.remove('unresolved');
});
