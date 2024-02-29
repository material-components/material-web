/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {CSSResultOrNative} from 'lit';
import {customElement} from 'lit/decorators.js';

import {Icon} from './internal/icon.js';
import {styles} from './internal/icon-styles.js';

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
  static override styles: CSSResultOrNative[] = [styles];
}
