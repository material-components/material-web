import '@material/mwc-button';
import '@material/mwc-icon';

import '../shared/demo-header';

document.querySelectorAll('style[data-pre]').forEach((e) => {
  const preId = e.dataset.pre;
  const pre = document.querySelector('#' + preId);
  if (pre) {
    pre.innerText = e.innerText;
  }
});

addEventListener('load', function() {
  document.body.classList.remove('unresolved');
});