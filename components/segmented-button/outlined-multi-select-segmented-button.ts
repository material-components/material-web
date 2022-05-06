/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {OutlinedMultiSelectSegmentedButton} from './lib/outlined-multi-select-segmented-button.js';
import {styles as outlinedStyles} from './lib/outlined-styles.css.js';
import {styles as sharedStyles} from './lib/shared-styles.css.js';


declare global {
  interface HTMLElementTagNameMap {
    'md-outlined-multi-select-segmented-button':
        MdOutlinedMultiSelectSegmentedButton;
  }
}

/**
 * MdOutlinedMultiSelectSegmentedButton is the custom element for the Material
 * Design outlined multi-select segmented button component.
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-outlined-multi-select-segmented-button')
export class MdOutlinedMultiSelectSegmentedButton extends
    OutlinedMultiSelectSegmentedButton {
  static override styles = [sharedStyles, outlinedStyles];
}