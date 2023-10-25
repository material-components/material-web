/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/icon/icon.js';
import '@material/web/iconbutton/icon-button.js';

import {MdIconButton} from '@material/web/iconbutton/icon-button.js';
import {css, html, LitElement} from 'lit';
import {
  customElement,
  property,
  query,
  queryAssignedElements,
  state,
} from 'lit/decorators.js';

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

    md-icon-button {
      color: red;
      position: absolute;
      inset: var(
        --catalog-copy-code-button-inset,
        var(--_border-radius) var(--_border-radius) auto auto
      );
      --md-sys-color-on-surface-variant: var(--md-sys-color-on-surface);
      --md-sys-color-primary: var(--md-sys-color-on-surface);
    }
  `;

  private timeoutId: number | undefined;

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

  @query('md-icon-button') private copyButton!: MdIconButton;

  @queryAssignedElements({flatten: true, selector: '*'})
  private slottedEls!: NodeListOf<HTMLElement>;

  render() {
    return html`
      <slot></slot>
      <md-icon-button
        toggle
        @click=${this.onClick}
        @input=${this.onInput}
        title=${this.buttonTitle}
        .selected=${this.showCheckmark}
        aria-label=${this.label}
        aria-label-selected=${this.successLabel}>
        <md-icon>content_copy</md-icon>
        <md-icon slot="selected">checkmark</md-icon>
      </md-icon-button>
    `;
  }

  private async onClick() {
    await navigator.clipboard.writeText(this.getCopyText());
    this.onCopySuccess();
  }

  private onInput() {
    this.showCheckmark = this.copyButton.selected;
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
