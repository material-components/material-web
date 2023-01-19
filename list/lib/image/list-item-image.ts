/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement, nothing, TemplateResult} from 'lit';
import {property} from 'lit/decorators.js';

// tslint:disable-next-line:enforce-comments-on-exported-symbols
export class ListItemImage extends LitElement {
  /**
   * The image `src`.
   */
  @property() image = '';

  /**
   * The image `alt`.
   */
  @property() altText = '';

  /**
   * The image `loading` attribute.
   */
  @property() loading: 'eager'|'lazy' = 'eager';

  override render(): TemplateResult {
    return html`
      <img
          src="${this.image}"
          alt="${this.altText || nothing}"
          loading=${this.loading}
          class="md3-list-item__image" />
      `;
  }
}
