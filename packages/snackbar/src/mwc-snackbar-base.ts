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
import {directive, NodePart} from 'lit-html';

const {
  OPENING_EVENT,
  OPENED_EVENT,
  CLOSING_EVENT,
  CLOSED_EVENT,
  ARIA_LIVE_LABEL_TEXT_ATTR
} = MDCSnackbarFoundation.strings;

const {ARIA_LIVE_DELAY_MS} = MDCSnackbarFoundation.numbers;

export class SnackbarBase extends BaseElement {
  protected mdcFoundation!: MDCSnackbarFoundation;

  protected readonly mdcFoundationClass = MDCSnackbarFoundation;

  @query('.mdc-snackbar') protected mdcRoot!: HTMLElement;

  @query('.mdc-snackbar__label') protected labelElement!: HTMLElement;

  @property({type: Boolean, reflect: true}) isOpen = false;

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

  protected render() {
    const classes = {
      'mdc-snackbar--stacked': this.stacked,
      'mdc-snackbar--leading': this.leading,
    };
    return html`
      <div class="mdc-snackbar ${classMap(classes)}" @keydown="${
        this._handleKeydown}">
        <div class="mdc-snackbar__surface">${
        accessibleLabel(this.labelText, this.isOpen)}
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
      // We handle announce ourselves with the accessible directive.
      announce: () => {},
      notifyClosed: (reason: string) => {
        this.dispatchEvent(new CustomEvent<MDCSnackbarCloseEventDetail>(
            CLOSED_EVENT,
            {bubbles: true, cancelable: true, detail: {reason: reason}}));
      },
      notifyClosing: (reason: string) => {
        this.isOpen = false;
        this.dispatchEvent(new CustomEvent(
            CLOSING_EVENT,
            {bubbles: true, cancelable: true, detail: {reason: reason}}));
      },
      notifyOpened: () => {
        this.dispatchEvent(
            new CustomEvent(OPENED_EVENT, {bubbles: true, cancelable: true}));
      },
      notifyOpening: () => {
        this.isOpen = true;
        this.dispatchEvent(
            new CustomEvent(OPENING_EVENT, {bubbles: true, cancelable: true}));
      },
    };
  }

  open() {
    this.isOpen = true;
    if (this.mdcFoundation !== undefined) {
      this.mdcFoundation.open();
    }
  }

  close(reason = '') {
    this.isOpen = false;
    if (this.mdcFoundation !== undefined) {
      this.mdcFoundation.close(reason);
    }
  }

  protected firstUpdated() {
    super.firstUpdated();
    if (this.isOpen) {
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

/**
 * Maps an accessibleLabel container part to its label element and the timeoutID
 * of the task that restores its text content from ::before back to textContent.
 */
const accessibleLabelState = new WeakMap<NodePart, {
  labelEl: Element,
  timerId: number | null,
}>();

/**
 * A lit directive implementation of @material/mdc-snackbar/util.ts#announce,
 * which does some tricks to ensure that snackbar labels will be handled
 * correctly by screen readers.
 *
 * The existing MDC announce util function is difficult to use directly here,
 * because Lit can crash when DOM that it is managing changes outside of its
 * purvue. In this case, we would render our labelText as the text content of
 * the label div, but the MDC announce function then clears that text content,
 * and resets it after a timeout (see below for why). We do the same thing here,
 * but in a way that fits into Lit's lifecycle.
 *
 * TODO(aomarks) Investigate whether this can be simplified; but to do that we
 * first need testing infrastructure to verify that it remains compatible with
 * screen readers. For example, can we just create an entirely new label node
 * every time we open or labelText changes? If not, and the async text/::before
 * swap is strictly required, can we at elast make this directive more generic
 * (e.g. so that we don't hard-code the name of the label class).
 */
const accessibleLabel =
    directive((labelText: string, isOpen: boolean) => (part: NodePart) => {
      if (!isOpen) {
        // We never need to do anything if we're closed, even if the label also
        // changed in this batch of changes. We'll fully reset the label text
        // whenever we next open.
        return;
      }

      let maybeState = accessibleLabelState.get(part);
      if (maybeState === undefined) {
        // Create the label element once, the first time we open.
        const labelEl = document.createElement('div');
        labelEl.setAttribute('class', 'mdc-snackbar__label');
        labelEl.setAttribute('role', 'status');
        labelEl.setAttribute('aria-live', 'polite');
        labelEl.textContent = labelText;
        part.endNode.parentNode!.insertBefore(labelEl, part.endNode);
        maybeState = {
          labelEl,
          timerId: null,
        };
        accessibleLabelState.set(part, maybeState);
        // No need to do anything more for ARIA the first time we open. We just
        // created the element with the current label, so screen readers will
        // detect it fine.
        return;
      }

      const state = maybeState;
      const labelEl = state.labelEl;

      // Temporarily disable `aria-live` to prevent JAWS+Firefox from announcing
      // the message twice.
      labelEl.setAttribute('aria-live', 'off');

      // Temporarily clear `textContent` to force a DOM mutation event that will
      // be detected by screen readers. `aria-live` elements are only announced
      // when the element's `textContent` *changes*, so snackbars sent to the
      // browser in the initial HTML response won't be read unless we clear the
      // element's `textContent` first. Similarly, displaying the same snackbar
      // message twice in a row doesn't trigger a DOM mutation event, so screen
      // readers won't announce the second message unless we first clear
      // `textContent`.
      //
      // We have to clear the label text two different ways to make it work in
      // all browsers and screen readers:
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
      labelEl.textContent = '';
      labelEl.innerHTML =
          '<span style="display: inline-block; width: 0; height: 1px;">' +
          '&nbsp;</span>';

      // Prevent visual jank by temporarily displaying the label text in the
      // ::before pseudo-element. CSS generated content is normally announced by
      // screen readers (except in IE 11; see
      // https://tink.uk/accessibility-support-for-css-generated-content/);
      // however, `aria-live` is turned off, so this DOM update will be ignored
      // by screen readers.
      labelEl.setAttribute(ARIA_LIVE_LABEL_TEXT_ATTR, labelText);

      if (state.timerId !== null) {
        // We hadn't yet swapped the textContent back in since the last time we
        // opened or changed the label. Cancel that task so we don't clobber the
        // new label.
        clearTimeout(state.timerId);
      }

      state.timerId = window.setTimeout(() => {
        state.timerId = null;

        // Allow screen readers to announce changes to the DOM again.
        labelEl.setAttribute('aria-live', 'polite');

        // Remove the message from the ::before pseudo-element.
        labelEl.removeAttribute(ARIA_LIVE_LABEL_TEXT_ATTR);

        // Restore the original label text, which will be announced by
        // screen readers.
        labelEl.textContent = labelText;
      }, ARIA_LIVE_DELAY_MS);
    });
