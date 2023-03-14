/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html} from 'lit';
import {property, queryAssignedElements} from 'lit/decorators.js';

import {List} from '../../../list/lib/list.js';
import {ARIARole} from '../../../types/aria.js';
import {Corner, Menu} from '../menu.js';
import {MenuItemEl} from '../menuitem/menu-item.js';
import {ActivateTypeaheadEvent, CLOSE_REASON, CloseMenuEvent, DeactivateItemsEvent, DeactivateTypeaheadEvent, KEYDOWN_CLOSE_KEYS, NAVIGABLE_KEY, SELECTION_KEY} from '../shared.js';

function stopPropagation(e: Event) {
  e.stopPropagation();
}

/**
 * @fires deactivate-items {DeactivateItemsEvent} Requests the parent menu to
 *     deselect other items when a submenu opens
 * @fires deactivate-typeahead {DeactivateItemsEvent} Requests the parent menu
 *     to deactivate the typeahead functionality when a submenu opens
 * @fires activate-typeahead {DeactivateItemsEvent} Requests the parent menu to
 *     activate the typeahead functionality when a submenu closes
 */
export class SubMenuItem extends MenuItemEl {
  override role: ARIARole = 'menuitem';
  /**
   * The anchorCorner to set on the submenu.
   */
  @property({attribute: 'anchor-corner'}) anchorCorner: Corner = 'START_END';
  /**
   * The menuCorner to set on the submenu.
   */
  @property({attribute: 'menu-corner'}) menuCorner: Corner = 'START_START';
  /**
   * The delay between pointerenter and submenu opening.
   */
  @property({type: Number, attribute: 'hover-open-delay'}) hoverOpenDelay = 400;
  /**
   * The delay between ponterleave and the submenu closing.
   */
  @property({type: Number, attribute: 'hover-close-delay'})
  hoverCloseDelay = 400;

  @queryAssignedElements({slot: 'submenu'}) protected menus!: Menu[];

  protected override keepOpenOnClick = true;
  protected previousOpenTimeout = 0;
  protected previousCloseTimeout = 0;

  protected get submenuEl(): Menu|undefined {
    return this.menus[0];
  }

  /**
   * Starts the default 400ms countdown to open the submenu.
   */
  protected override onPointerenter = () => {
    clearTimeout(this.previousOpenTimeout);
    clearTimeout(this.previousCloseTimeout);
    if (this.submenuEl?.open) return;

    // Open synchronously if delay is 0. (screenshot tests infra
    // would never resolve otherwise)
    if (!this.hoverOpenDelay) {
      this.show();
    } else {
      this.previousOpenTimeout = setTimeout(() => {
        this.show();
      }, this.hoverOpenDelay);
    }
  };

  /**
   * Starts the default 400ms countdown to close the submenu.
   */
  protected override onPointerleave = () => {
    clearTimeout(this.previousCloseTimeout);
    clearTimeout(this.previousOpenTimeout);

    // Close synchronously if delay is 0. (screenshot tests infra
    // would never resolve otherwise)
    if (!this.hoverCloseDelay) {
      this.close();
    } else {
      this.previousCloseTimeout = setTimeout(() => {
        this.close();
      }, this.hoverCloseDelay);
    }
  };

  protected override onClick() {
    this.show();
  }

  /**
   * On item keydown handles opening the submenu.
   */
  protected override onKeydown(e: KeyboardEvent) {
    const shouldOpenSubmenu = this.isSubmenuOpenKey(e.code);

    if (e.code === SELECTION_KEY.SPACE) {
      // prevent space from scrolling. Only open the submenu.
      e.preventDefault();
    }

    if (!shouldOpenSubmenu) {
      super.onKeydown(e);
      return;
    }

    const submenu = this.submenuEl;
    if (!submenu) return;

    const submenuItems = submenu.items;
    const firstActivatableItem = List.getFirstActivatableItem(submenuItems);

    if (firstActivatableItem) {
      this.show(() => {
        firstActivatableItem.active = true;
      });

      return;
    }
  }

  /**
   * Render the submenu at the end
   */
  protected override renderEnd() {
    return html`${super.renderEnd()}${this.renderSubMenu()}`;
  }

  /**
   * Renders the slot for the submenu.
   */
  protected renderSubMenu() {
    return html`<span class="submenu"><slot
        name="submenu"
        @pointerdown=${stopPropagation}
        @click=${stopPropagation}
        @keydown=${this.onSubMenuKeydown}
        @close-menu=${this.onCloseSubmenu}
    ></slot></span>`;
  }

  protected onCloseSubmenu(e: CloseMenuEvent) {
    e.itemPath.push(this);
    this.dispatchEvent(new ActivateTypeaheadEvent());
    // Escape should only close one menu not all of the menus unlike space or
    // click selection which should close all menus.
    if (e.reason.kind === CLOSE_REASON.KEYDOWN &&
        e.reason.key === KEYDOWN_CLOSE_KEYS.ESCAPE) {
      e.stopPropagation();
      this.active = true;
      // It might already be active so manually focus
      this.listItemRoot.focus();
      return;
    }

    this.active = false;
  }

  protected async onSubMenuKeydown(e: KeyboardEvent) {
    // Stop propagation so that we don't accidentally close every parent menu.
    // Additionally, we want to isolate things like the typeahead keydowns
    // from bubbling up to the parent menu and confounding things.
    e.stopPropagation();
    const shouldClose = this.isSubmenuCloseKey(e.code);

    if (!shouldClose) return;

    this.close(() => {
      List.deactivateActiveItem(this.submenuEl!.items);
      this.listItemRoot.focus();
      this.active = true;
    });
  }

  /**
   * Shows the submenu.
   *
   * @param onOpened A function to call after the menu is opened.
   */
  show(onOpened = () => {}) {
    const menu = this.submenuEl;
    if (!menu) return;

    menu.quick = true;
    // Submenus are in overflow when not fixed. Can remove once we have native
    // popup support
    menu.hasOverflow = true;
    menu.anchorCorner = this.anchorCorner;
    menu.menuCorner = this.menuCorner;
    menu.anchor = this;
    // We manually set focus with `active` on keyboard navigation. And we
    // want to focus the root on hover, so the user can pick up navigation with
    // keyboard after hover.
    menu.defaultFocus = 'LIST_ROOT';
    menu.skipRestoreFocus = true;

    // Menu could already be opened because of mouse interaction
    const menuAlreadyOpen = menu.open;
    menu.show();

    // Deactivate other items. This can be the case if the user has tabbed
    // around the menu and then mouses over an md-sub-menu.
    this.dispatchEvent(new DeactivateItemsEvent());
    this.dispatchEvent(new DeactivateTypeaheadEvent());
    this.active = true;

    // This is the case of mouse hovering when already opened via keyboard or
    // vice versa
    if (menuAlreadyOpen) {
      onOpened();
    } else {
      menu.addEventListener('opened', onOpened, {once: true});
    }
  }

  /**
   * Closes the submenu.
   *
   * @param onClosed A function to call after the menu is closed.
   */
  close(onClosed = () => {}) {
    const menu = this.submenuEl;
    if (!menu || !menu.open) return;

    this.dispatchEvent(new ActivateTypeaheadEvent());
    menu.quick = true;
    menu.close();
    this.active = false;
    menu.addEventListener('closed', onClosed, {once: true});
  }

  /**
   * Determines whether the given KeyboardEvent code is one that should open
   * the submenu. This is RTL-aware. By default, left, right, space, or enter.
   *
   * @param code The native KeyboardEvent code.
   * @return Whether or not the key code should open the submenu.
   */
  protected isSubmenuOpenKey(code: string) {
    const isRtl = getComputedStyle(this).direction === 'rtl';
    const arrowEnterKey = isRtl ? NAVIGABLE_KEY.LEFT : NAVIGABLE_KEY.RIGHT;
    switch (code) {
      case arrowEnterKey:
      case SELECTION_KEY.SPACE:
      case SELECTION_KEY.ENTER:
        return true;
      default:
        return false;
    }
  }

  /**
   * Determines whether the given KeyboardEvent code is one that should close
   * the submenu. This is RTL-aware. By default right, left, or escape.
   *
   * @param code The native KeyboardEvent code.
   * @return Whether or not the key code should close the submenu.
   */
  protected isSubmenuCloseKey(code: string) {
    const isRtl = getComputedStyle(this).direction === 'rtl';
    const arrowEnterKey = isRtl ? NAVIGABLE_KEY.RIGHT : NAVIGABLE_KEY.LEFT;
    switch (code) {
      case arrowEnterKey:
      case KEYDOWN_CLOSE_KEYS.ESCAPE:
        return true;
      default:
        return false;
    }
  }
}
