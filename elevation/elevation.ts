/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {CSSResultOrNative} from 'lit';
import {customElement} from 'lit/decorators.js';

import {Elevation} from './internal/elevation.js';
import {styles} from './internal/elevation-styles.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-elevation': MdElevation;
  }
}

/**
 * The `<md-elevation>` custom element with default styles.
 *
 * Elevation is the relative distance between two surfaces along the z-axis.
 *
 * @final
 * @suppress {visibility}
 */
@customElement('md-elevation')
export class MdElevation extends Elevation {
  static override styles: CSSResultOrNative[] = [styles];
}
