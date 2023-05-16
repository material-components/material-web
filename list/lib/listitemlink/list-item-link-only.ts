/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {nothing} from 'lit';
import {property} from 'lit/decorators.js';

import {ListItemLink} from './list-item-link.js';

// tslint:disable-next-line:enforce-comments-on-exported-symbols
export class ListItemLinkOnly extends ListItemLink {
  /**
   * Removes the hover and click ripples from the item when true. Clicking the
   * link will still cause link navigation.
   */
  @property() noninteractive = false;

  override getRenderClasses() {
    return {
      ...super.getRenderClasses(),
      'noninteractive': this.noninteractive,
    };
  }

  override renderRipple() {
    return this.noninteractive ? nothing : super.renderRipple();
  }
}
