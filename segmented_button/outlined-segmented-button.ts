/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators';

import {OutlinedSegmentedButton} from './lib/outlined-segmented-button';
import {styles as outlinedStyles} from './lib/outlined-styles.css';
import {styles as sharedStyles} from './lib/segmented-button-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'md-outlined-segmented-button': MdOutlinedSegmentedButton;
  }
}

/**
 * MdOutlinedSegmentedButton is the custom element for the Material
 * Design outlined segmented button component.
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-outlined-segmented-button')
export class MdOutlinedSegmentedButton extends OutlinedSegmentedButton {
  static override styles = [sharedStyles, outlinedStyles];
}
