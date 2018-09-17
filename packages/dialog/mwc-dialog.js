/**
@license
Copyright 2018 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import {ComponentElement, MDCWebComponentMixin, html} from '@material/mwc-base/component-element.js';
import {classMap} from 'lit-html/directives/classMap.js';
import {MDCDialog} from './mdc-dialog.js';
import {style} from './mwc-dialog-css.js';
import 'wicg-inert/dist/inert.js';
import 'blocking-elements/blocking-elements.js';

export class MDCWCDialog extends MDCWebComponentMixin(MDCDialog) {
  createAdapter() {
    return {
      trapFocusOnSurface: () => {
        this.trapFocus(this.acceptButton_);
      },
      untrapFocusOnSurface: () => {
        this.untrapFocus();
      },
    };
  }

  trapFocus(element) {
    document.$blockingElements.push(this.host);
    element.focus();
  }

  untrapFocus() {
    document.$blockingElements.remove(this.host);
  }
}

export class Dialog extends ComponentElement {
  static get ComponentClass() {
    return MDCWCDialog;
  }

  static get componentSelector() {
    return '.mdc-dialog';
  }

  static get properties() {
    return {
      headerLabel: {type: String},
      acceptLabel: {type: String},
      declineLabel: {type: String},
      scrollable: {type: Boolean},
      opened: {type: Boolean},
    };
  }

  constructor() {
    super();
    this._asyncComponent = true;
    this.headerLabel = '';
    this.acceptLabel = 'OK';
    this.declineLabel = 'Cancel';
    this.scrollable = false;
  }

  renderStyle() {
    return style;
  }

  // TODO(sorvell): DialogFoundation's `isOff` method does not work with Shadow DOM
  // because it assumes a parentNode is parentElement (thing you can call getComputedStyle on)
  // TODO(sorvell) #css: added custom property
  render() {
    const {headerLabel, acceptLabel, declineLabel, scrollable} = this;
    return html`
      ${this.renderStyle()}
      <aside
        class="mdc-dialog"
        role="alertdialog"
        aria-labelledby="my-mdc-dialog-label"
        aria-describedby="my-mdc-dialog-description">
        <div class="mdc-dialog__surface">
          <header class="mdc-dialog__header">
            <h2 id="my-mdc-dialog-label" class="mdc-dialog__header__title">${headerLabel}</h2>
            <slot name="header"></slot>
          </header>
          <section id="my-mdc-dialog-description" class="mdc-dialog__body ${classMap({'mdc-dialog__body--scrollable': scrollable})}">
            <slot></slot>
          </section>
          <footer class="mdc-dialog__footer">
            <slot name="footer"></slot>
            <button type="button" class="mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--cancel">${declineLabel}</button>
      <button type="button" class="mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--accept">${acceptLabel}</button>
          </footer>
        </div>
        <div class="mdc-dialog__backdrop"></div>
      </aside>`;
  }

  get _backDrop() {
    return this.__backDrop || (this.__backDrop = this.shadowRoot.querySelector('.mdc-dialog__backdrop'));
  }

  get opened() {
    return this._component && this._component.open;
  }

  set opened(value) {
    if (value) {
      this.show();
    } else {
      this.close();
    }
  }

  show() {
    this.componentReady().then((component) => {
      component.show();
    });
  }

  close() {
    this.componentReady().then((component) => {
      component.close();
    });
  }
}

customElements.define('mwc-dialog', Dialog);
