/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {LitElement} from 'lit';

import {Harness} from '../../../testing/harness.js';
import {NavigableKeys} from '../list-controller.js';
import {ListItem} from '../list-navigation-helpers.js';

/**
 * Keys that are handled by MdList. Keys not included in this are not handled by
 * MdList and should be dispatched by yourself.
 */
export type HandledListKeys =
  (typeof NavigableKeys)[keyof typeof NavigableKeys];

/**
 * Test harness for list item.
 */
export class ListItemHarness<
  T extends LitElement = ListItem & LitElement,
> extends Harness<T> {
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
  async pressHandledKey<U extends string = HandledListKeys>(key: U) {
    await this.keypress(key, {code: key});
  }
}
