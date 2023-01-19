/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {LitElement} from 'lit';

import {Harness} from '../../../testing/harness.js';

import {ListItem} from './list-item.js';

/**
 * Test harness for list item.
 */
export class ListItemHarness extends Harness<ListItem> {
  override async getInteractiveElement() {
    await (this.element as unknown as LitElement).updateComplete;
    return (this.element as unknown as LitElement)
               .renderRoot.querySelector('.list-item') as HTMLElement;
  }
}
