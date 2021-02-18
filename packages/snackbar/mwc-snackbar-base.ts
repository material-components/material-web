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
import {addHasRemoveClass, BaseElement} from '@material/mwc-base/base-element';
import {observer} from '@material/mwc-base/observer';
import {MDCSnackbarAdapter} from '@material/snackbar/adapter';
import MDCSnackbarFoundation from '@material/snackbar/foundation';
import {MDCSnackbarCloseEventDetail} from '@material/snackbar/types';
import {html, property, query, TemplateResult} from 'lit-element';
import {classMap} from 'lit-html/directives/class-map';
import {ifDefined} from 'lit-html/directives/if-defined';

const {ARIA_LIVE_DELAY_MS} = MDCSnackbarFoundation.numbers;

const {
  OPENING_EVENT,
  OPENED_EVENT,
  CLOSING_EVENT,
  CLOSED_EVENT,
} = MDCSnackbarFoundation.strings;

export class SnackbarBase extends BaseElement {
  protected mdcFoundation!: MDCSnackbarFoundation;

  protected readonly mdcFoundationClass = MDCSnackbarFoundation;

  @query('.mdc-snackbar') protected mdcRoot!: HTMLElement;

  @query('.mdc-snackbar__label') protected labelElement!: HTMLElement;

  @property({type: Boolean, reflect: true})
  @observer(function(this: SnackbarBase, value: boolean) {
    if (this.mdcFoundation) {
      if (value) {
        this.mdcFoundation.open();
      } else {
        this.mdcFoundation.close(this.reason);
        this.reason = '';
      }
    }
  })
  open = false;

  @observer(function(this: SnackbarBase, value: number) {
    this.mdcFoundation.setTimeoutMs(value);
  })
  @property({type: Number})
  timeoutMs = 5000;

  @observer(function(this: SnackbarBase, value: boolean) {
    this.mdcFoundation.setCloseOnEscape(value);
  })
  @property({type: Boolean})
  closeOnEscape = false;

  @property({type: String}) labelText = '';

  @property({type: Boolean}) stacked = false;

  @property({type: Boolean}) leading = false;

  protected reason = '';
  protected announcingContents: TemplateResult|undefined = undefined;
  protected internalAriaLive: 'off'|'polite' = 'polite';
  protected liveLabelText: string|undefined;
  protected timeoutId: number|undefined;

  protected render(): TemplateResult {
    const classes = {
      'mdc-snackbar--stacked': this.stacked,
      'mdc-snackbar--leading': this.leading,
    };

    const labelContents = this.announcingContents ?? this.labelText;

    return html`
      <div class="mdc-snackbar ${classMap(classes)}" @keydown="${
        this._handleKeydown}">
        <div class="mdc-snackbar__surface">
          <div
              class="mdc-snackbar__label"
              data-mdc-snackbar-label-text=${ifDefined(this.liveLabelText)}
              aria-live=${this.internalAriaLive}><!--
            Label contents must have no extra spacing
            -->${labelContents}<!--
            --></div>
          <div class="mdc-snackbar__actions">
            <slot name="action" @click="${this._handleActionClick}"></slot>
            <slot name="dismiss" @click="${this._handleDismissClick}"></slot>
          </div>
        </div>
      </div>`;
  }

  protected renderLabel(
      labelContent: TemplateResult|string, ariaLive: 'polite'|'off',
      liveLabelText?: string) {
    return html`
      <div
          class="mdc-snackbar__label"
          role="status"
          aria-live=${ariaLive}
          data-mdc-snackbar-label-text=${ifDefined(liveLabelText)}>
        ${labelContent}
      </div>`;
  }

  protected createAdapter(): MDCSnackbarAdapter {
    return {
      ...addHasRemoveClass(this.mdcRoot),
      announce: () => {
        this.announce();
      },
      notifyClosed: (reason: string) => {
        this.dispatchEvent(new CustomEvent<MDCSnackbarCloseEventDetail>(
            CLOSED_EVENT,
            {bubbles: true, cancelable: true, detail: {reason: reason}}));
      },
      notifyClosing: (reason: string) => {
        this.open = false;
        this.dispatchEvent(new CustomEvent(
            CLOSING_EVENT,
            {bubbles: true, cancelable: true, detail: {reason: reason}}));
      },
      notifyOpened: () => {
        this.dispatchEvent(
            new CustomEvent(OPENED_EVENT, {bubbles: true, cancelable: true}));
      },
      notifyOpening: () => {
        this.open = true;
        this.dispatchEvent(
            new CustomEvent(OPENING_EVENT, {bubbles: true, cancelable: true}));
      },
    };
  }

  /** @export */
  show() {
    this.open = true;
  }

  /** @export */
  close(reason = '') {
    this.reason = reason;
    this.open = false;
  }

  protected firstUpdated() {
    super.firstUpdated();
    if (this.open) {
      this.mdcFoundation.open();
    }
  }

  protected _handleKeydown(e: KeyboardEvent) {
    this.mdcFoundation.handleKeyDown(e);
  }

  protected _handleActionClick(e: MouseEvent) {
    this.mdcFoundation.handleActionButtonClick(e);
  }

  protected _handleDismissClick(e: MouseEvent) {
    this.mdcFoundation.handleActionIconClick(e);
  }

  protected async announce() {
    const priority = this.internalAriaLive;

    // Trim text to ignore `&nbsp;` (see below).
    // textContent is only null if the node is a document, DOCTYPE, or notation.
    if (!this.labelText || !priority) {
      return;
    }

    // Temporarily disable `aria-live` to prevent JAWS+Firefox from announcing
    // the message twice.
    this.internalAriaLive = 'off';

    // Temporarily clear `textContent` to force a DOM mutation event that will
    // be detected by screen readers. `aria-live` elements are only announced
    // when the element's `textContent` *changes*, so snackbars sent to the
    // browser in the initial HTML response won't be read unless we clear the
    // element's `textContent` first. Similarly, displaying the same snackbar
    // message twice in a row doesn't trigger a DOM mutation event, so screen
    // readers won't announce the second message unless we first clear
    // `textContent`.
    //
    // We have to clear the label text two different ways to make it work in all
    // browsers and screen readers:
    //
    //   1. `textContent = ''` is required for IE11 + JAWS
    //   2. `innerHTML = '&nbsp;'` is required for Chrome + JAWS and NVDA
    //
    // All other browser/screen reader combinations support both methods.
    //
    // The wrapper `<span>` visually hides the space character so that it
    // doesn't cause jank when added/removed. N.B.: Setting `position:
    // absolute`, `opacity: 0`, or `height: 0` prevents Chrome from detecting
    // the DOM change.
    //
    // This technique has been tested in:
    //
    //   * JAWS 2019:
    //       - Chrome 70
    //       - Firefox 60 (ESR)
    //       - IE 11
    //   * NVDA 2018:
    //       - Chrome 70
    //       - Firefox 60 (ESR)
    //       - IE 11
    //   * ChromeVox 53
    this.announcingContents =
        html`<span style="display: inline-block; width: 0; height: 1px;">&nbsp;</span>`;

    // Prevent visual jank by temporarily displaying the label text in the
    // ::before pseudo-element. CSS generated content is normally announced by
    // screen readers (except in IE 11; see
    // https://tink.uk/accessibility-support-for-css-generated-content/);
    // however, `aria-live` is turned off, so this DOM update will be ignored by
    // screen readers.
    this.liveLabelText = this.labelText;

    this.requestUpdate();
    await this.updateComplete;

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      // Allow screen readers to announce changes to the DOM again.
      this.internalAriaLive = priority;

      // Remove the message from the ::before pseudo-element.
      this.liveLabelText = undefined;

      // Restore the original label text, which will be announced by screen
      // readers.
      this.announcingContents = undefined;
      this.timeoutId = undefined;
      this.requestUpdate();
    }, ARIA_LIVE_DELAY_MS);
  }
}
