/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {CSSResultOrNative} from 'lit';
import {customElement} from 'lit/decorators.js';

import {Tooltip} from './internal/tooltip.js';
import {styles} from './internal/tooltip-styles.cssresult.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-tooltip': MdTooltip;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('md-tooltip')
export class MdTooltip extends Tooltip {
  static override styles: CSSResultOrNative[] = [styles];
}
