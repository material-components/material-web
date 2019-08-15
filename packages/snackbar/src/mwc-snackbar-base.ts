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
import {addHasRemoveClass, BaseElement, classMap, html, observer, property, query} from '@material/mwc-base/base-element.js';
import {MDCSnackbarAdapter} from '@material/snackbar/adapter.js';
import MDCSnackbarFoundation from '@material/snackbar/foundation.js';
import {MDCSnackbarCloseEventDetail} from '@material/snackbar/types';
import * as util from '@material/snackbar/util';

const {OPENING_EVENT, OPENED_EVENT, CLOSING_EVENT, CLOSED_EVENT} =
    MDCSnackbarFoundation.strings;

export class SnackbarBase extends BaseElement {
  protected mdcFoundation!: MDCSnackbarFoundation;

  protected readonly mdcFoundationClass = MDCSnackbarFoundation;

  @query('.mdc-snackbar') protected mdcRoot!: HTMLElement;

  @query('.mdc-snackbar__label') protected labelElement!: HTMLElement;

  @property({type: Boolean, reflect: true}) public isOpen = false;

  @observer(function(this: SnackbarBase, value: number) {
    this.mdcFoundation.setTimeoutMs(value);
  })
  @property({type: Number})
  public timeoutMs = 5000;

  @observer(function(this: SnackbarBase, value: boolean) {
    this.mdcFoundation.setCloseOnEscape(value);
  })
  @property({type: Boolean})
  public closeOnEscape = false;

  @property() public labelText = '';

  @property({type: Boolean}) public stacked = false;

  @property({type: Boolean}) public leading = false;

  /**
   * We can't open the snackbar until the foundation is initialized, but that
   * doesn't happen until firstUpdated. Keep track of early calls to open() and
   * do so after we have a foundation.
   */
  private _earlyOpen: boolean|undefined;

  protected render() {
    const classes = {
      'mdc-snackbar--stacked': this.stacked,
      'mdc-snackbar--leading': this.leading,
    };
    return html`
      <div class="mdc-snackbar ${classMap(classes)}" @keydown="${
        this._handleKeydown}">
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
      notifyClosed: (reason: string) => {
        this.isOpen = false;
        this.dispatchEvent(new CustomEvent(CLOSED_EVENT, {
          bubbles: true,
          cancelable: true,
          /* eslint-disable
             @typescript-eslint/no-angle-bracket-type-assertion,@typescript-eslint/no-object-literal-type-assertion
           */
          detail: <MDCSnackbarCloseEventDetail> {
            reason: reason
          }
          /* eslint-enable
             @typescript-eslint/no-angle-bracket-type-assertion,@typescript-eslint/no-object-literal-type-assertion
           */
        }));
      },
      notifyClosing: (
          reason: string) => this.dispatchEvent(new CustomEvent(CLOSING_EVENT, {
        bubbles: true,
        cancelable: true,
        /* eslint-disable
           @typescript-eslint/no-angle-bracket-type-assertion,@typescript-eslint/no-object-literal-type-assertion
         */
        detail: <MDCSnackbarCloseEventDetail> {
          reason: reason
        }
        /* eslint-enable
           @typescript-eslint/no-angle-bracket-type-assertion,@typescript-eslint/no-object-literal-type-assertion
         */
      })),
      notifyOpened: () => {
        this.isOpen = true;
        this.dispatchEvent(
            new CustomEvent(OPENED_EVENT, {bubbles: true, cancelable: true}));
      },
      notifyOpening: () => this.dispatchEvent(
          new CustomEvent(OPENING_EVENT, {bubbles: true, cancelable: true})),
    };
  }

  public open() {
    if (this.mdcFoundation !== undefined) {
      this.mdcFoundation.open();
    } else {
      this._earlyOpen = true;
    }
  }

  public close(reason = '') {
    if (this.mdcFoundation !== undefined) {
      this.mdcFoundation.close(reason);
    } else if (this._earlyOpen === true) {
      this._earlyOpen = false;
    }
  }

  protected firstUpdated() {
    super.firstUpdated();
    if (this._earlyOpen === true) {
      this.mdcFoundation.open();
    }
  }

  private _handleKeydown(e: KeyboardEvent) {
    this.mdcFoundation.handleKeyDown(e);
  }

  private _handleActionClick(e: MouseEvent) {
    this.mdcFoundation.handleActionButtonClick(e);
  }

  private _handleDismissClick(e: MouseEvent) {
    this.mdcFoundation.handleActionIconClick(e);
  }
}
