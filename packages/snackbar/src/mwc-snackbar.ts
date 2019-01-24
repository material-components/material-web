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
import {BaseElement, html, property, query, customElement, Adapter, Foundation} from '@material/mwc-base/base-element.js';
import {style} from './mwc-snackbar-css.js';
import MDCSnackbarFoundation from '@material/snackbar/foundation.js';
import {getCorrectEventName} from '@material/animation/index.js';

const {SHOW_EVENT, HIDE_EVENT} = MDCSnackbarFoundation.strings;

export interface ActionData {
  message?: string;
  timeout?: number;
  actionText?: string,
  multiline?: boolean,
  actionOnBottom?: boolean,
  actionHandler?: Function,
}

export interface SnackbarFoundation extends Foundation {
  dismissesOnAction(): boolean;
  setDismissOnAction(value: boolean): void;
  show(data: ActionData): void;
}

export declare var SnackbarFoundation: {
  prototype: SnackbarFoundation;
  new(adapter: Adapter): SnackbarFoundation;
}

declare global {
  interface HTMLElementTagNameMap {
    'mwc-snackbar': Snackbar;
  }
}

@customElement('mwc-snackbar' as any)
export class Snackbar extends BaseElement {
  protected mdcFoundation!: SnackbarFoundation;

  protected readonly mdcFoundationClass: typeof SnackbarFoundation = MDCSnackbarFoundation;

  @query('.mdc-snackbar')
  protected mdcRoot!: HTMLElement

  @query('.mdc-snackbar__action-button')
  protected actionButton!: HTMLElement

  @query('.mdc-snackbar__text')
  protected textElement!: HTMLElement

  @property()
  message = '';

  @property({type: Number})
  timeout = 0;

  @property({})
  actionText = '';

  @property({type: Boolean, reflect: true})
  multiline = false;

  @property({type: Boolean, reflect: true})
  actionOnBottom = false;

  protected boundActionHandler = this._actionHandler.bind(this);

  static styles = style;

  render() {
    return html`
      <div class="mdc-snackbar"
        aria-live="assertive"
        aria-atomic="true"
        aria-hidden="true">
      <div class="mdc-snackbar__text"></div>
      <div class="mdc-snackbar__action-wrapper">
        <button type="button" class="mdc-snackbar__action-button"></button>
      </div>
    </div>`;
  }

  protected createAdapter() {
    return {
      ...super.createAdapter(),
      setAriaHidden: () => this.mdcRoot.setAttribute('aria-hidden', 'true'),
      unsetAriaHidden: () => this.mdcRoot.removeAttribute('aria-hidden'),
      setActionAriaHidden: () => this.actionButton.setAttribute('aria-hidden', 'true'),
      unsetActionAriaHidden: () => this.actionButton.removeAttribute('aria-hidden'),
      setActionText: (text: string) => this.actionButton.textContent = text,
      setMessageText: (text: string) => this.textElement.textContent = text,
      setFocus: () => this.actionButton.focus(),
      isFocused: () => this.shadowRoot!.activeElement === this.actionButton,
      visibilityIsHidden: () => document.hidden,
      registerCapturedBlurHandler: (handler: EventListener) =>
        this.actionButton.addEventListener('blur', handler, true),
      deregisterCapturedBlurHandler: (handler: EventListener) =>
        this.actionButton.removeEventListener('blur', handler, true),
      registerVisibilityChangeHandler: (handler: EventListener) =>
        document.addEventListener('visibilitychange', handler),
      deregisterVisibilityChangeHandler: (handler: EventListener) =>
        document.removeEventListener('visibilitychange', handler),
      registerCapturedInteractionHandler: (evtType: string, handler: EventListener) =>
        document.body.addEventListener(evtType, handler, true),
      deregisterCapturedInteractionHandler: (evtType: string, handler: EventListener) =>
        document.body.removeEventListener(evtType, handler, true),
      registerActionClickHandler: (handler: EventListener) =>
        this.actionButton.addEventListener('click', handler),
      deregisterActionClickHandler: (handler: EventListener) =>
        this.actionButton.removeEventListener('click', handler),
      registerTransitionEndHandler: (handler: EventListener) =>
        this.mdcRoot.addEventListener(getCorrectEventName(window, 'transitionend'), handler),
      deregisterTransitionEndHandler: (handler: EventListener) =>
        this.mdcRoot.removeEventListener(getCorrectEventName(window, 'transitionend'), handler),
      notifyShow: () => this.dispatchEvent(new CustomEvent(SHOW_EVENT, {bubbles: true, cancelable: true})),
      notifyHide: () => this.dispatchEvent(new CustomEvent(HIDE_EVENT, {bubbles: true, cancelable: true})),
    };
  }

  _actionHandler() {
    this.dispatchEvent(new CustomEvent('MDCSnackbar:action'));
  }

  show(data: ActionData) {
    const options: ActionData = {
      message: this.message,
      timeout: this.timeout,
      actionText: this.actionText,
      multiline: this.multiline,
      actionOnBottom: this.actionOnBottom,
      actionHandler: this.boundActionHandler,
    };
    this.mdcFoundation.show(Object.assign(options, data));
  }

  get dismissesOnAction() {
    return this.mdcFoundation.dismissesOnAction();
  }

  set dismissesOnAction(dismissesOnAction) {
    this.mdcFoundation.setDismissOnAction(dismissesOnAction);
  }
}
