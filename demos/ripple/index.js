import '@material/mwc-ripple';
import {RippleHandlers} from '@material/mwc-ripple/ripple-handlers';

import '../shared/demo-header';

const ripples = Array.from(document.querySelectorAll('mwc-ripple:not(#customControls)'));

// note: you can also use the functions directly on the ripple, but ripple
// handlers is a useful structure for declaratively controlling ripple in lit.
// See implementation for mwc-button-base.ts
ripples.forEach((ripple) => {
  // argument must return thenable promiselike (see @queryAsync in LitElement)
  // Best practice for first load would be to not render the mwc-ripple until it
  // is needed which is typically on user interaction.
  const rh = new RippleHandlers(async () => ripple);
  const parent = ripple.parentNode;
  parent.addEventListener('mouseenter', rh.startHover);
  parent.addEventListener('mouseleave', rh.endHover);
  parent.addEventListener('mousedown', (e) => {
    const onMouseUp = () => {
      window.removeEventListener('mouseup', onMouseUp);
      rh.endPress();
    };

    window.addEventListener('mouseup', onMouseUp);
    rh.startPress(e);
  });
  parent.addEventListener('touchstart', (e) => {
    const onTouchEnd = () => {
      window.removeEventListener('touchend', onTouchEnd);
      rh.endPress();
    };

    window.addEventListener('touchend', onTouchEnd);
    rh.startPress(e);
  });
  parent.addEventListener('focus', rh.startFocus);
  parent.addEventListener('blur', rh.endFocus);
});

// Ripple controls can be fine tuned:
// e.g. do not ripple when interacting with input
const rh = new RippleHandlers(async () => window.customControls);
const parent = window.customControls.parentNode;
const input = window.customControlsInput;

let isParentHover = false;
let isInputHover = false;

input.addEventListener('mouseenter', () => {
  isInputHover = true;
  rh.endHover();
});
input.addEventListener('mouseleave', () => {
  isInputHover = false;
  if (isParentHover) {
    rh.startHover();
  }
});
parent.addEventListener('mouseenter', () => {
  isParentHover = true;

  if (isParentHover && !isInputHover) {
    rh.startHover();
  }
});
parent.addEventListener('mouseleave', () => {
  isParentHover = false;

  rh.endHover();
});
parent.addEventListener('mousedown', (e) => {
  const onMouseUp = () => {
    window.removeEventListener('mouseup', onMouseUp);
    rh.endPress();
  };

  window.addEventListener('mouseup', onMouseUp);
  if (e.target !== input) {
    rh.startPress(e);
  }
});
parent.addEventListener('touchstart', (e) => {
  const onTouchEnd = () => {
    window.removeEventListener('touchend', onTouchEnd);
    rh.endPress();
  };

  window.addEventListener('touchend', onTouchEnd);
  if (e.target !== input) {
    rh.startPress(e);
  }
});
parent.addEventListener('focus', rh.startFocus);
parent.addEventListener('blur', rh.endFocus);

addEventListener('load', function() {
  document.body.classList.remove('unresolved');
});
