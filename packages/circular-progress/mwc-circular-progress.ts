/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore

import {customElement} from 'lit-element';

import {CircularProgressBase} from './mwc-circular-progress-base';
import {styles} from './mwc-circular-progress.css';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-circular-progress': CircularProgress;
  }
}

/** @soyCompatible */
@customElement('mwc-circular-progress')
export class CircularProgress extends CircularProgressBase {
  static override styles = [styles];
}
