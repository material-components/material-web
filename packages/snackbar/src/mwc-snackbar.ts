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
import {BaseElement, html, property, query, observer, customElement, classMap, addHasRemoveClass} from '@material/mwc-base/base-element.js';
import {style} from './mwc-snackbar-css.js';
import MDCSnackbarFoundation from '@material/snackbar/foundation.js';
import {MDCSnackbarCloseEventDetail} from '@material/snackbar/types';
import * as util from '@material/snackbar/util';
import { MDCSnackbarAdapter } from '@material/snackbar/adapter.js';

const {OPENING_EVENT, OPENED_EVENT, CLOSING_EVENT, CLOSED_EVENT} = MDCSnackbarFoundation.strings;

declare global {
  interface HTMLElementTagNameMap {
    'mwc-snackbar': Snackbar;
  }
}

@customElement('mwc-snackbar' as any)
export class Snackbar extends BaseElement {
  protected mdcFoundation!: MDCSnackbarFoundation;

  protected readonly mdcFoundationClass = MDCSnackbarFoundation;

  @query('.mdc-snackbar')
  protected mdcRoot!: HTMLElement

  @query('.mdc-snackbar__label')
  protected labelElement!: HTMLElement

  @property({type: Boolean, reflect: true})
  isOpen = false;

  @observer(function(this: Snackbar, value: number) {
    this.mdcFoundation.setTimeoutMs(value);
  })
  @property({type: Number})
  timeoutMs = 5000;

  @observer(function(this: Snackbar, value: boolean) {
    this.mdcFoundation.setCloseOnEscape(value);
  })
  @property({type: Boolean})
  closeOnEscape = false;

  @property()
  labelText = '';

  @property({type: Boolean})
  stacked = false;

  @property({type: Boolean})
  leading = false;

  static styles = style;

  render() {
    const classes = {
      'mdc-snackbar--stacked': this.stacked,
      'mdc-snackbar--leading': this.leading,
    };
    return html`
      <div class="mdc-snackbar ${classMap(classes)}" @keydown="${this._handleKeydown}">
        <div class="mdc-snackbar__surface">
          <div class="mdc-snackbar__label"
               role="status"
               aria-live="polite">
            ${this.labelText}
          </div>
          <div class="mdc-snackbar__actions">
            <slot name="action" @click="${this._handleActionClick}"></slot>
            <slot name="dismiss" @click="${this._handleDismissClick}"></slot>
          </div>
        </div>
      </div>`;
  }

  protected createAdapter(): MDCSnackbarAdapter {
    return {
      ...addHasRemoveClass(this.mdcRoot),
      announce: () => util.announce(this.labelElement),
      notifyClosed: (reason: String) => {
        this.isOpen = false;
        this.dispatchEvent(new CustomEvent(CLOSED_EVENT,
          {bubbles: true, cancelable: true, detail: <MDCSnackbarCloseEventDetail>{reason: reason}}))
      },
      notifyClosing: (reason: String) => this.dispatchEvent(new CustomEvent(CLOSING_EVENT,
          {bubbles: true, cancelable: true, detail: <MDCSnackbarCloseEventDetail>{reason: reason}})),
      notifyOpened: () => {
        this.isOpen = true;
        this.dispatchEvent(new CustomEvent(OPENED_EVENT, {bubbles: true, cancelable: true}))
      },
      notifyOpening: () => this.dispatchEvent(new CustomEvent(OPENING_EVENT, {bubbles: true, cancelable: true})),
    };
  }

  open() {
    this.mdcFoundation.open();
  }

  close(reason = '') {
    this.mdcFoundation. close(reason);
  }

  _handleKeydown(e: KeyboardEvent) {
    this.mdcFoundation.handleKeyDown(e);
  }

  _handleActionClick(e: MouseEvent) {
    this.mdcFoundation.handleActionButtonClick(e);
  }

  _handleDismissClick(e: MouseEvent) {
    this.mdcFoundation.handleActionIconClick(e);
  }
}
