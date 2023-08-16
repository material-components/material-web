/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Harness} from '../testing/harness.js';

import {CircularProgress} from './internal/circular-progress.js';
import {LinearProgress} from './internal/linear-progress.js';

/**
 * Test harness for linear-progress.
 */
export class LinearProgressHarness extends Harness<LinearProgress> {
  override async getInteractiveElement() {
    await this.element.updateComplete;
    return this.element.querySelector<HTMLElement>('.progress')!;
  }
}

/**
 * Test harness for circular-progress.
 */
export class CircularProgressHarness extends Harness<CircularProgress> {
  override async getInteractiveElement() {
    await this.element.updateComplete;
    return this.element.querySelector<HTMLElement>('.progress')!;
  }
}
