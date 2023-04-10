/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Harness} from '../testing/harness.js';

import {CircularProgress} from './lib/circular-progress.js';

/**
 * Test harness for circular-progress.
 */
export class CircularProgressHarness extends Harness<CircularProgress> {
  override async getInteractiveElement() {
    await this.element.updateComplete;
    return this.element.querySelector<HTMLElement>('.circularProgresss')!;
  }
}
