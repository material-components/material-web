/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {property} from 'lit/decorators.js';

import {ListItemLink} from '../../../list/lib/listitemlink/list-item-link.js';
import {ARIARole} from '../../../types/aria.js';
import {CLOSE_REASON, DefaultCloseMenuEvent, isClosableKey, MenuItem, SELECTION_KEY} from '../shared.js';

/**
 * @fires close-menu {CloseMenuEvent}
 */
export class MenuItemLink extends ListItemLink implements MenuItem {
  override role: ARIARole = 'menuitem';
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

  protected override onKeydown(e: KeyboardEvent) {
    if (this.keepOpen) return;

    const keyCode = e.code;
    // Do not preventDefault on enter or else it will prevent from opening links
    if (isClosableKey(keyCode) && keyCode !== SELECTION_KEY.ENTER) {
      e.preventDefault();
      this.dispatchEvent(new DefaultCloseMenuEvent(
          this, {kind: CLOSE_REASON.KEYDOWN, key: keyCode}));
    }
  }
}
