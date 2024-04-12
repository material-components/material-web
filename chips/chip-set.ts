/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {CSSResultOrNative} from 'lit';
import {customElement} from 'lit/decorators.js';

import {ChipSet} from './internal/chip-set.js';
import {styles} from './internal/chip-set-styles.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-chip-set': MdChipSet;
  }
}

/**
 * TODO(b/243982145): add docs
 *
 * @final
 * @suppress {visibility}
 */
@customElement('md-chip-set')
export class MdChipSet extends ChipSet {
  static override styles: CSSResultOrNative[] = [styles];
}
