import '@material/mwc-top-app-bar';
import '@material/mwc-icon-button';
import '@material/mwc-button';

const bar = window.bar;

let isCustom = false;

window.prominentButton.addEventListener('click', () => {
  window.prominentButton.unelevated = !bar.prominent;
  bar.prominent = !bar.prominent;
});

window.centerButton.addEventListener('click', () => {
  window.centerButton.unelevated = !bar.centerTitle;
  bar.centerTitle = !bar.centerTitle;
});

window.denseButton.addEventListener('click', () => {
  window.denseButton.unelevated = !bar.dense;
  bar.dense = !bar.dense;
});

window.customButton.addEventListener('click', () => {
  window.customButton.unelevated = !isCustom;
  isCustom = !isCustom;

  if (isCustom) {
    bar.classList.add('custom');
  } else {
    bar.classList.remove('custom');
  }
});
