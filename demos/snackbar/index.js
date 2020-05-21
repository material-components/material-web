import '@material/mwc-snackbar';
import '@material/mwc-button';
import '@material/mwc-textfield';

import '../shared/demo-header';

window.textfield.addEventListener('change', () => {
  if (!window.textfield.validity.valid) {
    return;
  }

  const newDuration = Number(window.textfield.value);
  let snackbarLabel = `Can't send photo. Retry in ${newDuration/1000} seconds.`;

  if (newDuration === -1) {
    snackbarLabel = 'Can\'t  send photo. Please retry.';
  }

  window.snack.timeoutMs = newDuration;
  window.snack.labelText = snackbarLabel;
});

window.textfield.validityTransform = (valueStr, validity) => {
  const value = Number(valueStr);
  if (value > 10000) {
    validity.rangeOverflow = true;
    validity.valid = false;
  } else if (value < 4000 && value !== -1) {
    validity.rangeUnderflow = true;
    validity.valid = false;
  }

  return validity;
};

window.snack1.onclick = function() {
  window.snack.stacked = false;
  window.snack.leading = false;
  window.snack.open = true;
};

window.snack2.onclick = function() {
  window.snack.stacked = false;
  window.snack.leading = true;
  // you can also use the show method
  window.snack.show();
};

window.snack3.onclick = function() {
  window.snack.stacked = true;
  window.snack.leading = false;
  window.snack.open = true;
};

addEventListener('load', function() {
  document.body.classList.remove('unresolved');
});