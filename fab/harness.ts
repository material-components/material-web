/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Harness} from '../testing/harness.js';

import {Fab} from './internal/fab.js';

/**
 * Test harness for floating action buttons.
 */
export class FabHarness extends Harness<Fab> {
  override async getInteractiveElement() {
    await this.element.updateComplete;
    return this.element.renderRoot.querySelector('.fab') as HTMLButtonElement;
  }
}
