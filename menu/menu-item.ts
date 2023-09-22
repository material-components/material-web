/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {styles as forcedColorsStyles} from './internal/menuitem/forced-colors-styles.css.js';
import {MenuItemEl} from './internal/menuitem/menu-item.js';
import {styles} from './internal/menuitem/menu-item-styles.css.js';

export {CloseMenuEvent, MenuItem} from './internal/shared.js';

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
  static override styles = [styles, forcedColorsStyles];
}
