/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {CSSResultOrNative} from 'lit';
import {customElement} from 'lit/decorators.js';

import {MenuItemEl} from './internal/menuitem/menu-item.js';
import {styles} from './internal/menuitem/menu-item-styles.js';

export {type MenuItem} from './internal/controllers/menuItemController.js';
export {type CloseMenuEvent} from './internal/controllers/shared.js';

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
  static override styles: CSSResultOrNative[] = [styles];
}
