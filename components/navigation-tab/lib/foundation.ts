/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {MDCObserverFoundation} from '@material/base/observer-foundation';

import {MDCNavigationTabAdapter} from './state';

/**
 * `MDCNavigationTabFoundation` provides a state-only foundation for a
 * navigation tab component.
 *
 * State observers and event handler entrypoints update a component's adapter's
 * state with the logic needed for navigation tab to function.
 */
export class MDCNavigationTabFoundation extends
    MDCObserverFoundation<MDCNavigationTabAdapter> {
  constructor(adapter: MDCNavigationTabAdapter) {
    super(adapter);
    this.handleClick = this.handleClick.bind(this);
  }

  /**
   * Event handler for navigation tab click events.
   */
  handleClick() {
    this.adapter.emitInteractionEvent(this.adapter.state);
  }
}
