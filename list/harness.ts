/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Harness} from '../testing/harness.js';

import {List} from './internal/list.js';
import {ListItemHarness} from './internal/listitem/harness.js';
import {ListItemEl} from './internal/listitem/list-item.js';

export {ListItemHarness} from './internal/listitem/harness.js';

const NAVIGABLE_KEYS = {
  'ArrowDown': 'ArrowDown',
  'ArrowUp': 'ArrowUp',
  'Home': 'Home',
  'End': 'End',
} as const;

/**
 * Keys that are handled by MdList. Keys not included in this are not handled by
 * MdList and should be dispatched by yourself.
 */
export type HandledListKeys =
  (typeof NAVIGABLE_KEYS)[keyof typeof NAVIGABLE_KEYS];

/**
 * Test harness for list.
 */
export class ListHarness extends Harness<List> {
  /**
   * Returns the first list item element.
   */
  protected override async getInteractiveElement() {
    await this.element.updateComplete;
    return this.element as List;
  }

  /** @return List item harnesses. */
  getItems() {
    return this.element.items.map(
      (item) => new ListItemHarness(item as ListItemEl),
    );
  }

  /**
   * Constructs keyboard events that are handled by List and makes sure that
   * they are constructed in a manner that List understands.
   *
   * @param key The key to dispatch on the list.
   */
  async pressHandledKey<T extends string = HandledListKeys>(key: T) {
    await this.keypress(key, {code: key});
  }

  /**
   * Dispatches a keypress on the list. It may or may not be a supported event.
   *
   * @param key The key to dispatch on the list.
   */
  override async keypress(key: string, init = {} as KeyboardEventInit) {
    init = {code: key, ...init};
    await super.keypress(key, init);
  }
}
