import '@material/mwc-select';
import '@material/mwc-list/mwc-list-item';
import '@material/mwc-button';

import '../shared/demo-header';

addEventListener('load', () => document.body.classList.remove('unresolved'));

window.filled.addEventListener('change', function() {
  window.filledValue.innerText = window.filled.value;
});

window.outlined.addEventListener('change', function() {
  window.outlinedValue.innerText = window.outlined.value;
});

window.preselected.addEventListener('change', function() {
  window.preselectedValue.innerText = window.preselected.value;
});

window.reqFilled.addEventListener('change', function() {
  window.reqFilledValue.innerText = window.reqFilled.value;
  window.reqFilledValid.innerText = window.reqFilled.validity.valid;
});

window.reqOutlined.addEventListener('change', function() {
  window.reqOutlinedValue.innerText = window.reqOutlined.value;
  window.reqOutlinedValid.innerText = window.reqOutlined.validity.valid;
});

window.disabledOptions.addEventListener('change', function() {
  window.disabledOptionsValue.innerText = window.disabledOptions.value;
});

window.naturalButton.addEventListener('click', function() {
  window.naturalOptions.naturalMenuWidth = !window.naturalOptions.naturalMenuWidth;
  window.naturalValue.innerText = window.naturalOptions.naturalMenuWidth;
});

window.shortNaturalButton.addEventListener('click', function() {
  window.shortNaturalOptions.naturalMenuWidth = !window.shortNaturalOptions.naturalMenuWidth;
  window.shortNaturalValue.innerText = window.shortNaturalOptions.naturalMenuWidth;
});

window.fullwidthButton.addEventListener('click', function() {
  window.fullwidthOptions.fullwidth = !window.fullwidthOptions.fullwidth;
  window.fullwidthValue.innerText = window.fullwidthOptions.fullwidth;
});