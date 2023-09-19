/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {nothing} from 'lit';
import {property} from 'lit/decorators.js';

import {createRequestActivationEvent, ListItemEl} from './list-item.js';

// tslint:disable-next-line:enforce-comments-on-exported-symbols
export class ListItemOnly extends ListItemEl {
  /**
   * Enables focusing the list item, and adds hover and click ripples when set
   * to true. By default `interactive` is false.
   */
  @property({type: Boolean}) interactive = false;

  override getRenderClasses() {
    return {
      ...super.getRenderClasses(),
      'interactive': this.interactive,
    };
  }

  override renderRipple() {
    return this.interactive ? super.renderRipple() : nothing;
  }

  override renderFocusRing() {
    return this.interactive ? super.renderFocusRing() : nothing;
  }

  override onFocus() {
    if (this.tabIndex !== -1) {
      return;
    }

    // Handles the case where the user clicks on the element and then tabs.
    this.dispatchEvent(createRequestActivationEvent());
  }
}
