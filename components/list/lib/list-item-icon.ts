/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement, TemplateResult} from 'lit';
import {property} from 'lit/decorators.js';

/** @soyCompatible */
export class ListItemIcon extends LitElement {
  @property({type: String, reflect: true}) media = 'icon';

  /** @soyTemplate */
  override render(): TemplateResult {
    return html`
      <span class="md3-list-item__icon"><slot></slot></span>
    `;
  }
}
