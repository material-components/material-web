/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../focus/md-focus-ring.js';
import '../../elevation/elevation.js';

import {html, isServer, LitElement} from 'lit';
import {property, query, queryAssignedElements, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {styleMap} from 'lit/directives/style-map.js';

import {polyfillElementInternalsAria, setupHostAria} from '../../internal/aria/aria.js';
import {createAnimationSignal, EASING} from '../../internal/motion/animation.js';

import {MenuItem} from './controllers/menuItemController.js';
import {ActivateTypeaheadEvent, DeactivateTypeaheadEvent, FocusState, isClosableKey, isElementInSubtree} from './controllers/shared.js';
import {Corner, SurfacePositionController, SurfacePositionTarget} from './controllers/surfacePositionController.js';
import {TypeaheadController} from './controllers/typeaheadController.js';
import {ListController, NavigableKeys} from './list-controller.js';
import {getActiveItem, getFirstActivatableItem, getLastActivatableItem} from './list-navigation-helpers.js';

export {Corner} from './controllers/surfacePositionController.js';

/**
 * The default value for the typeahead buffer time in Milliseconds.
 */
export const DEFAULT_TYPEAHEAD_BUFFER_TIME = 200;

const submenuNavKeys = new Set<string>([
  NavigableKeys.ArrowDown,
  NavigableKeys.ArrowUp,
  NavigableKeys.Home,
  NavigableKeys.End,
]);

const menuNavKeys = new Set<string>([
  NavigableKeys.ArrowLeft,
  NavigableKeys.ArrowRight,
  ...submenuNavKeys,
]);

/**
 * Gets the currently focused element on the page.
 *
 * @param activeDoc The document or shadowroot from which to start the search.
 *    Defaults to `window.document`
 * @return Returns the currently deeply focused element or `null` if none.
 */
function getFocusedElement(activeDoc: Document|ShadowRoot = document):
    HTMLElement|null {
  let activeEl = activeDoc.activeElement as HTMLElement | null;

  // Check for activeElement in the case that an element with a shadow root host
  // is currently focused.
  while (activeEl && activeEl?.shadowRoot?.activeElement) {
    activeEl = activeEl.shadowRoot.activeElement as HTMLElement | null;
  }

  return activeEl;
}

/**
 * @fires opening Fired before the opening animation begins
 * @fires opened Fired once the menu is open, after any animations
 * @fires closing Fired before the closing animation begins
 * @fires closed Fired once the menu is closed, after any animations
 */
export abstract class Menu extends LitElement {
  static {
    // We want to manage tabindex ourselves.
    setupHostAria(Menu, {focusable: false});
  }

  @query('.menu') private readonly surfaceEl!: HTMLElement|null;
  @query('slot') private readonly slotEl!: HTMLSlotElement|null;

  /**
   * The ID of the element in the same root node in which the menu should align
   * to. Overrides setting `anchorElement = elementReference`.
   *
   * __NOTE__: anchor or anchorElement must either be an HTMLElement or resolve
   * to an HTMLElement in order for menu to open.
   */
  @property() anchor = '';
  /**
   * Whether the positioning algorithim should calculate relative to the parent
   * of the anchor element (absolute) or relative to the window (fixed).
   *
   * Examples for `position = 'fixed'`:
   *
   * - If there is no `position:relative` in the given parent tree and the
   *   surface is `position:absolute`
   * - If the surface is `position:fixed`
   * - If the surface is in the "top layer"
   * - The anchor and the surface do not share a common `position:relative`
   *   ancestor
   *
   * When using positioning = fixed, in most cases, the menu should position
   * itself above most other `position:absolute` or `position:fixed` elements
   * when placed inside of them. e.g. using a menu inside of an `md-dialog`.
   *
   * __NOTE__: Fixed menus will not scroll with the page and will be fixed to
   * the window instead.
   */
  @property() positioning: 'absolute'|'fixed' = 'absolute';
  /**
   * Skips the opening and closing animations.
   */
  @property({type: Boolean}) quick = false;
  /**
   * Displays overflow content like a submenu.
   *
   * __NOTE__: This may cause adverse effects if you set
   * `md-menu {max-height:...}`
   * and have items overflowing items in the "y" direction.
   */
  @property({type: Boolean, attribute: 'has-overflow'}) hasOverflow = false;
  /**
   * Opens the menu and makes it visible. Alternative to the `.show()` and
   * `.close()` methods
   */
  @property({type: Boolean, reflect: true}) open = false;
  /**
   * Offsets the menu's inline alignment from the anchor by the given number in
   * pixels. This value is direction aware and will follow the LTR / RTL
   * direction.
   *
   * e.g. LTR: positive -> right, negative -> left
   *      RTL: positive -> left, negative -> right
   */
  @property({type: Number, attribute: 'x-offset'}) xOffset = 0;
  /**
   * Offsets the menu's block alignment from the anchor by the given number in
   * pixels.
   *
   * e.g. positive -> down, negative -> up
   */
  @property({type: Number, attribute: 'y-offset'}) yOffset = 0;
  /**
   * The max time between the keystrokes of the typeahead menu behavior before
   * it clears the typeahead buffer.
   */
  @property({type: Number, attribute: 'typeahead-delay'})
  typeaheadDelay = DEFAULT_TYPEAHEAD_BUFFER_TIME;
  /**
   * The corner of the anchor which to align the menu in the standard logical
   * property style of <block>-<inline> e.g. `'end-start'`.
   *
   * NOTE: This value may not be respected by the menu positioning algorithm
   * if the menu would render outisde the viewport.
   */
  @property({attribute: 'anchor-corner'})
  anchorCorner: Corner = Corner.END_START;
  /**
   * The corner of the menu which to align the anchor in the standard logical
   * property style of <block>-<inline> e.g. `'start-start'`.
   *
   * NOTE: This value may not be respected by the menu positioning algorithm
   * if the menu would render outisde the viewport.
   */
  @property({attribute: 'menu-corner'}) menuCorner: Corner = Corner.START_START;
  /**
   * Keeps the user clicks outside the menu.
   *
   * NOTE: clicking outside may still cause focusout to close the menu so see
   * `stayOpenOnFocusout`.
   */
  @property({type: Boolean, attribute: 'stay-open-on-outside-click'})
  stayOpenOnOutsideClick = false;
  /**
   * Keeps the menu open when focus leaves the menu's composed subtree.
   *
   * NOTE: Focusout behavior will stop propagation of the focusout event. Set
   * this property to true to opt-out of menu's focuout handling altogether.
   */
  @property({type: Boolean, attribute: 'stay-open-on-focusout'})
  stayOpenOnFocusout = false;
  /**
   * After closing, does not restore focus to the last focused element before
   * the menu was opened.
   */
  @property({type: Boolean, attribute: 'skip-restore-focus'})
  skipRestoreFocus = false;
  /**
   * The element that should be focused by default once opened.
   *
   * NOTE: When setting default focus to 'LIST_ROOT', remember to change
   * `list-tabindex` to `0` when necessary.
   */
  @property({attribute: 'default-focus'})
  defaultFocus: FocusState = FocusState.FIRST_ITEM;

  @queryAssignedElements({flatten: true}) protected slotItems!: HTMLElement[];
  @state() private typeaheadActive = true;

  /**
   * Whether or not the current menu is a submenu and should not handle specific
   * navigation keys.
   *
   * @exports
   */
  isSubmenu = false;

  /**
   * The event path of the last window pointerdown event.
   */
  private pointerPath: EventTarget[] = [];
  private isPointerDown = false;
  private readonly openCloseAnimationSignal = createAnimationSignal();

  private readonly listController = new ListController<MenuItem>({
    isItem: (maybeItem: HTMLElement): maybeItem is MenuItem => {
      return maybeItem.hasAttribute('md-menu-item');
    },
    getPossibleItems: () => this.slotItems,
    isRtl: () => (getComputedStyle(this).direction === 'rtl'),
    deactivateItem:
        (item: MenuItem) => {
          item.selected = false;
          item.tabIndex = -1;
        },
    activateItem:
        (item: MenuItem) => {
          item.selected = true;
          item.tabIndex = 0;
        },
    isNavigableKey:
        (key: string) => {
          if (!this.isSubmenu) {
            return menuNavKeys.has(key);
          }

          const isRtl = getComputedStyle(this).direction === 'rtl';
          // we want md-submenu to handle the submenu's left/right arrow exit
          // key so it can close the menu instead of navigate the list.
          // Therefore we need to include all keys but left/right arrow close
          // key
          const arrowOpen =
              isRtl ? NavigableKeys.ArrowLeft : NavigableKeys.ArrowRight;

          if (key === arrowOpen) {
            return true;
          }

          return submenuNavKeys.has(key);
        },
  });

  /**
   * Whether the menu is animating upwards or downwards when opening. This is
   * helpful for calculating some animation calculations.
   */
  private get openDirection(): 'UP'|'DOWN' {
    const menuCornerBlock = this.menuCorner.split('_')[0];
    return menuCornerBlock === 'START' ? 'DOWN' : 'UP';
  }

  /**
   * The element that was focused before the menu opened.
   */
  private lastFocusedElement: HTMLElement|null = null;

  /**
   * Handles typeahead navigation through the menu.
   */
  typeaheadController = new TypeaheadController(() => {
    return {
      getItems: () => this.items,
      typeaheadBufferTime: this.typeaheadDelay,
      active: this.typeaheadActive
    };
  });

  private currentAnchorElement: HTMLElement|null = null;

  /**
   * The element which the menu should align to. If `anchor` is set to a
   * non-empty idref string, then `anchorEl` will resolve to the element with
   * the given id in the same root node. Otherwise, `null`.
   */
  get anchorElement(): HTMLElement&Partial<SurfacePositionTarget>|null {
    if (this.anchor) {
      return (this.getRootNode() as Document | ShadowRoot)
          .querySelector(`#${this.anchor}`);
    }

    return this.currentAnchorElement;
  }

  set anchorElement(element: HTMLElement&Partial<SurfacePositionTarget>|null) {
    this.currentAnchorElement = element;
    this.requestUpdate('anchorElement');
  }

  private readonly internals = polyfillElementInternalsAria(
      this, (this as HTMLElement /* needed for closure */).attachInternals());

  constructor() {
    super();
    if (!isServer) {
      this.internals.role = 'menu';
      this.addEventListener('keydown', this.listController.handleKeydown);
      // Capture so that we can grab the event before it reaches the menu item
      // istelf. Specifically useful for the case where typeahead encounters a
      // space and we don't want the menu item to close the menu.
      this.addEventListener('keydown', this.captureKeydown, {capture: true});
    }
  }

  /**
   * Handles positioning the surface and aligning it to the anchor as well as
   * keeping it in the viewport.
   */
  private readonly menuPositionController =
      new SurfacePositionController(this, () => {
        return {
          anchorCorner: this.anchorCorner,
          surfaceCorner: this.menuCorner,
          surfaceEl: this.surfaceEl,
          anchorEl: this.anchorElement,
          positioning: this.positioning,
          isOpen: this.open,
          xOffset: this.xOffset,
          yOffset: this.yOffset,
          onOpen: this.onOpened,
          beforeClose: this.beforeClose,
          onClose: this.onClosed,
          // We can't resize components that have overflow like menus with
          // submenus because the overflow-y will show menu items / content
          // outside the bounds of the menu. (to be fixed w/ popover API)
          repositionStrategy: this.hasOverflow ? 'move' : 'resize',
        };
      });

  /**
   * The menu items associated with this menu. The items must be `MenuItem`s and
   * have both the `md-menu-item` and `md-list-item` attributes.
   */
  get items(): MenuItem[] {
    return this.listController.items;
  }

  protected override render() {
    return this.renderSurface();
  }

  /**
   * Renders the positionable surface element and its contents.
   */
  private renderSurface() {
    return html`
       <div
          class="menu ${classMap(this.getSurfaceClasses())}"
          style=${styleMap(this.menuPositionController.surfaceStyles)}
          @focusout=${this.handleFocusout}>
        ${this.renderElevation()}
        <div class="items">
          <div class="item-padding">
            ${this.renderMenuItems()}
          </div>
        </div>
        ${this.renderFocusRing()}
       </div>
     `;
  }

  /**
   * Renders the menu items' slot
   */
  private renderMenuItems() {
    return html`<slot
        @close-menu=${this.onCloseMenu}
        @deactivate-items=${this.onDeactivateItems}
        @request-activation=${this.onRequestActivation}
        @deactivate-typeahead=${this.handleDeactivateTypeahead}
        @activate-typeahead=${this.handleActivateTypeahead}
        @stay-open-on-focusout=${this.handleStayOpenOnFocusout}
        @close-on-focusout=${this.handleCloseOnFocusout}
        @slotchange=${this.listController.onSlotchange}></slot>`;
  }

  /**
   * Renders the elevation component.
   */
  private renderElevation() {
    return html`<md-elevation part="elevation"></md-elevation>`;
  }

  /**
   * Renders the focus ring component.
   */
  private renderFocusRing() {
    return html`<md-focus-ring part="focus-ring" for="list"></md-focus-ring>`;
  }

  private getSurfaceClasses() {
    return {
      open: this.open,
      fixed: this.positioning === 'fixed',
      'has-overflow': this.hasOverflow,
    };
  }

  private async handleFocusout(event: FocusEvent) {
    if (this.stayOpenOnFocusout || !this.open) {
      return;
    }

    if (event.relatedTarget) {
      // Don't close the menu if we are switching focus between menu,
      // md-menu-item, and md-list
      if (isElementInSubtree(event.relatedTarget, this)) {
        return;
      }

      const anchorEl = this.anchorElement!;
      const wasAnchorClickFocused =
          isElementInSubtree(event.relatedTarget, anchorEl) &&
          this.isPointerDown;
      if (wasAnchorClickFocused) {
        return;
      }
    } else if (this.isPointerDown && this.pointerPath.includes(this)) {
      // If menu tabindex == -1 and the user clicks on the menu or a divider, we
      // want to keep the menu open.
      return;
    }

    const oldRestoreFocus = this.skipRestoreFocus;
    // allow focus to continue to the next focused object rather than returning
    this.skipRestoreFocus = true;
    this.close();
    // await for close
    await this.updateComplete;
    // return to previous behavior
    this.skipRestoreFocus = oldRestoreFocus;
  }

  private captureKeydown(event: KeyboardEvent) {
    if (event.target === this && !event.defaultPrevented &&
        isClosableKey(event.code)) {
      event.preventDefault();
      this.close();
    }

    this.typeaheadController.onKeydown(event);
  }

  /**
   * Saves the last focused element focuses the new element based on
   * `defaultFocus`, and animates open.
   */
  private readonly onOpened = async () => {
    this.lastFocusedElement = getFocusedElement();

    const items = this.items;
    const activeItemRecord = getActiveItem(items);

    if (activeItemRecord && this.defaultFocus !== FocusState.NONE) {
      activeItemRecord.item.tabIndex = -1;
    }

    let animationAborted = !this.quick;

    if (this.quick) {
      this.dispatchEvent(new Event('opening'));
    } else {
      animationAborted = !!await this.animateOpen();
    }

    // This must come after the opening animation or else it may focus one of
    // the items before the animation has begun and causes the list to slide
    // (block-padding-of-the-menu)px at the end of the animation
    switch (this.defaultFocus) {
      case FocusState.FIRST_ITEM:
        const first = getFirstActivatableItem(items);
        if (first) {
          first.tabIndex = 0;
          first.focus();
          await (first as LitElement & MenuItem).updateComplete;
        }
        break;
      case FocusState.LAST_ITEM:
        const last = getLastActivatableItem(items);
        if (last) {
          last.tabIndex = 0;
          last.focus();
          await (last as LitElement & MenuItem).updateComplete;
        }
        break;
      case FocusState.LIST_ROOT:
        this.focus();
        break;
      default:
      case FocusState.NONE:
        // Do nothing.
        break;
    }

    if (!animationAborted) {
      this.dispatchEvent(new Event('opened'));
    }
  };

  /**
   * Animates closed.
   */
  private readonly beforeClose = async () => {
    this.open = false;

    if (!this.skipRestoreFocus) {
      this.lastFocusedElement?.focus?.();
    }

    if (!this.quick) {
      await this.animateClose();
    }
  };

  /**
   * Focuses the last focused element.
   */
  private readonly onClosed = () => {
    if (this.quick) {
      this.dispatchEvent(new Event('closing'));
      this.dispatchEvent(new Event('closed'));
    }
  };

  /**
   * Performs the opening animation:
   *
   * https://direct.googleplex.com/#/spec/295000003+271060003
   *
   * @return A promise that resolve to `true` if the animation was aborted,
   *     `false` if it was not aborted.
   */
  private async animateOpen() {
    const surfaceEl = this.surfaceEl;
    const slotEl = this.slotEl;

    if (!surfaceEl || !slotEl) return true;

    const openDirection = this.openDirection;
    this.dispatchEvent(new Event('opening'));
    // needs to be imperative because we don't want to mix animation and Lit
    // render timing
    surfaceEl.classList.toggle('animating', true);

    const signal = this.openCloseAnimationSignal.start();
    const height = surfaceEl.offsetHeight;
    const openingUpwards = openDirection === 'UP';
    const children = this.items;
    const FULL_DURATION = 500;
    const SURFACE_OPACITY_DURATION = 50;
    const ITEM_OPACITY_DURATION = 250;
    // We want to fit every child fade-in animation within the full duration of
    // the animation.
    const DELAY_BETWEEN_ITEMS =
        (FULL_DURATION - ITEM_OPACITY_DURATION) / children.length;

    const surfaceHeightAnimation =
        surfaceEl.animate([{height: '0px'}, {height: `${height}px`}], {
          duration: FULL_DURATION,
          easing: EASING.EMPHASIZED,
        });
    // When we are opening upwards, we want to make sure the last item is always
    // in view, so we need to translate it upwards the opposite direction of the
    // height animation
    const upPositionCorrectionAnimation = slotEl.animate(
        [
          {transform: openingUpwards ? `translateY(-${height}px)` : ''},
          {transform: ''}
        ],
        {duration: FULL_DURATION, easing: EASING.EMPHASIZED});

    const surfaceOpacityAnimation = surfaceEl.animate(
        [{opacity: 0}, {opacity: 1}], SURFACE_OPACITY_DURATION);

    const childrenAnimations: Array<[HTMLElement, Animation]> = [];

    for (let i = 0; i < children.length; i++) {
      // If we are animating upwards, then reverse the children list.
      const directionalIndex = openingUpwards ? children.length - 1 - i : i;
      const child = children[directionalIndex];
      const animation = child.animate([{opacity: 0}, {opacity: 1}], {
        duration: ITEM_OPACITY_DURATION,
        delay: DELAY_BETWEEN_ITEMS * i,
      });

      // Make them all initially hidden and then clean up at the end of each
      // animation.
      child.classList.toggle('md-menu-hidden', true);
      animation.addEventListener('finish', () => {
        child.classList.toggle('md-menu-hidden', false);
      });

      childrenAnimations.push([child, animation]);
    }

    let resolveAnimation = (value: boolean) => {};
    const animationFinished = new Promise<boolean>((resolve) => {
      resolveAnimation = resolve;
    });

    signal.addEventListener('abort', () => {
      surfaceHeightAnimation.cancel();
      upPositionCorrectionAnimation.cancel();
      surfaceOpacityAnimation.cancel();
      childrenAnimations.forEach(([child, animation]) => {
        child.classList.toggle('md-menu-hidden', false);
        animation.cancel();
      });

      resolveAnimation(true);
    });

    surfaceHeightAnimation.addEventListener('finish', () => {
      surfaceEl.classList.toggle('animating', false);
      this.openCloseAnimationSignal.finish();
      resolveAnimation(false);
    });

    return await animationFinished;
  }

  /**
   * Performs the closing animation:
   *
   * https://direct.googleplex.com/#/spec/295000003+271060003
   */
  private animateClose() {
    let resolve!: (value: unknown) => void;
    let reject!: () => void;

    // This promise blocks the surface position controller from setting
    // display: none on the surface which will interfere with this animation.
    const animationEnded = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });

    const surfaceEl = this.surfaceEl;
    const slotEl = this.slotEl;

    if (!surfaceEl || !slotEl) {
      reject();
      return animationEnded;
    }

    const openDirection = this.openDirection;
    const closingDownwards = openDirection === 'UP';
    this.dispatchEvent(new Event('closing'));
    // needs to be imperative because we don't want to mix animation and Lit
    // render timing
    surfaceEl.classList.toggle('animating', true);
    const signal = this.openCloseAnimationSignal.start();
    const height = surfaceEl.offsetHeight;
    const children = this.items;
    const FULL_DURATION = 150;
    const SURFACE_OPACITY_DURATION = 50;
    // The surface fades away at the very end
    const SURFACE_OPACITY_DELAY = FULL_DURATION - SURFACE_OPACITY_DURATION;
    const ITEM_OPACITY_DURATION = 50;
    const ITEM_OPACITY_INITIAL_DELAY = 50;
    const END_HEIGHT_PERCENTAGE = .35;

    // We want to fit every child fade-out animation within the full duration of
    // the animation.
    const DELAY_BETWEEN_ITEMS =
        (FULL_DURATION - ITEM_OPACITY_INITIAL_DELAY - ITEM_OPACITY_DURATION) /
        children.length;

    // The mock has the animation shrink to 35%
    const surfaceHeightAnimation = surfaceEl.animate(
        [
          {height: `${height}px`},
          {height: `${height * END_HEIGHT_PERCENTAGE}px`}
        ],
        {
          duration: FULL_DURATION,
          easing: EASING.EMPHASIZED_ACCELERATE,
        });

    // When we are closing downwards, we want to make sure the last item is
    // always in view, so we need to translate it upwards the opposite direction
    // of the height animation
    const downPositionCorrectionAnimation = slotEl.animate(
        [
          {transform: ''}, {
            transform: closingDownwards ?
                `translateY(-${height * (1 - END_HEIGHT_PERCENTAGE)}px)` :
                ''
          }
        ],
        {duration: FULL_DURATION, easing: EASING.EMPHASIZED_ACCELERATE});

    const surfaceOpacityAnimation = surfaceEl.animate(
        [{opacity: 1}, {opacity: 0}],
        {duration: SURFACE_OPACITY_DURATION, delay: SURFACE_OPACITY_DELAY});

    const childrenAnimations: Array<[HTMLElement, Animation]> = [];

    for (let i = 0; i < children.length; i++) {
      // If the animation is closing upwards, then reverse the list of
      // children so that we animate in the opposite direction.
      const directionalIndex = closingDownwards ? i : children.length - 1 - i;
      const child = children[directionalIndex];
      const animation = child.animate([{opacity: 1}, {opacity: 0}], {
        duration: ITEM_OPACITY_DURATION,
        delay: ITEM_OPACITY_INITIAL_DELAY + DELAY_BETWEEN_ITEMS * i,
      });

      // Make sure the items stay hidden at the end of each child animation.
      // We clean this up at the end of the overall animation.
      animation.addEventListener('finish', () => {
        child.classList.toggle('md-menu-hidden', true);
      });
      childrenAnimations.push([child, animation]);
    }

    signal.addEventListener('abort', () => {
      surfaceHeightAnimation.cancel();
      downPositionCorrectionAnimation.cancel();
      surfaceOpacityAnimation.cancel();
      childrenAnimations.forEach(([child, animation]) => {
        animation.cancel();
        child.classList.toggle('md-menu-hidden', false);
      });
      reject();
    });

    surfaceHeightAnimation.addEventListener('finish', () => {
      surfaceEl.classList.toggle('animating', false);
      childrenAnimations.forEach(([child]) => {
        child.classList.toggle('md-menu-hidden', false);
      });
      this.openCloseAnimationSignal.finish();
      this.dispatchEvent(new Event('closed'));
      resolve(true);
    });

    return animationEnded;
  }

  override connectedCallback() {
    super.connectedCallback();
    if (!isServer) {
      window.addEventListener('click', this.onWindowClick, {capture: true});
      window.addEventListener('pointerdown', this.onWindowPointerdown);
      window.addEventListener('pointerup', this.onWindowPointerup);
    }

    // need to self-identify as an md-menu for submenu ripple identification.
    this.toggleAttribute('md-menu', true);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    if (!isServer) {
      window.removeEventListener('click', this.onWindowClick, {capture: true});
      window.removeEventListener('pointerdown', this.onWindowPointerdown);
      window.removeEventListener('pointerup', this.onWindowPointerup);
    }
  }

  private readonly onWindowPointerdown = (event: PointerEvent) => {
    this.isPointerDown = true;
    this.pointerPath = event.composedPath();
  };

  private readonly onWindowPointerup = () => {
    this.isPointerDown = false;
  };

  private readonly onWindowClick = (event: MouseEvent) => {
    if (!this.open) {
      return;
    }

    const path = event.composedPath();

    if (!this.stayOpenOnOutsideClick && !path.includes(this) &&
        !path.includes(this.anchorElement!)) {
      this.open = false;
    }
  };

  private onCloseMenu() {
    this.close();
  }

  private onDeactivateItems(event: Event) {
    event.stopPropagation();
    this.listController.onDeactivateItems();
  }

  private onRequestActivation(event: Event) {
    event.stopPropagation();
    this.listController.onRequestActivation(event);
  }

  private handleDeactivateTypeahead(event: DeactivateTypeaheadEvent) {
    // stopPropagation so that this does not deactivate any typeaheads in menus
    // nested above it e.g. md-sub-menu
    event.stopPropagation();
    this.typeaheadActive = false;
  }

  private handleActivateTypeahead(event: ActivateTypeaheadEvent) {
    // stopPropagation so that this does not activate any typeaheads in menus
    // nested above it e.g. md-sub-menu
    event.stopPropagation();
    this.typeaheadActive = true;
  }

  private handleStayOpenOnFocusout(event: Event) {
    event.stopPropagation();
    this.stayOpenOnFocusout = true;
  }

  private handleCloseOnFocusout(event: Event) {
    event.stopPropagation();
    this.stayOpenOnFocusout = false;
  }

  close() {
    this.open = false;
    const maybeSubmenu =
        this.slotItems as Array<HTMLElement&{close?: () => void}>;
    maybeSubmenu.forEach(item => {
      item.close?.();
    });
  }

  show() {
    this.open = true;
  }

  /**
   * Activates the next item in the menu. If at the end of the menu, the first
   * item will be activated.
   *
   * @return The activated menu item or `null` if there are no items.
   */
  activateNextItem() {
    return this.listController.activateNextItem() ?? null;
  }

  /**
   * Activates the previous item in the menu. If at the start of the menu, the
   * last item will be activated.
   *
   * @return The activated menu item or `null` if there are no items.
   */
  activatePreviousItem() {
    return this.listController.activatePreviousItem() ?? null;
  }
}
