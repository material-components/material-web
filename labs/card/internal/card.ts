/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement} from 'lit';

/**
 * A card component.
 */
export class Card extends LitElement {
  protected override render() {
    return html`<slot></slot>`;
  }
}
