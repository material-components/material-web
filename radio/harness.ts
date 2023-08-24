/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Harness} from '../testing/harness.js';

import {Radio} from './internal/radio.js';

/**
 * Test harness for radio.
 */
export class RadioHarness extends Harness<Radio> {
  override async getInteractiveElement() {
    await this.element.updateComplete;
    return this.element as HTMLElement;
  }
}
