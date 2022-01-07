/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators';

import {SingleSelectSegmentedButton, SingleSelectSegmentedButtonSet} from './lib/segmented-button';

declare global {
  interface HTMLElementTagNameMap {
    'md-single-select-segmented-button': MdSingleSelectSegmentedButton;
    'md-single-select-segmented-button-set': MdSingleSelectSegmentedButtonSet;
  }
}

/**
 * MdSingleSelectSegmentedButton is the custom element for the Material Design
 * single-select segmented button component.
 */
@customElement('md-single-select-segmented-button')
export class MdSingleSelectSegmentedButton extends SingleSelectSegmentedButton {
}

/**
 * MdSingleSelectSegmentedButtonSet is the custom element for the single-select
 * behavior of Material Design segmented buttons.
 */
@customElement('md-single-select-segmented-button-set')
export class MdSingleSelectSegmentedButtonSet extends
    SingleSelectSegmentedButtonSet {
}