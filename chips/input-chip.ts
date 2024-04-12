/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {CSSResultOrNative} from 'lit';
import {customElement} from 'lit/decorators.js';

import {InputChip} from './internal/input-chip.js';
import {styles} from './internal/input-styles.js';
import {styles as selectableStyles} from './internal/selectable-styles.js';
import {styles as sharedStyles} from './internal/shared-styles.js';
import {styles as trailingIconStyles} from './internal/trailing-icon-styles.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-input-chip': MdInputChip;
  }
}

/**
 * TODO(b/243982145): add docs
 *
 * @final
 * @suppress {visibility}
 */
@customElement('md-input-chip')
export class MdInputChip extends InputChip {
  static override styles: CSSResultOrNative[] = [
    sharedStyles,
    trailingIconStyles,
    selectableStyles,
    styles,
  ];
}
