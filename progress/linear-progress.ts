/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {CSSResultOrNative} from 'lit';
import {customElement} from 'lit/decorators.js';

import {LinearProgress} from './internal/linear-progress.js';
import {styles} from './internal/linear-progress-styles.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-linear-progress': MdLinearProgress;
  }
}

/**
 * @summary Linear progress indicators display progress by animating along the
 * length of a fixed, visible track.
 *
 * @description
 * Progress indicators inform users about the status of ongoing processes.
 * - Determinate indicators display how long a process will take.
 * - Indeterminate indicators express an unspecified amount of wait time.
 *
 * @final
 * @suppress {visibility}
 */
@customElement('md-linear-progress')
export class MdLinearProgress extends LinearProgress {
  static override styles: CSSResultOrNative[] = [styles];
}
