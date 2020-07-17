import {LitElement, html} from 'lit-element/lit-element.js';

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

class DialogWithFormValidation extends LitElement {  
  static get properties() {
    return {
      open: {type: Boolean},
      isDisabled: {type: Boolean},
    };
  }

  constructor() {
    super();
    this.isDisabled = true;
  }

  onInputListener(e) {
    this.isDisabled = !e.target.checkValidity();
  }

  onClosingListener(e) {
    this.open = false

    // we could call APIs here ...
  }

  render() {
    return html`
      <mwc-dialog
        @closing="${this.onClosingListener}"
        heading="Form Validation"
        .open="${this.open}">
        <div>
          Our primary action button will be disabled
          until our textfield has valid input!
        </div>
        <mwc-textfield
            dialogInitialFocus
            @input="${this.onInputListener}"
            label="Name"
            pattern="^[a-zA-Z]{3,}$"
            placeholder="Casey"
            required
            type="text">
        </mwc-textfield>
        <mwc-button
          dialogAction="close"
          ?disabled="${this.isDisabled}"
          slot="primaryAction">
          Primary
        </mwc-button>
        <mwc-button slot="secondaryAction" dialogAction="close">
          Secondary
        </mwc-button>
      </mwc-dialog>
    `;
  }
}

customElements.define('dialog-with-form-validation', DialogWithFormValidation);
