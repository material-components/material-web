/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {CSSResultOrNative} from 'lit';
import {customElement} from 'lit/decorators.js';

import {Badge} from './internal/badge.js';
import {styles} from './internal/badge-styles.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-badge': MdBadge;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('md-badge')
export class MdBadge extends Badge {
  static override styles: CSSResultOrNative[] = [styles];
}
