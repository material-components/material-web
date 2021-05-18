/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import {customElement} from 'lit-element';

import {LinearProgressBase} from './mwc-linear-progress-base';
import {styles} from './mwc-linear-progress.css';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-linear-progress': LinearProgress;
  }
}

/** @soyCompatible */
@customElement('mwc-linear-progress')
export class LinearProgress extends LinearProgressBase {
  static styles = styles;
}
