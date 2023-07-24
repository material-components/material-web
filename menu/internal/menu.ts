/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../list/list.js';
import '../../focus/md-focus-ring.js';
import '../../elevation/elevation.js';

import {html, isServer, LitElement, nothing} from 'lit';
import {eventOptions, property, query, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {styleMap} from 'lit/directives/style-map.js';

import {ARIAMixinStrict, ARIARole} from '../../internal/aria/aria.js';
import {requestUpdateOnAriaChange} from '../../internal/aria/delegate.js';
import {createAnimationSignal, EASING} from '../../internal/motion/animation.js';
import {List} from '../../list/internal/list.js';

import {ActivateTypeaheadEvent, DeactivateTypeaheadEvent, isClosableKey, isElementInSubtree, MenuItem} from './shared.js';
import {Corner, SurfacePositionController, SurfacePositionTarget} from './surfacePositionController.js';
import {TypeaheadController} from './typeaheadController.js';

export {Corner} from './surfacePositionController.js';

/**
 * The default value for the typeahead buffer time in Milliseconds.
 */
export const DEFAULT_TYPEAHEAD_BUFFER_TIME = 200;

/**
 * Element to focus on when menu is first opened.
 */
export type DefaultFocusState = 'NONE'|'LIST_ROOT'|'FIRST_ITEM'|'LAST_ITEM';

/**
 * Gets the currently focused element on the page.
 *
 * @param activeDoc The document or shadowroot from which to start the search.
 *    Defaults to `window.document`
 * @return Returns the currently deeply focused element or `null` if none.
 */
function getFocusedElement(activeDoc: Document|ShadowRoot = document):
    HTMLElement|null {
  const activeEl = activeDoc.activeElement as HTMLElement | null;

  if (!activeEl) {
    return null;
  }

  if (activeEl.shadowRoot) {
    return getFocusedElement(activeEl.shadowRoot) ?? activeEl;
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
    requestUpdateOnAriaChange(this);
  }

  @query('md-list') private readonly listElement!: List|null;
  @query('.menu') private readonly surfaceEl!: HTMLElement|null;
  @query('slot') private readonly slotEl!: HTMLSlotElement|null;

  /**
   * The element in which the menu should align to.
   */
  @property({attribute: false})
  anchor: HTMLElement&Partial<SurfacePositionTarget>|null = null;
  /**
   * Makes the element use `position:fixed` instead of `position:absolute`. In
   * most cases, the menu should position itself above most other
   * `position:absolute` or `position:fixed` elements when placed inside of
   * them. e.g. using a menu inside of an `md-dialog`.
   *
   * __NOTE__: Fixed menus will not scroll with the page and will be fixed to
   * the window instead.
   */
  @property({type: Boolean}) fixed = false;
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
   * The tabindex of the underlying list element.
   */
  @property({type: Number, attribute: 'list-tabindex'}) listTabIndex = 0;
  /**
   * The role of the underlying list element.
   */
  @property() type: ARIARole = 'menu';
  /**
   * The max time between the keystrokes of the typeahead menu behavior before
   * it clears the typeahead buffer.
   */
  @property({type: Number, attribute: 'typeahead-delay'})
  typeaheadDelay = DEFAULT_TYPEAHEAD_BUFFER_TIME;
  /**
   * The corner of the anchor which to align the menu in the standard logical
   * property style of <block>_<inline>.
   */
  @property({attribute: 'anchor-corner'}) anchorCorner: Corner = 'END_START';
  /**
   * The corner of the menu which to align the anchor in the standard logical
   * property style of <block>_<inline>.
   */
  @property({attribute: 'menu-corner'}) menuCorner: Corner = 'START_START';
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
   */
  @property({attribute: 'default-focus'})
  defaultFocus: DefaultFocusState = 'LIST_ROOT';

  @state() private typeaheadActive = true;

  private readonly openCloseAnimationSignal = createAnimationSignal();

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

  /**
   * Handles positioning the surface and aligning it to the anchor.
   */
  private readonly menuPositionController =
      new SurfacePositionController(this, () => {
        return {
          anchorCorner: this.anchorCorner,
          surfaceCorner: this.menuCorner,
          surfaceEl: this.surfaceEl,
          anchorEl: this.anchor,
          isTopLayer: this.fixed,
          isOpen: this.open,
          xOffset: this.xOffset,
          yOffset: this.yOffset,
          onOpen: this.onOpened,
          beforeClose: this.beforeClose,
          onClose: this.onClosed,
        };
      });

  /**
   * The menu items associated with this menu. The items must be `MenuItem`s and
   * have both the `md-menu-item` and `md-list-item` attributes.
   */
  get items(): MenuItem[] {
    const listElement = this.listElement;

    if (listElement) {
      return listElement.items.filter(el => el.hasAttribute('md-menu-item')) as
          MenuItem[];
    }

    return [];
  }

  protected override render() {
    return this.renderSurface();
  }

  /**
   * Renders the positionable surface element and its contents.
   */
  private renderSurface() {
    // TODO(b/274140618): elevation should be an underlay, not an overlay that
    // tints content
    return html`
       <div
          class="menu ${classMap(this.getSurfaceClasses())}"
          style=${styleMap(this.menuPositionController.surfaceStyles)}
          @focusout=${this.handleFocusout}>
        ${this.renderElevation()}
        ${this.renderList()}
        ${this.renderFocusRing()}
       </div>
     `;
  }

  /**
   * Renders the List element and its items
   */
  private renderList() {
    // Needed for closure conformance
    const {ariaLabel} = this as ARIAMixinStrict;
    return html`
      <md-list
          id="list"
          aria-label=${ariaLabel || nothing}
          type=${this.type}
          listTabIndex=${this.listTabIndex}
          @keydown=${this.handleListKeydown}>
        ${this.renderMenuItems()}
      </md-list>`;
  }

  /**
   * Renders the menu items' slot
   */
  private renderMenuItems() {
    return html`<slot
        @close-menu=${this.onCloseMenu}
        @deactivate-items=${this.onDeactivateItems}
        @deactivate-typeahead=${this.handleDeactivateTypeahead}
        @activate-typeahead=${this.handleActivateTypeahead}
        @stay-open-on-focusout=${this.handleStayOpenOnFocusout}
        @close-on-focusout=${this.handleCloseOnFocusout}></slot>`;
  }

  /**
   * Renders the elevation component.
   */
  private renderElevation() {
    return html`<md-elevation></md-elevation>`;
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
      fixed: this.fixed,
      'has-overflow': this.hasOverflow,
    };
  }

  private async handleFocusout(event: FocusEvent) {
    if (this.stayOpenOnFocusout) {
      return;
    }

    // Stop propagation to prevent nested menus from interfering with each other
    event.stopPropagation();

    if (event.relatedTarget) {
      // Don't close the menu if we are switching focus between menu,
      // md-menu-item, and md-list
      if (isElementInSubtree(event.relatedTarget, this)) {
        return;
      }
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

  // Capture so that we can grab the event before it reaches the list item
  // istelf. Specifically useful for the case where typeahead encounters a space
  // and we don't want the menu item to close the menu.
  @eventOptions({capture: true})
  private handleListKeydown(event: KeyboardEvent) {
    if (event.target === this.listElement && !event.defaultPrevented &&
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
  private readonly onOpened = () => {
    this.lastFocusedElement = getFocusedElement();

    if (!this.listElement) return;

    const items = this.listElement.items;
    const activeItemRecord = List.getActiveItem(items);

    if (activeItemRecord && this.defaultFocus !== 'NONE') {
      activeItemRecord.item.active = false;
    }

    switch (this.defaultFocus) {
      case 'FIRST_ITEM':
        const first = List.getFirstActivatableItem(items);
        if (first) {
          first.active = true;
        }
        break;
      case 'LAST_ITEM':
        const last = List.getLastActivatableItem(items);
        if (last) {
          last.active = true;
        }
        break;
      case 'LIST_ROOT':
        this.listElement?.focus();
        break;
      default:
      case 'NONE':
        // Do nothing.
        break;
    }

    if (this.quick) {
      this.dispatchEvent(new Event('opening'));
      this.dispatchEvent(new Event('opened'));
    } else {
      this.animateOpen();
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
   */
  private animateOpen() {
    const surfaceEl = this.surfaceEl;
    const slotEl = this.slotEl;

    if (!surfaceEl || !slotEl) return;

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
      child.classList.toggle('hidden', true);
      animation.addEventListener('finish', () => {
        child.classList.toggle('hidden', false);
      });

      childrenAnimations.push([child, animation]);
    }

    signal.addEventListener('abort', () => {
      surfaceHeightAnimation.cancel();
      upPositionCorrectionAnimation.cancel();
      surfaceOpacityAnimation.cancel();
      childrenAnimations.forEach(([child, animation]) => {
        child.classList.toggle('hidden', false);
        animation.cancel();
      });
    });

    surfaceHeightAnimation.addEventListener('finish', () => {
      surfaceEl.classList.toggle('animating', false);
      this.openCloseAnimationSignal.finish();
      this.dispatchEvent(new Event('opened'));
    });
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
        child.classList.toggle('hidden', true);
      });
      childrenAnimations.push([child, animation]);
    }

    signal.addEventListener('abort', () => {
      surfaceHeightAnimation.cancel();
      downPositionCorrectionAnimation.cancel();
      surfaceOpacityAnimation.cancel();
      childrenAnimations.forEach(([child, animation]) => {
        animation.cancel();
        child.classList.toggle('hidden', false);
      });
      reject();
    });

    surfaceHeightAnimation.addEventListener('finish', () => {
      surfaceEl.classList.toggle('animating', false);
      childrenAnimations.forEach(([child]) => {
        child.classList.toggle('hidden', false);
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
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    if (!isServer) {
      window.removeEventListener('click', this.onWindowClick, {capture: true});
    }
  }

  private readonly onWindowClick = (event: MouseEvent) => {
    if (!this.stayOpenOnOutsideClick && !event.composedPath().includes(this)) {
      this.open = false;
    }
  };

  private onCloseMenu() {
    this.close();
  }

  private onDeactivateItems(event: Event) {
    event.stopPropagation();
    const items = this.items;
    for (const item of items) {
      item.active = false;
      item.selected = false;
    }
  }

  private handleDeactivateTypeahead(event: DeactivateTypeaheadEvent) {
    // stopPropagation so that this does not deactivate any typeaheads in menus
    // nested above it e.g. md-sub-menu-item
    event.stopPropagation();
    this.typeaheadActive = false;
  }

  private handleActivateTypeahead(event: ActivateTypeaheadEvent) {
    // stopPropagation so that this does not activate any typeaheads in menus
    // nested above it e.g. md-sub-menu-item
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

  override focus() {
    this.listElement?.focus();
  }

  close() {
    this.open = false;
    this.items.forEach(item => {
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
    return this.listElement?.activateNextItem() as MenuItem ?? null;
  }

  /**
   * Activates the previous item in the menu. If at the start of the menu, the
   * last item will be activated.
   *
   * @return The activated menu item or `null` if there are no items.
   */
  activatePreviousItem() {
    return this.listElement?.activatePreviousItem() as MenuItem ?? null;
  }
}
