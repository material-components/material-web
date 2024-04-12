/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {CSSResultOrNative} from 'lit';
import {customElement} from 'lit/decorators.js';

import {styles as elevatedStyles} from './internal/elevated-styles.js';
import {FilterChip} from './internal/filter-chip.js';
import {styles} from './internal/filter-styles.js';
import {styles as selectableStyles} from './internal/selectable-styles.js';
import {styles as sharedStyles} from './internal/shared-styles.js';
import {styles as trailingIconStyles} from './internal/trailing-icon-styles.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-filter-chip': MdFilterChip;
  }
}

/**
 * TODO(b/243982145): add docs
 *
 * @final
 * @suppress {visibility}
 */
@customElement('md-filter-chip')
export class MdFilterChip extends FilterChip {
  static override styles: CSSResultOrNative[] = [
    sharedStyles,
    elevatedStyles,
    trailingIconStyles,
    selectableStyles,
    styles,
  ];
}
