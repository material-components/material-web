/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {Elevation} from './lib/elevation.js';
import {styles} from './lib/elevation-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-elevation': MdElevation;
  }
}

/**
 * The `<md-elevation>` custom element with default styles.
 *
 * Elevation is the relative distance between two surfaces along the z-axis.
 */
@customElement('md-elevation')
export class MdElevation extends Elevation {
  static override styles = [styles];
}
