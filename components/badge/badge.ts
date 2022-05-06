/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {Badge} from './lib/badge.js';
import {styles} from './lib/badge-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-badge': MdBadge;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-badge')
export class MdBadge extends Badge {
  static override styles = [styles];
}
