import '@material/mwc-menu';
import '@material/mwc-list/mwc-list-item';
import '@material/mwc-select';

import '../shared/demo-header';

window.basicMenu.anchor = window.basicButton;

window.basicButton.addEventListener('click', function() {
  window.basicMenu.open = !window.basicMenu.open;
});

window.cornerMenu.anchor = window.cornerButton;

window.cornerSelect.addEventListener('change', function() {
  window.cornerMenu.corner = window.cornerSelect.value;
});

window.cornerButton.addEventListener('click', function() {
  window.cornerMenu.open = !window.cornerMenu.open;
});

window.quickMenu.anchor = window.quickButton;

window.quickButton.addEventListener('click', function() {
  window.quickMenu.open = !window.quickMenu.open;
});

window.fixedMenu.anchor = window.fixedButton;

window.fixedButton.addEventListener('click', function() {
  window.fixedMenu.open = !window.fixedMenu.open;
});

window.nonfixedMenu.anchor = window.nonfixedButton;

window.nonfixedButton.addEventListener('click', function() {
  window.nonfixedMenu.open = !window.nonfixedMenu.open;
});

window.absoluteButton.addEventListener('click', function() {
  window.absoluteMenu.open = !window.absoluteMenu.open;
});

window.absoluteX.addEventListener('input', function() {
  window.absoluteMenu.x = Number(window.absoluteX.value);
});

window.absoluteY.addEventListener('input', function() {
  window.absoluteMenu.y = Number(window.absoluteY.value);
});

window.activatableMenu.anchor = window.activatableButton;

window.activatableButton.addEventListener('click', function() {
  window.activatableMenu.open = !window.activatableMenu.open;
});

window.multiMenu.anchor = window.multiButton;

window.multiButton.addEventListener('click', function() {
  window.multiMenu.open = !window.multiMenu.open;
});

window.groupedMenu.anchor = window.groupedButton;

window.groupedButton.addEventListener('click', function() {
  window.groupedMenu.open = !window.groupedMenu.open;
});

window.dfsMenu.anchor = window.dfsButton;

window.dfsSelect.addEventListener('change', function() {
  window.dfsMenu.defaultFocus = window.dfsSelect.value;
});

window.dfsButton.addEventListener('click', function() {
  window.dfsMenu.open = !window.dfsMenu.open;
});

window.absoluteLeftButton.addEventListener('click', function() {
  window.absoluteAnchorMenu.anchor = window.absoluteLeftButton;
  window.absoluteAnchorMenu.open = !window.absoluteAnchorMenu.open;
});

window.absoluteRightButton.addEventListener('click', function() {
  window.absoluteAnchorMenu.anchor = window.absoluteRightButton;
  window.absoluteAnchorMenu.open = !window.absoluteAnchorMenu.open;
});

addEventListener('load', function() {
  document.body.classList.remove('unresolved');
});
