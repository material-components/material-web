/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html} from 'lit';
import {property, queryAssignedElements, state} from 'lit/decorators.js';

import {List} from '../../../list/internal/list.js';
import {Corner, Menu} from '../menu.js';
import {MenuItemEl} from '../menuitem/menu-item.js';
import {CLOSE_REASON, CloseMenuEvent, createActivateTypeaheadEvent, createCloseOnFocusoutEvent, createDeactivateItemsEvent, createDeactivateTypeaheadEvent, createStayOpenOnFocusoutEvent, KEYDOWN_CLOSE_KEYS, NAVIGABLE_KEY, SELECTION_KEY} from '../shared.js';

function stopPropagation(event: Event) {
  event.stopPropagation();
}

/**
 * @fires deactivate-items Requests the parent menu to deselect other items when
 * a submenu opens
 * @fires deactivate-typeahead Requests the parent menu to deactivate the
 * typeahead functionality when a submenu opens
 * @fires activate-typeahead Requests the parent menu to activate the typeahead
 * functionality when a submenu closes
 * @fires stay-open-on-focusout Requests the parent menu to stay open when
 * focusout event is fired or has a `null` `relatedTarget` when submenu is
 * opened.
 * @fires close-on-focusout Requests the parent menu to close when focusout
 * event is fired or has a `null` `relatedTarget` When submenu is closed.
 */
export class SubMenuItem extends MenuItemEl {
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
  /**
   * Sets the item in the selected visual state when a submenu is opened.
   */
  @property({type: Boolean, reflect: true}) selected = false;

  @state() protected submenuHover = false;

  @queryAssignedElements({slot: 'submenu', flatten: true})
  private readonly menus!: Menu[];

  protected override keepOpenOnClick = true;
  private previousOpenTimeout = 0;
  private previousCloseTimeout = 0;

  private get submenuEl(): Menu|undefined {
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

  protected override getRenderClasses() {
    return {...super.getRenderClasses(), 'submenu-hover': this.submenuHover};
  }

  /**
   * On item keydown handles opening the submenu.
   */
  protected override onKeydown(event: KeyboardEvent) {
    const shouldOpenSubmenu = this.isSubmenuOpenKey(event.code);

    if (event.code === SELECTION_KEY.SPACE) {
      // prevent space from scrolling. Only open the submenu.
      event.preventDefault();
    }

    if (!shouldOpenSubmenu) {
      super.onKeydown(event);
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
  private renderSubMenu() {
    return html`<span class="submenu"><slot
        name="submenu"
        @pointerenter=${this.onSubmenuPointerEnter}
        @pointerleave=${this.onSubmenuPointerLeave}
        @pointerdown=${stopPropagation}
        @click=${stopPropagation}
        @keydown=${this.onSubMenuKeydown}
        @close-menu=${this.onCloseSubmenu}
    ></slot></span>`;
  }

  private onCloseSubmenu(event: CloseMenuEvent) {
    const {itemPath, reason} = event.detail;
    itemPath.push(this);
    // Restore focusout behavior
    this.dispatchEvent(createCloseOnFocusoutEvent());
    this.dispatchEvent(createActivateTypeaheadEvent());
    // Escape should only close one menu not all of the menus unlike space or
    // click selection which should close all menus.
    if (reason.kind === CLOSE_REASON.KEYDOWN &&
        reason.key === KEYDOWN_CLOSE_KEYS.ESCAPE) {
      event.stopPropagation();
      this.active = true;
      this.selected = false;
      // It might already be active so manually focus
      this.listItemRoot?.focus();
      return;
    }

    this.active = false;
    this.selected = false;
  }

  private async onSubMenuKeydown(event: KeyboardEvent) {
    // Stop propagation so that we don't accidentally close every parent menu.
    // Additionally, we want to isolate things like the typeahead keydowns
    // from bubbling up to the parent menu and confounding things.
    event.stopPropagation();
    const shouldClose = this.isSubmenuCloseKey(event.code);

    if (!shouldClose) return;

    this.close(() => {
      List.deactivateActiveItem(this.submenuEl!.items);
      this.listItemRoot?.focus();
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
    menu.stayOpenOnOutsideClick = true;
    menu.stayOpenOnFocusout = true;

    // Menu could already be opened because of mouse interaction
    const menuAlreadyOpen = menu.open;
    // We want the parent to stay open in the case such that a middle submenu
    // has a submenuitem hovered which opens a third submenut. Then if you hover
    // on yet another middle menu-item (not submenuitem) then focusout Event's
    // relatedTarget will be `null` thus, causing all the menus to close
    this.dispatchEvent(createStayOpenOnFocusoutEvent());
    menu.show();

    // Deactivate other items. This can be the case if the user has tabbed
    // around the menu and then mouses over an md-sub-menu.
    this.dispatchEvent(createDeactivateItemsEvent());
    this.dispatchEvent(createDeactivateTypeaheadEvent());
    this.selected = true;

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

    this.dispatchEvent(createActivateTypeaheadEvent());
    menu.quick = true;
    menu.close();
    // Restore focusout behavior.
    this.dispatchEvent(createCloseOnFocusoutEvent());
    this.active = false;
    this.selected = false;
    menu.addEventListener('closed', onClosed, {once: true});
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
        return true;
      default:
        return false;
    }
  }

  private onSubmenuPointerEnter() {
    this.submenuHover = true;
  }

  private onSubmenuPointerLeave() {
    this.submenuHover = false;
  }
}
