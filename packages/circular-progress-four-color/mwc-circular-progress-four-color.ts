/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore

import {customElement} from 'lit/decorators.js';

import {CircularProgressFourColorBase} from './mwc-circular-progress-four-color-base';
import {styles} from './mwc-circular-progress-four-color.css';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-circular-progress-four-color': CircularProgressFourColor;
  }
}

/** @soyCompatible */
@customElement('mwc-circular-progress-four-color')
export class CircularProgressFourColor extends CircularProgressFourColorBase {
  static override styles = [styles];
}
