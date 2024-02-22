/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {CSSResult} from 'lit';
import {customElement} from 'lit/decorators.js';

import {styles as elevatedStyles} from './internal/elevated-styles.css.js';
import {FilterChip} from './internal/filter-chip.js';
import {styles} from './internal/filter-styles.css.js';
import {styles as selectableStyles} from './internal/selectable-styles.css.js';
import {styles as sharedStyles} from './internal/shared-styles.css.js';
import {styles as trailingIconStyles} from './internal/trailing-icon-styles.css.js';

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
  static override styles: CSSResult[] = [
    sharedStyles,
    elevatedStyles,
    trailingIconStyles,
    selectableStyles,
    styles,
  ];
}
