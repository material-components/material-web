/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {MDCObserverFoundation} from '@material/base/observer-foundation';

import {MDCSwitchAdapter} from './state';

/**
 * `MDCSwitchFoundation` provides a state-only foundation for a switch
 * component.
 *
 * State observers and event handler entrypoints update a component's adapter's
 * state with the logic needed for switch to function.
 */
export class MDCSwitchFoundation extends
    MDCObserverFoundation<MDCSwitchAdapter> {
  constructor(adapter: MDCSwitchAdapter) {
    super(adapter);
    this.handleClick = this.handleClick.bind(this);
  }

  /**
   * Initializes the foundation and starts observing state changes.
   */
  override init() {
    this.observe(this.adapter.state, {
      disabled: this.stopProcessingIfDisabled,
      processing: this.stopProcessingIfDisabled,
    });
  }

  /**
   * Event handler for switch click events. Clicking on a switch will toggle its
   * selected state.
   */
  handleClick() {
    if (this.adapter.state.disabled) {
      return;
    }

    this.adapter.state.selected = !this.adapter.state.selected;
  }

  protected stopProcessingIfDisabled() {
    if (this.adapter.state.disabled) {
      this.adapter.state.processing = false;
    }
  }
}
