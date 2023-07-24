/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {nothing} from 'lit';
import {property} from 'lit/decorators.js';

import {ListItemEl} from './list-item.js';

// tslint:disable-next-line:enforce-comments-on-exported-symbols
export class ListItemOnly extends ListItemEl {
  /**
   * Removes the hover and click ripples from the item when true.
   */
  @property({type: Boolean}) noninteractive = false;

  override getRenderClasses() {
    return {
      ...super.getRenderClasses(),
      'noninteractive': this.noninteractive,
    };
  }

  override renderRipple() {
    return this.noninteractive ? nothing : super.renderRipple();
  }

  override renderFocusRing() {
    return this.noninteractive ? nothing : super.renderFocusRing();
  }
}
