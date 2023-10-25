/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, html, LitElement} from 'lit';
import {customElement} from 'lit/decorators.js';

/**
 * A layout element that lays out the slotted h1 in our component READMEs. This
 * element is never hydrated only SSRd.
 *
 * See component-template.md in internal team docs for usage.
 */
@customElement('catalog-component-header-title')
export class CatalogComponentHeaderTitle extends LitElement {
  render() {
    return html`<slot></slot>`;
  }

  static styles = css`
    :host {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      border-radius: var(--catalog-image-border-radius);
      padding: 56px;
      /* It has no border so we need it to be a different color from the top app
       * bar and nav drawer.
       */
      background-color: var(--md-sys-color-surface-variant);
      color: var(--md-sys-color-on-surface-variant);
    }

    slot::slotted(h1) {
      margin-block-end: 8px;
      font-weight: 475;
    }

    slot::slotted(p) {
      font-size: var(--catalog-title-l-font-size);
    }

    slot::slotted(*) {
      margin-block-start: 0;
    }

    slot::slotted(*:last-child) {
      margin-block-end: 0;
    }

    @media screen and (max-width: 600px) {
      :host {
        padding: 32px;
      }
    }
  `;
}
