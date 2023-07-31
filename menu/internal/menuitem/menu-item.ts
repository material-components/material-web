/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {property, state} from 'lit/decorators.js';

import type {MdFocusRing} from '../../../focus/md-focus-ring.js';
import {ListItemEl, ListItemRole} from '../../../list/internal/listitem/list-item.js';
import {CLOSE_REASON, DefaultCloseMenuEvent, isClosableKey, MenuItem} from '../shared.js';

export {ListItemRole} from '../../../list/internal/listitem/list-item.js';

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

  @state() protected hasFocusRing = false;

  /**
   * Used for overriding e.g. sub-menu-item.
   */
  protected keepOpenOnClick = false;

  override readonly type: ListItemRole = 'menuitem';

  protected override onClick() {
    if (this.keepOpen || this.keepOpenOnClick) return;

    this.dispatchEvent(
        new DefaultCloseMenuEvent(this, {kind: CLOSE_REASON.CLICK_SELECTION}));
  }

  protected override getRenderClasses() {
    return {
      ...super.getRenderClasses(),
      'has-focus-ring': this.hasFocusRing,
    };
  }

  protected override onFocusRingVisibilityChanged(e: Event) {
    const focusRing = e.target as MdFocusRing;
    this.hasFocusRing = focusRing.visible;
  }

  protected override onKeydown(event: KeyboardEvent) {
    if (this.keepOpen) return;
    const keyCode = event.code;

    if (!event.defaultPrevented && isClosableKey(keyCode)) {
      event.preventDefault();
      this.dispatchEvent(new DefaultCloseMenuEvent(
          this, {kind: CLOSE_REASON.KEYDOWN, key: keyCode}));
    }
  }
}
