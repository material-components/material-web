/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators';

import {OutlinedSegmentedButtonSet} from './lib/outlined-segmented-button-set';
import {styles as outlinedStyles} from './lib/outlined-styles.css';
import {styles as sharedStyles} from './lib/shared-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'md-outlined-segmented-button-set': MdOutlinedSegmentedButtonSet;
  }
}

/**
 * MdOutlinedSegmentedButtonSet is the custom element for the Material
 * Design outlined segmented button set component.
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-outlined-segmented-button-set')
export class MdOutlinedSegmentedButtonSet extends OutlinedSegmentedButtonSet {
  static override styles = [sharedStyles, outlinedStyles];
}
