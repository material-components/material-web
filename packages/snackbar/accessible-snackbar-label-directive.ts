/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore

import MDCSnackbarFoundation from '@material/snackbar/foundation';
import {html, render, TemplateResult} from 'lit-html';
import {AsyncDirective} from 'lit-html/async-directive.js';
import {ChildPart, directive, DirectiveParameters, PartInfo, PartType} from 'lit-html/directive.js';

const {ARIA_LIVE_DELAY_MS} = MDCSnackbarFoundation.numbers;
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
class AccessibleSnackbarLabel extends AsyncDirective {
  protected labelEl: HTMLElement|null = null;
  protected timerId: number|null = null;
  protected previousPart: ChildPart|null = null;

  constructor(partInfo: PartInfo) {
    super(partInfo);

    if (partInfo.type !== PartType.CHILD) {
      throw new Error('AccessibleSnackbarLabel only supports child parts.');
    }
  }

  override update(part: ChildPart, [
    labelText, isOpen
  ]: DirectiveParameters<this>) {
    if (!isOpen) {
      // We never need to do anything if we're closed, even if the label also
      // changed in this batch of changes. We'll fully reset the label text
      // whenever we next open.
      return;
    }

    if (this.labelEl === null) {
      // Create the label element once, the first time we open.
      const wrapperEl = document.createElement('div');
      const labelTemplate =
          html`<div class="mdc-snackbar__label" role="status" aria-live="polite">${
              labelText}</div>`;

      render(labelTemplate, wrapperEl);

      const labelEl = wrapperEl.firstElementChild! as HTMLElement;
      // endNode can't be a Document, so it must have a parent.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      part.endNode?.parentNode!.insertBefore(labelEl, part.endNode);
      this.labelEl = labelEl;
      // No need to do anything more for ARIA the first time we open. We just
      // created the element with the current label, so screen readers will
      // detect it fine.
      return labelEl;
    }

    const labelEl = this.labelEl;

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
    //   2. the lit-html render of `'&nbsp;'` is required for Chrome + JAWS and
    //       NVDA
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
    const spaceTemplate =
        html`<span style="display: inline-block; width: 0; height: 1px;">&nbsp;</span>`;
    render(spaceTemplate, labelEl);

    // Prevent visual jank by temporarily displaying the label text in the
    // ::before pseudo-element. CSS generated content is normally announced by
    // screen readers (except in IE 11; see
    // https://tink.uk/accessibility-support-for-css-generated-content/);
    // however, `aria-live` is turned off, so this DOM update will be ignored
    // by screen readers.
    labelEl.setAttribute('data-mdc-snackbar-label-text', labelText);

    if (this.timerId !== null) {
      // We hadn't yet swapped the textContent back in since the last time we
      // opened or changed the label. Cancel that task so we don't clobber the
      // new label.
      clearTimeout(this.timerId);
    }

    this.timerId = window.setTimeout(() => {
      this.timerId = null;

      // Allow screen readers to announce changes to the DOM again.
      labelEl.setAttribute('aria-live', 'polite');

      // Remove the message from the ::before pseudo-element.
      labelEl.removeAttribute('data-mdc-snackbar-label-text');

      // Restore the original label text, which will be announced by
      // screen readers.
      labelEl.textContent = labelText;

      this.setValue(this.labelEl);
    }, ARIA_LIVE_DELAY_MS);

    return labelEl;
  }

  render(labelText: string, isOpen: boolean): TemplateResult {
    if (!isOpen) {
      return html``;
    }

    return html`
      <div class="mdc-snackbar__label" role="status" aria-live="polite">${
        labelText}</div>`;
  }
}

export const accessibleSnackbarLabel = directive(AccessibleSnackbarLabel);
