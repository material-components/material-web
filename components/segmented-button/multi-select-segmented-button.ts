/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators';

import {MultiSelectSegmentedButton, MultiSelectSegmentedButtonSet} from './lib/segmented-button';

declare global {
  interface HTMLElementTagNameMap {
    'md-multi-select-segmented-button': MdMultiSelectSegmentedButton;
    'md-multi-select-segmented-button-set': MdMultiSelectSegmentedButtonSet;
  }
}

/**
 * MdMultiSelectSegmentedButton is the custom element for the Material Design
 * multi-select segmented button component.
 */
@customElement('md-multi-select-segmented-button')
export class MdMultiSelectSegmentedButton extends MultiSelectSegmentedButton {
}

/**
 * MdMultiSelectSegmentedButtonSet is the custom element for the multi-select
 * behavior of Material Design segmented buttons.
 */
@customElement('md-multi-select-segmented-button-set')
export class MdMultiSelectSegmentedButtonSet extends
    MultiSelectSegmentedButtonSet {
}