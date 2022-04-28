/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators';

import {Badge} from './lib/badge';
import {styles} from './lib/badge-styles.css';

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
