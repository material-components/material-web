/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement, TemplateResult} from 'lit';

/** @soyCompatible */
export class ListItemIcon extends LitElement {
  /** @soyTemplate */
  override render(): TemplateResult {
    return html`
      <span class="md3-list-item__icon"><slot></slot></span>
    `;
  }
}
