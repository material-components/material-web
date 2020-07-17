import '@material/mwc-dialog';
import '@material/mwc-button';
import '@material/mwc-textfield';

import '../shared/demo-header';

addEventListener('load', function() {
 document.body.classList.remove('unresolved');
});

const buttons = document.body.querySelectorAll('mwc-button[data-num]');

for (let i = 0; i < buttons.length; i++) {
  const button = buttons[i];
  const buttonNum = button.dataset.num;

  const listenerFactory = (numButton) => {
    return function() {
      const dialog = document.body.querySelector('#dialog' + numButton);
      dialog.open = true;
    };
  };

  const listener = listenerFactory(buttonNum);

  button.addEventListener('click', listener);
}

window.toggleActions.onclick = function() {
  const dialog = document.body.querySelector('#dialog4');
  const hideActionSpan = document.body.querySelector('#hideActionVal');

  const hideAction = !dialog.hideActions;
  dialog.hideActions = hideAction;
  hideActionSpan.innerText = hideAction;
};
