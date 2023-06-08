/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/iconbutton/standard-icon-button.js';
import '@material/web/icon/icon.js';

import {css, html, LitElement} from 'lit';
import {customElement, property, queryAssignedElements, state} from 'lit/decorators.js';

/**
 * A custom element that places a copy button at the top right corner of a
 * markdown-it codeblock. Injected into the page by the
 * /catalog/eleventy-helpers/plugins/copy-code-button.cjs markdown-it plugin.
 */
@customElement('copy-code-button')
export class CopyCodeButton extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: relative;
      --_border-radius: calc(var(--catalog-code-block-border-radius) / 4);
    }

    md-standard-icon-button {
      color: red;
      position: absolute;
      inset: var(--catalog-copy-code-button-inset, var(--_border-radius) var(--_border-radius) auto auto);
      --md-sys-color-on-surface-variant: var(--md-sys-color-on-surface);
    }
  `;

  private timeoutId: number|undefined;

  @state() private showCheckmark = false;

  /**
   * The aria label for the copy button when it has not been clicked.
   */
  @property() label = 'Copy code';

  /**
   * The aria label for the copy button when it has been clicked and the copy is
   * successul.
   */
  @property({attribute: 'success-label'}) successLabel = 'Copy successful';

  /**
   * The title to be set on the copy button.
   */
  @property({attribute: 'button-title'}) buttonTitle = 'Copy code';

  @queryAssignedElements({flatten: true, selector: '*'})
  private slottedEls!: NodeListOf<HTMLElement>;

  render() {
    const label = this.showCheckmark ? this.successLabel : this.label;
    const icon = this.showCheckmark ? 'check' : 'content_copy';
    return html`
      <slot></slot>
      <md-standard-icon-button @click=${this.onClick} title=${this.buttonTitle}>
        <md-icon aria-live="polite" aria-label=${label}>
          <span aria-hidden="true">${icon}</span>
        </md-icon>
      </md-standard-icon-button>
    `;
  }

  private async onClick() {
    await navigator.clipboard.writeText(this.getCopyText());
    this.onCopySuccess();
  }

  /**
   * Returns the text to be copied. By default, it copies the textContent of the
   * nodes slotted into the element. Override for custom functionality.
   */
  getCopyText() {
    let text = '';
    for (const el of this.slottedEls) {
      text += el.textContent;
    }

    return text;
  }

  private onCopySuccess() {
    this.showCheckmark = true;

    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
    }

    this.timeoutId = window.setTimeout(() => {
      this.showCheckmark = false;
    }, 2000);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'copy-code-button': CopyCodeButton;
  }
}
