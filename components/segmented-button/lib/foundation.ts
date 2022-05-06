/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ObserverFoundation} from '../../controller/observer-foundation.js';

import {SegmentedButtonAdapter} from './state.js';

/** Provdes the business logic for a segmented button. */
export class SegmentedButtonFoundation extends
    ObserverFoundation<SegmentedButtonAdapter> {
  protected override init() {
    this.observe(this.adapter.state, {
      selected: this.onSelectedChange,
    });
  }

  protected onSelectedChange(isSelected: boolean) {
    if (isSelected) {
      this.animateSelecting();
      return;
    }

    this.animateDeselecting();
  }

  private animateSelecting() {
    // TODO(b/212476341): Support selection animations.
    this.adapter.animateSelection([]);
  }

  private animateDeselecting() {
    // TODO(b/212476341): Support selection animations.
    this.adapter.animateSelection([]);
  }
}