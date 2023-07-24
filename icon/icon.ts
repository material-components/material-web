/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {Icon} from './internal/icon.js';
import {styles} from './internal/icon-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-icon': MdIcon;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('md-icon')
export class MdIcon extends Icon {
  /** @nocollapse */
  static override styles = [styles];
}
