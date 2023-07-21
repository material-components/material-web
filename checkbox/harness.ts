/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Harness} from '../testing/harness.js';

import {Checkbox} from './internal/checkbox.js';

/**
 * Test harness for checkbox.
 */
export class CheckboxHarness extends Harness<Checkbox> {
  override async getInteractiveElement() {
    await this.element.updateComplete;
    return this.element.renderRoot.querySelector('input')!;
  }
}
