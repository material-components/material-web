/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {OutlinedSingleSelectSegmentedButton} from './lib/outlined-single-select-segmented-button.js';
import {styles as outlinedStyles} from './lib/outlined-styles.css.js';
import {styles as sharedStyles} from './lib/shared-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-outlined-single-select-segmented-button':
        MdOutlinedSingleSelectSegmentedButton;
  }
}

/**
 * MdOutlinedSingleSelectSegmentedButton is the custom element for the Material
 * Design outlined single-select segmented button component.
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-outlined-single-select-segmented-button')
export class MdOutlinedSingleSelectSegmentedButton extends
    OutlinedSingleSelectSegmentedButton {
  static override styles = [sharedStyles, outlinedStyles];
}
