/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement, TemplateResult} from 'lit';
import {property} from 'lit/decorators';

/** @soyCompatible */
export class ListItemAvatar extends LitElement {
  @property({type: String, reflect: true}) avatar = '';
  @property({type: String, reflect: true}) altText = '';

  /** @soyTemplate */
  override render(): TemplateResult {
    return html`
       <img src="${this.avatar}" alt="${this.altText}"
        class="md3-list-item__avatar" />
     `;
  }
}
