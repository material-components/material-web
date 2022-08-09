/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Harness} from '@material/web/testing/harness';

import {Menu} from './lib/menu';
import {MenuItemHarness} from './lib/menuitem/harness';

/**
 * Test harness for menu.
 */
export class MenuHarness extends Harness<Menu> {
  /** @return ListItem harnesses for the menu's items. */
  getItems() {
    return this.element.items.map((item) => new MenuItemHarness(item));
  }
}
