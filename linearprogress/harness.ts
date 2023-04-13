/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Harness} from '../testing/harness.js';

import {LinearProgress} from './lib/linear-progress.js';

/**
 * Test harness for linear-progress.
 */
export class LinearProgressHarness extends Harness<LinearProgress> {
  override async getInteractiveElement() {
    await this.element.updateComplete;
    // Test access to protected property
    // tslint:disable-next-line:no-dict-access-on-struct-type
    return this.element['rootEl'];
  }
}
