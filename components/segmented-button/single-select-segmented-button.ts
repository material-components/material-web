/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators';

import {SingleSelectSegmentedButton} from './lib/segmented-button';
import {styles} from './lib/shared-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'md-single-select-segmented-button': MdSingleSelectSegmentedButton;
  }
}

/**
 * MdSingleSelectSegmentedButton is the custom element for the Material Design
 * single-select segmented button component.
 */
@customElement('md-single-select-segmented-button')
export class MdSingleSelectSegmentedButton extends SingleSelectSegmentedButton {
  static override styles = [styles];
}