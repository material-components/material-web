/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement} from 'lit';
import {property} from 'lit/decorators.js';

/**
 * A component for elevation.
 */
export class Elevation extends LitElement {
  /**
   * Whether or not the elevation level should display a shadow.
   */
  @property({type: Boolean, reflect: true}) shadow = false;
  /**
   * Whether or not the elevation level should display a surface tint color.
   */
  @property({type: Boolean, reflect: true}) surface = false;

  override render() {
    return html`
       <span class="surface"></span>
       <span class="shadow"></span>
     `;
  }
}
