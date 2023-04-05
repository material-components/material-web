/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, nothing} from 'lit';
import {property} from 'lit/decorators.js';

import {Elevation} from './elevation.js';

/**
 * @deprecated An elevation component with a surface-tint. Will be removed
 * once components are updated.
 */
export class ElevationSurface extends Elevation {
  /**
   * Whether or not the elevation level should display a shadow.
   */
  @property({type: Boolean}) shadow = false;

  override render() {
    return html`
       <span class="surface"></span>
       ${this.shadow ? super.render() : nothing}
     `;
  }
}
