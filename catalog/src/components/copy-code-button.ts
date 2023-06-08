/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/iconbutton/standard-icon-button.js';
import '@material/web/icon/icon.js';

import {css, html, LitElement} from 'lit';
import {customElement, queryAssignedElements, state} from 'lit/decorators.js';

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
      inset: var(--_border-radius) var(--_border-radius) auto auto;
      --md-sys-color-on-surface-variant: var(--md-sys-color-on-surface);
    }
  `;

  private timeoutId: number|undefined;

  @state() private showCheckmark = false;

  @queryAssignedElements({flatten: true, selector: '*'})
  private slottedEls!: NodeListOf<HTMLElement>;

  render() {
    const label = this.showCheckmark ? 'copy successful' : 'copy code';
    const icon = this.showCheckmark ? 'check' : 'content_copy';
    return html`
      <slot></slot>
      <md-standard-icon-button @click=${this.onClick} title="copy code">
        <md-icon aria-live="polite" aria-label=${label}>
          <span aria-hidden="true">${icon}</span>
        </md-icon>
      </md-standard-icon-button>
    `;
  }

  private async onClick() {
    let text = '';
    for (const el of this.slottedEls) {
      text += el.textContent;
    }

    await navigator.clipboard.writeText(text);
    this.onCopySuccess();
  }

  private onCopySuccess() {
    this.showCheckmark = true;

    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
    }

    // show the checkmark for at least two seconds
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
