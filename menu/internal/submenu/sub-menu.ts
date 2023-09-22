/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, isServer, LitElement} from 'lit';
import {property, queryAssignedElements} from 'lit/decorators.js';

import {List} from '../../../list/internal/list.js';
import {createDeactivateItemsEvent, createRequestActivationEvent} from '../../../list/internal/listitem/list-item.js';
import {Corner, Menu} from '../menu.js';
import {CLOSE_REASON, CloseMenuEvent, createActivateTypeaheadEvent, createDeactivateTypeaheadEvent, KEYDOWN_CLOSE_KEYS, MenuItem, NAVIGABLE_KEY, SELECTION_KEY} from '../shared.js';

/**
 * @fires deactivate-items Requests the parent menu to deselect other items when
 * a submenu opens
 * @fires request-activation Requests the parent make the slotted item focusable
 * and focuses the item.
 * @fires deactivate-typeahead Requests the parent menu to deactivate the
 * typeahead functionality when a submenu opens
 * @fires activate-typeahead Requests the parent menu to activate the typeahead
 * functionality when a submenu closes
 */
export class SubMenu extends LitElement {
  /**
   * The anchorCorner to set on the submenu.
   */
  @property({attribute: 'anchor-corner'})
  anchorCorner: Corner = Corner.START_END;
  /**
   * The menuCorner to set on the submenu.
   */
  @property({attribute: 'menu-corner'}) menuCorner: Corner = Corner.START_START;
  /**
   * The delay between mouseenter and submenu opening.
   */
  @property({type: Number, attribute: 'hover-open-delay'}) hoverOpenDelay = 400;
  /**
   * The delay between ponterleave and the submenu closing.
   */
  @property({type: Number, attribute: 'hover-close-delay'})
  hoverCloseDelay = 400;

  /**
   * READONLY: self-identifies as a menu item and sets its identifying attribute
   */
  @property({type: Boolean, reflect: true, attribute: 'md-sub-menu'})
  isSubMenu = true;

  get item() {
    return this.items[0] ?? null;
  }

  get menu() {
    return this.menus[0] ?? null;
  }

  @queryAssignedElements({slot: 'item', flatten: true})
  private readonly items!: MenuItem[];

  @queryAssignedElements({slot: 'menu', flatten: true})
  private readonly menus!: Menu[];

  private previousOpenTimeout = 0;
  private previousCloseTimeout = 0;

  constructor() {
    super();

    if (!isServer) {
      this.addEventListener('mouseenter', this.onMouseenter);
      this.addEventListener('mouseleave', this.onMouseleave);
    }
  }

  override render() {
    return html`
        <slot
            name="item"
            @click=${this.onClick}
            @keydown=${this.onKeydown}
            @slotchange=${this.onSlotchange}
        >
        </slot>
        <slot name="menu"
            @keydown=${this.onSubMenuKeydown}
            @close-menu=${this.onCloseSubmenu}
            @slotchange=${this.onSlotchange}>
        </slot>
    `;
  }

  /**
   * Shows the submenu.
   */
  async show() {
    const menu = this.menu;
    if (!menu || menu.open) return;

    // Ensures that we deselect items when the menu closes and reactivate
    // typeahead when the menu closes, so that we do not have dirty state of
    // `sub-menu > menu-item[selected]` when we reopen.
    //
    // This cannot happen in `close()` because the menu may close via other
    // means Additionally, this cannot happen in onCloseSubmenu because
    // `close-menu` may not be called via focusout of outside click and not
    // triggered by an item
    menu.addEventListener('closed', () => {
      this.item.ariaExpanded = 'false';
      this.dispatchEvent(createActivateTypeaheadEvent());
      this.dispatchEvent(createDeactivateItemsEvent());
    }, {once: true});
    menu.quick = true;
    // Submenus are in overflow when not fixed. Can remove once we have native
    // popup support
    menu.hasOverflow = true;
    menu.anchorCorner = this.anchorCorner;
    menu.menuCorner = this.menuCorner;
    menu.anchorElement = this.item;
    menu.defaultFocus = 'first-item';
    // This is required in the case where we have a leaf menu open and and the
    // user hovers a parent menu's item which is not an md-sub-menu item.
    // If this were set to true, then the menu would close and focus would be
    // lost. That means the focusout event would have a `relatedTarget` of
    // `null` since nothing in the menu would be focused anymore due to the
    // leaf menu closing. restoring focus ensures that we keep focus in the
    // submenu tree.
    menu.skipRestoreFocus = false;

    // Menu could already be opened because of mouse interaction
    const menuAlreadyOpen = menu.open;
    menu.show();
    this.item.ariaExpanded = 'true';
    this.item.ariaHasPopup = 'menu';
    if (menu.id) {
      this.item.setAttribute('aria-controls', menu.id);
    }

    // Deactivate other items. This can be the case if the user has tabbed
    // around the menu and then mouses over an md-sub-menu.
    this.dispatchEvent(createDeactivateItemsEvent());
    this.dispatchEvent(createDeactivateTypeaheadEvent());
    this.item.selected = true;

    // This is the case of mouse hovering when already opened via keyboard or
    // vice versa
    if (!menuAlreadyOpen) {
      let open = (value: unknown) => {};
      const opened = new Promise((resolve) => {
        open = resolve;
      });
      menu.addEventListener('opened', open, {once: true});
      await opened;
    }
  }

  /**
   * Closes the submenu.
   */
  async close() {
    const menu = this.menu;
    if (!menu || !menu.open) return;

    this.dispatchEvent(createActivateTypeaheadEvent());
    menu.quick = true;
    menu.close();
    this.dispatchEvent(createDeactivateItemsEvent());
    let close = (value: unknown) => {};
    const closed = new Promise((resolve) => {
      close = resolve;
    });
    menu.addEventListener('closed', close, {once: true});
    await closed;
  }

  protected onSlotchange() {
    if (!this.item) {
      return;
    }

    // TODO(b/301296618): clean up old aria values on change
    this.item.ariaExpanded = 'false';
    this.item.ariaHasPopup = 'menu';
    if (this.menu?.id) {
      this.item.setAttribute('aria-controls', this.menu.id);
    }
    this.item.keepOpen = true;
  }

  /**
   * Starts the default 400ms countdown to open the submenu.
   *
   * NOTE: We explicitly use mouse events and not pointer events because
   * pointer events apply to touch events. And if a user were to tap a
   * sub-menu, it would fire the "pointerenter", "pointerleave", "click" events
   * which would open the menu on click, and then set the timeout to close the
   * menu due to pointerleave.
   */
  protected onMouseenter = () => {
    clearTimeout(this.previousOpenTimeout);
    clearTimeout(this.previousCloseTimeout);
    if (this.menu?.open) return;

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
   *
   * NOTE: We explicitly use mouse events and not pointer events because
   * pointer events apply to touch events. And if a user were to tap a
   * sub-menu, it would fire the "pointerenter", "pointerleave", "click" events
   * which would open the menu on click, and then set the timeout to close the
   * menu due to pointerleave.
   */
  protected onMouseleave = () => {
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

  protected onClick() {
    this.show();
  }

  /**
   * On item keydown handles opening the submenu.
   */
  protected async onKeydown(event: KeyboardEvent) {
    const shouldOpenSubmenu = this.isSubmenuOpenKey(event.code);

    if (event.defaultPrevented) return;

    const openedWithLR = shouldOpenSubmenu &&
        (NAVIGABLE_KEY.LEFT === event.code ||
         NAVIGABLE_KEY.RIGHT === event.code);

    if (event.code === SELECTION_KEY.SPACE || openedWithLR) {
      // prevent space from scrolling and Left + Right from selecting previous /
      // next items or opening / closing parent menus. Only open the submenu.
      event.preventDefault();

      if (openedWithLR) {
        event.stopPropagation();
      }
    }

    if (!shouldOpenSubmenu) {
      return;
    }

    const submenu = this.menu;
    if (!submenu) return;

    const submenuItems = submenu.items;
    const firstActivatableItem = List.getFirstActivatableItem(submenuItems);

    if (firstActivatableItem) {
      await this.show();

      firstActivatableItem.tabIndex = 0;
      firstActivatableItem.focus();

      return;
    }
  }

  private onCloseSubmenu(event: CloseMenuEvent) {
    const {itemPath, reason} = event.detail;
    itemPath.push(this.item);

    this.dispatchEvent(createActivateTypeaheadEvent());
    // Escape should only close one menu not all of the menus unlike space or
    // click selection which should close all menus.
    if (reason.kind === CLOSE_REASON.KEYDOWN &&
        reason.key === KEYDOWN_CLOSE_KEYS.ESCAPE) {
      event.stopPropagation();
      this.item.dispatchEvent(createRequestActivationEvent());
      return;
    }

    this.dispatchEvent(createDeactivateItemsEvent());
  }

  private async onSubMenuKeydown(event: KeyboardEvent) {
    if (event.defaultPrevented) return;
    const {close: shouldClose, keyCode} = this.isSubmenuCloseKey(event.code);
    if (!shouldClose) return;

    // Communicate that it's handled so that we don't accidentally close every
    // parent menu. Additionally, we want to isolate things like the typeahead
    // keydowns from bubbling up to the parent menu and confounding things.
    event.preventDefault();

    if (keyCode === NAVIGABLE_KEY.LEFT || keyCode === NAVIGABLE_KEY.RIGHT) {
      // Prevent this from bubbling to parents
      event.stopPropagation();
    }

    await this.close();

    List.deactivateActiveItem(this.menu.items);
    this.item?.focus();
    this.tabIndex = 0;
    this.item.focus();
  }

  /**
   * Determines whether the given KeyboardEvent code is one that should open
   * the submenu. This is RTL-aware. By default, left, right, space, or enter.
   *
   * @param code The native KeyboardEvent code.
   * @return Whether or not the key code should open the submenu.
   */
  private isSubmenuOpenKey(code: string) {
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
  private isSubmenuCloseKey(code: string) {
    const isRtl = getComputedStyle(this).direction === 'rtl';
    const arrowEnterKey = isRtl ? NAVIGABLE_KEY.RIGHT : NAVIGABLE_KEY.LEFT;
    switch (code) {
      case arrowEnterKey:
      case KEYDOWN_CLOSE_KEYS.ESCAPE:
        return {close: true, keyCode: code} as const;
      default:
        return {close: false} as const;
    }
  }
}
