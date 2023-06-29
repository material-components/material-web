/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {LitElement} from 'lit';

import {Harness} from '../../../testing/harness.js';

import {ListItem} from './list-item.js';

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
    typeof NAVIGABLE_KEYS[keyof typeof NAVIGABLE_KEYS];

/**
 * Test harness for list item.
 */
export class ListItemHarness extends Harness<ListItem&LitElement> {
  override async getInteractiveElement() {
    await this.element.updateComplete;
    return this.element.renderRoot.querySelector('.list-item') as HTMLElement;
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
}
