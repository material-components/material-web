/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore

import {customElement} from 'lit/decorators.js';

import {LinearProgressBase} from './mwc-linear-progress-base.js';
import {styles} from './mwc-linear-progress.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-linear-progress': LinearProgress;
  }
}

/** @soyCompatible */
@customElement('mwc-linear-progress')
export class LinearProgress extends LinearProgressBase {
  static override styles = [styles];
}
