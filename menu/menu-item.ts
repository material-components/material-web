/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {styles as listItemForcedColorsStyles} from '../list/internal/listitem/forced-colors-styles.css.js';
import {styles as listItemStyles} from '../list/internal/listitem/list-item-styles.css.js';

import {styles as forcedColorsStyles} from './lib/menuitem/forced-colors-styles.css.js';
import {MenuItemEl} from './lib/menuitem/menu-item.js';
import {styles} from './lib/menuitem/menu-item-styles.css.js';

export {ListItem} from '../list/internal/listitem/list-item.js';
export {CloseMenuEvent, DeactivateItemsEvent, MenuItem} from './lib/shared.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-menu-item': MdMenuItem;
  }
}

/**
 * @summary Menus display a list of choices on a temporary surface.
 *
 * @description
 * Menu items are the selectable choices within the menu. Menu items must
 * implement the `MenuItem` interface and also have the `md-menu-item`
 * attribute. Additionally menu items are list items so they must also have the
 * `md-list-item` attribute.
 *
 * Menu items can control a menu by selectively firing the `close-menu` and
 * `deselect-items` events.
 *
 * @final
 * @suppress {visibility}
 */
@customElement('md-menu-item')
export class MdMenuItem extends MenuItemEl {
  static override styles =
      [listItemStyles, styles, listItemForcedColorsStyles, forcedColorsStyles];
}
