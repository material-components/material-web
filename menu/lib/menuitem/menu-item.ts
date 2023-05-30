/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {property} from 'lit/decorators.js';

import {ARIARole} from '../../../internal/aria/aria.js';
import {ListItemEl} from '../../../list/lib/listitem/list-item.js';
import {CLOSE_REASON, DefaultCloseMenuEvent, isClosableKey, MenuItem} from '../shared.js';

/**
 * @fires close-menu {CloseMenuEvent}
 */
export class MenuItemEl extends ListItemEl implements MenuItem {
  /**
   * READONLY: self-identifies as a menu item and sets its identifying attribute
   */
  @property({type: Boolean, attribute: 'md-menu-item', reflect: true})
  isMenuItem = true;

  /**
   * Keeps the menu open if clicked or keyboard selected.
   */
  @property({type: Boolean, attribute: 'keep-open'}) keepOpen = false;

  /**
   * Used for overriding e.g. sub-menu-item.
   */
  protected keepOpenOnClick = false;

  protected override readonly listItemRole: ARIARole = 'menuitem';

  protected override onClick() {
    if (this.keepOpen || this.keepOpenOnClick) return;

    this.dispatchEvent(
        new DefaultCloseMenuEvent(this, {kind: CLOSE_REASON.CLICK_SELECTION}));
  }

  protected override onKeydown(e: KeyboardEvent) {
    if (this.keepOpen) return;
    const keyCode = e.code;

    if (!e.defaultPrevented && isClosableKey(keyCode)) {
      e.preventDefault();
      this.dispatchEvent(new DefaultCloseMenuEvent(
          this, {kind: CLOSE_REASON.KEYDOWN, key: keyCode}));
    }
  }
}
