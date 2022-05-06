/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {styles} from './lib/shared-styles.css.js';
import {SingleSelectSegmentedButtonSet} from './lib/single-select-segmented-button-set.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-single-select-segmented-button-set': MdSingleSelectSegmentedButtonSet;
  }
}

/**
 * MdSingleSelectSegmentedButtonSet is the custom element for the single-select
 * behavior of Material Design segmented buttons.
 */
@customElement('md-single-select-segmented-button-set')
export class MdSingleSelectSegmentedButtonSet extends
    SingleSelectSegmentedButtonSet {
  static override styles = [styles];
}