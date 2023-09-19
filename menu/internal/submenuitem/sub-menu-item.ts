/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, PropertyValues} from 'lit';
import {property, query, queryAssignedElements, state} from 'lit/decorators.js';

import {List} from '../../../list/internal/list.js';
import {createDeactivateItemsEvent, createRequestActivationEvent} from '../../../list/internal/listitem/list-item.js';
import {MdRipple} from '../../../ripple/ripple.js';
import {Corner, Menu} from '../menu.js';
import {MenuItemEl} from '../menuitem/menu-item.js';
import {CLOSE_REASON, CloseMenuEvent, createActivateTypeaheadEvent, createDeactivateTypeaheadEvent, KEYDOWN_CLOSE_KEYS, NAVIGABLE_KEY, SELECTION_KEY} from '../shared.js';

/**
 * @fires deactivate-items Requests the parent menu to deselect other items when
 * a submenu opens
 * @fires request-activation Requests the parent make the element focusable and
 * focuses the item.
 * @fires deactivate-typeahead Requests the parent menu to deactivate the
 * typeahead functionality when a submenu opens
 * @fires activate-typeahead Requests the parent menu to activate the typeahead
 * functionality when a submenu closes
 */
export class SubMenuItem extends MenuItemEl {
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
   * Sets the item in the selected visual state when a submenu is opened.
   */
  @property({type: Boolean, reflect: true}) selected = false;

  @state() protected submenuHover = false;

  @query('md-ripple') private readonly rippleEl!: MdRipple;

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
   *
   * NOTE: We explicitly use mouse events and not pointer events because
   * pointer events apply to touch events. And if a user were to tap a
   * sub-menu-item, it would fire the "pointerenter", "pointerleave", "click"
   * events which would open the menu on click, and then set the timeout to
   * close the menu due to pointerleave.
   */
  protected override onMouseenter = () => {
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
   *
   * NOTE: We explicitly use mouse events and not pointer events because
   * pointer events apply to touch events. And if a user were to tap a
   * sub-menu-item, it would fire the "pointerenter", "pointerleave", "click"
   * events which would open the menu on click, and then set the timeout to
   * close the menu due to pointerleave.
   */
  protected override onMouseleave = () => {
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
    return {
      ...super.getRenderClasses(),
      'submenu-hover': this.submenuHover,
      selected: this.selected
    };
  }

  /**
   * On item keydown handles opening the submenu.
   */
  protected override onKeydown(event: KeyboardEvent) {
    const shouldOpenSubmenu = this.isSubmenuOpenKey(event.code);

    if (event.defaultPrevented || event.target !== this.listItemRoot) return;

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
      super.onKeydown(event);
      return;
    }

    const submenu = this.submenuEl;
    if (!submenu) return;

    const submenuItems = submenu.items;
    const firstActivatableItem = List.getFirstActivatableItem(submenuItems);

    if (firstActivatableItem) {
      this.show(() => {
        firstActivatableItem.tabIndex = 0;
        firstActivatableItem.focus();
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
        @mouseenter=${this.onSubmenuMouseEnter}
        @mouseleave=${this.onSubmenuMouseLeave}
        @keydown=${this.onSubMenuKeydown}
        @close-menu=${this.onCloseSubmenu}
    ></slot></span>`;
  }

  override firstUpdated(changed: PropertyValues<SubMenuItem>) {
    super.firstUpdated(changed);

    const {handleEvent} = this.rippleEl;

    // TODO(b/298476971): remove once ripple has a better solution
    this.rippleEl.handleEvent =
        callIfEventNotBubbledThroughMenu(this, handleEvent.bind(this.rippleEl));
  }

  private onCloseSubmenu(event: CloseMenuEvent) {
    const {itemPath, reason} = event.detail;
    itemPath.push(this);

    this.dispatchEvent(createActivateTypeaheadEvent());
    // Escape should only close one menu not all of the menus unlike space or
    // click selection which should close all menus.
    if (reason.kind === CLOSE_REASON.KEYDOWN &&
        reason.key === KEYDOWN_CLOSE_KEYS.ESCAPE) {
      event.stopPropagation();
      this.dispatchEvent(createRequestActivationEvent());
      return;
    }

    this.dispatchEvent(createDeactivateItemsEvent());
  }

  private onSubMenuKeydown(event: KeyboardEvent) {
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

    this.close(() => {
      List.deactivateActiveItem(this.submenuEl!.items);
      this.listItemRoot?.focus();
      this.tabIndex = 0;
      this.focus();
    });
  }

  /**
   * Shows the submenu.
   *
   * @param onOpened A function to call after the menu is opened.
   */
  show(onOpened = () => {}) {
    const menu = this.submenuEl;
    if (!menu || menu.open) return;

    // Ensures that we deselect items when the menu closes and reactivate
    // typeahead when the menu closes, so that we do not have dirty state of
    // selected sub-menu-items when we reopen.
    //
    // This cannot happen in `close()` because the menu may close via other
    // means Additionally, this cannot happen in onCloseSubmenu because
    // `close-menu` may not be called via focusout of outside click and not
    // triggered by an item
    menu.addEventListener('closed', () => {
      this.dispatchEvent(createActivateTypeaheadEvent());
      this.dispatchEvent(createDeactivateItemsEvent());
    }, {once: true});
    menu.quick = true;
    // Submenus are in overflow when not fixed. Can remove once we have native
    // popup support
    menu.hasOverflow = true;
    menu.anchorCorner = this.anchorCorner;
    menu.menuCorner = this.menuCorner;
    menu.anchorElement = this;
    // We manually set focus with `active` on keyboard navigation. And we
    // want to focus the root on hover, so the user can pick up navigation with
    // keyboard after hover.
    menu.defaultFocus = 'list-root';
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
    this.dispatchEvent(createDeactivateItemsEvent());
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
        return {close: true, keyCode: code} as const;
      default:
        return {close: false} as const;
    }
  }

  /**
   * NOTE: We explicitly use mouse events and not pointer events because
   * pointer events apply to touch events. And if a user were to tap a
   * sub-menu-item, it would fire the "pointerenter", "pointerleave", "click"
   * events which would open the menu on click, and then set the timeout to
   * close the menu due to pointerleave.
   */
  private onSubmenuMouseEnter() {
    this.submenuHover = true;
  }

  /**
   * NOTE: We explicitly use mouse events and not pointer events because
   * pointer events apply to touch events. And if a user were to tap a
   * sub-menu-item, it would fire the "pointerenter", "pointerleave", "click"
   * events which would open the menu on click, and then set the timeout to
   * close the menu due to pointerleave.
   */
  private onSubmenuMouseLeave() {
    this.submenuHover = false;
  }
}

/**
 * Calls the given callback if the event has not bubbled through an md-menu.
 */
function callIfEventNotBubbledThroughMenu(
    menuItem: HTMLElement, callback: (event: Event) => Promise<void>) {
  return async (event: Event) => {
    const path = event.composedPath();

    for (const element of path) {
      const isMenu =
          !!(element as Element | HTMLElement)?.hasAttribute?.('md-menu');

      // The path has a submenu, do not invoke callback;
      if (isMenu) return;

      // We have reached the target submenu. Any other menus in path are
      // ancestors.
      if (element === menuItem) {
        break;
      }
    }

    // invoke the callback because we have not run into a submenu.
    await callback(event);
  };
}
