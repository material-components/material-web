/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Harness} from '../testing/harness.js';

import {Menu} from './lib/menu.js';
import {MenuItemHarness} from './lib/menuitem/harness.js';

export {MenuItemHarness} from './lib/menuitem/harness.js';

/**
 * Test harness for menu.
 */
export class MenuHarness extends Harness<Menu> {
  /**
   * Shows the menu and returns the first list item element.
   */
  protected override async getInteractiveElement() {
    await this.element.updateComplete;
    await this.show();
    return (await this.getItems())[0].getInteractiveElement();
  }

  /** @return ListItem harnesses for the menu's items. */
  getItems() {
    return this.element.items.map((item) => new MenuItemHarness(item));
  }

  async show(quick = true) {
    const menu = this.element;
    menu.quick = quick;
    if (menu.open) {
      return;
    }

    const opened = new Promise((resolve) => {
      menu.addEventListener('opened', () => {
        resolve(true);
      }, {once: true});
    });

    menu.show();
    await opened;
  }
}
