/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement, TemplateResult} from 'lit';

/** @soyCompatible */
export class ListItem extends LitElement {
  /** @soyTemplate */
  override render(): TemplateResult {
    return html`
      <li>Item</li>
    `;
  }
}
