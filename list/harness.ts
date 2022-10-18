/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Harness} from '../testing/harness.js';

import {List} from './lib/list.js';
import {ListItemHarness} from './lib/listitem/harness.js';

/**
 * Test harness for list.
 */
export class ListHarness extends Harness<List> {
  /**
   * Returns the first list item element.
   */
  protected override async getInteractiveElement() {
    await this.element.updateComplete;
    return (await this.getItems())[0].getInteractiveElement();
  }

  /** @return List item harnesses. */
  getItems() {
    return this.element.items.map((item) => new ListItemHarness(item));
  }
}
