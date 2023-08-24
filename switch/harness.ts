/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Harness} from '../testing/harness.js';

import {Switch} from './internal/switch.js';

/**
 * Test harness for switch elements.
 */
export class SwitchHarness extends Harness<Switch> {
  protected override async getInteractiveElement() {
    await this.element.updateComplete;
    return this.element.renderRoot.querySelector('input')!;
  }
}
