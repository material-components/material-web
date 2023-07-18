/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {property} from 'lit/decorators.js';

import {ListItemLink} from '../../../list/lib/listitemlink/list-item-link.js';
import {CLOSE_REASON, DefaultCloseMenuEvent, isClosableKey, MenuItem, SELECTION_KEY} from '../shared.js';

/**
 * @fires close-menu {CloseMenuEvent}
 */
export class MenuItemLink extends ListItemLink implements MenuItem {
  /**
   * READONLY: self-identifies as a menu item and sets its identifying attribute
   */
  @property({type: Boolean, attribute: 'md-menu-item', reflect: true})
  isMenuItem = true;

  /**
   * Keeps the menu open if clicked or keyboard selected.
   */
  @property({type: Boolean, attribute: 'keep-open'}) keepOpen = false;

  protected keepOpenOnClick = false;

  protected override onClick() {
    if (this.keepOpen || this.keepOpenOnClick) return;

    this.dispatchEvent(
        new DefaultCloseMenuEvent(this, {kind: CLOSE_REASON.CLICK_SELECTION}));
  }

  protected override onKeydown(event: KeyboardEvent) {
    if (this.keepOpen) return;

    const keyCode = event.code;
    // Do not preventDefault on enter or else it will prevent from opening links
    if (!event.defaultPrevented && isClosableKey(keyCode) &&
        keyCode !== SELECTION_KEY.ENTER) {
      event.preventDefault();
      this.dispatchEvent(new DefaultCloseMenuEvent(
          this, {kind: CLOSE_REASON.KEYDOWN, key: keyCode}));
    }
  }
}
