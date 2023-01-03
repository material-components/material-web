/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore

import '../../elevation/elevation.js';

import {html, LitElement, PropertyValues} from 'lit';
import {property, query, state} from 'lit/decorators.js';
import {ClassInfo, classMap} from 'lit/directives/class-map.js';
import {styleMap} from 'lit/directives/style-map.js';

import {isRtl} from '../../controller/is-rtl.js';

import {MDCMenuSurfaceAdapter} from './adapter.js';
import {Corner as CornerEnum} from './constants.js';
import {MDCMenuSurfaceFoundation} from './foundation.js';

export type Corner = keyof typeof CornerEnum;
export type AnchorableElement = HTMLElement&{anchor: Element | null};

// tslint:disable:no-bitwise

// required for closure compiler
const stringToCorner = {
  'TOP_LEFT': CornerEnum.TOP_LEFT,
  'TOP_RIGHT': CornerEnum.TOP_RIGHT,
  'BOTTOM_LEFT': CornerEnum.BOTTOM_LEFT,
  'BOTTOM_RIGHT': CornerEnum.BOTTOM_RIGHT,
  'TOP_START': CornerEnum.TOP_START,
  'TOP_END': CornerEnum.TOP_END,
  'BOTTOM_START': CornerEnum.BOTTOM_START,
  'BOTTOM_END': CornerEnum.BOTTOM_END,
};

/**
 * @fires opened
 * @fires closed
 */
export abstract class MenuSurface extends LitElement {
  protected mdcFoundation!: MDCMenuSurfaceFoundation;

  @query('.md3-menu-surface') mdcRoot!: HTMLDivElement;

  @query('slot') slotElement!: HTMLSlotElement|null;

  @property({type: Boolean}) absolute = false;

  @property({type: Boolean}) fullwidth = false;

  @property({type: Boolean}) fixed = false;

  @property({type: Number}) x: number|null = null;

  @property({type: Number}) y: number|null = null;

  // must be defined before open or else race condition in foundation occurs.
  @property({type: Boolean}) quick = false;

  @property({type: Boolean, reflect: true}) open = false;

  @property({type: Boolean}) stayOpenOnBodyClick = false;

  @property({type: Boolean}) skipRestoreFocus = false;

  protected previousFlipMenuHorizontally = false;

  /**
   * Whether to align the menu surface to the opposite side of the default
   * alignment.
   */
  @property({type: Boolean}) flipMenuHorizontally = false;

  @property({type: String}) corner: Corner = 'BOTTOM_START';

  @state() protected styleTop = '';
  @state() protected styleLeft = '';
  @state() protected styleRight = '';
  @state() protected styleBottom = '';
  @state() protected styleMaxHeight = '';
  @state() protected styleTransformOrigin = '';

  anchor: HTMLElement|null = null;

  protected previouslyFocused: HTMLElement|Element|null = null;
  protected previousAnchor: HTMLElement|null = null;
  protected onBodyClickBound: (evt: MouseEvent) => void = () => undefined;

  override render() {
    const styles = {
      'top': this.styleTop,
      'left': this.styleLeft,
      'right': this.styleRight,
      'bottom': this.styleBottom,
      'max-height': this.styleMaxHeight,
      'transform-origin': this.styleTransformOrigin,
    };

    return html`
      <div
          class="md3-menu-surface ${classMap(this.getRenderClasses())}"
          style="${styleMap(styles)}"
          @keydown=${this.onKeydown}
          @opened=${this.registerBodyClick}
          @closed=${this.deregisterBodyClick}>
        <md-elevation shadow></md-elevation>
        <slot></slot>
      </div>`;
  }

  /** @soyTemplate */
  protected getRenderClasses(): ClassInfo {
    return {
      'md3-menu-surface--fixed': this.fixed,
      'md3-menu-surface--fullwidth': this.fullwidth,
    };
  }

  protected override updated(changedProperties: PropertyValues<MenuSurface>) {
    if (changedProperties.has('absolute') && !this.fixed) {
      this.mdcFoundation.setIsHoisted(this.absolute);
    }

    if (changedProperties.has('fixed') && !this.absolute) {
      this.mdcFoundation.setFixedPosition(this.fixed);
    }

    if ((changedProperties.has('x') || changedProperties.has('y')) &&
        this.x !== null && this.y !== null) {
      this.mdcFoundation.setAbsolutePosition(this.x, this.y);
      this.mdcFoundation.setAnchorMargin(
          {left: this.x, top: this.y, right: -this.y, bottom: this.y});
    }

    if (changedProperties.has('quick')) {
      this.mdcFoundation.setQuickOpen(this.quick);
    }

    if (changedProperties.has('open')) {
      const wasOpen = changedProperties.get('open');
      if (this.open) {
        this.mdcFoundation.open();
        // wasOpen helps with first render (when it is `undefined`) perf
      } else if (wasOpen !== undefined) {
        this.mdcFoundation.close(this.skipRestoreFocus);
      }
    }

    if (changedProperties.has('flipMenuHorizontally')) {
      if (this.previousFlipMenuHorizontally !== this.flipMenuHorizontally) {
        this.mdcFoundation.flipCornerHorizontally();
      }
      this.previousFlipMenuHorizontally = this.flipMenuHorizontally;
    }

    if (changedProperties.has('corner') && this.corner) {
      const bitwiseCorner = stringToCorner[this.corner];
      this.mdcFoundation.setAnchorCorner(bitwiseCorner);
    }
  }

  protected override firstUpdated() {
    if (this.mdcFoundation !== undefined) {
      this.mdcFoundation.destroy();
    }

    this.mdcFoundation = new MDCMenuSurfaceFoundation(this.createAdapter());
    this.mdcFoundation.init();
  }

  createAdapter(): MDCMenuSurfaceAdapter {
    return {
      addClass: (className: string) => {
        this.mdcRoot.classList.add(className);
      },
      removeClass: (className: string) => {
        this.mdcRoot.classList.remove(className);
      },
      hasClass: (className: string) =>
          this.mdcRoot.classList.contains(className),
      hasAnchor: () => {
        return !!this.anchor;
      },
      notifyClose: () => {
        const init: CustomEventInit = {bubbles: true, composed: true};
        const ev = new CustomEvent('closed', init);
        this.open = false;
        this.mdcRoot.dispatchEvent(ev);
      },
      notifyClosing: () => {
        const init: CustomEventInit = {bubbles: true, composed: true};
        const ev = new CustomEvent('closing', init);
        this.mdcRoot.dispatchEvent(ev);
      },
      notifyOpen: () => {
        const init: CustomEventInit = {bubbles: true, composed: true};
        const ev = new CustomEvent('opened', init);
        this.open = true;
        this.mdcRoot.dispatchEvent(ev);
      },
      notifyOpening: () => {
        const init: CustomEventInit = {bubbles: true, composed: true};
        const ev = new CustomEvent('opening', init);
        this.mdcRoot.dispatchEvent(ev);
      },
      isElementInContainer: () => false,
      isRtl: () => this.mdcRoot ? isRtl(this.mdcRoot) : false,
      setTransformOrigin: (origin) => {
        const root = this.mdcRoot;
        if (!root) {
          return;
        }

        this.styleTransformOrigin = origin;
      },
      isFocused: () => {
        return this.matches(':focus-within');
      },
      saveFocus: () => {
        this.previouslyFocused = document.activeElement;
      },
      restoreFocus: () => {
        if (!this.previouslyFocused) {
          return;
        }

        if ('focus' in this.previouslyFocused) {
          this.previouslyFocused.focus();
        }
      },
      getInnerDimensions: () => {
        const mdcRoot = this.mdcRoot;

        if (!mdcRoot) {
          return {width: 0, height: 0};
        }

        return {width: mdcRoot.offsetWidth, height: mdcRoot.offsetHeight};
      },
      getAnchorDimensions: () => {
        const anchorElement = this.anchor;

        return anchorElement ? anchorElement.getBoundingClientRect() : null;
      },
      getBodyDimensions: () => {
        return {
          width: document.body.clientWidth,
          height: document.body.clientHeight,
        };
      },
      getWindowDimensions: () => {
        return {
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      getWindowScroll: () => {
        return {
          x: window.pageXOffset,
          y: window.pageYOffset,
        };
      },
      setPosition: (position) => {
        const mdcRoot = this.mdcRoot;

        if (!mdcRoot) {
          return;
        }

        this.styleLeft = 'left' in position ? `${position.left}px` : '';
        this.styleRight = 'right' in position ? `${position.right}px` : '';
        this.styleTop = 'top' in position ? `${position.top}px` : '';
        this.styleBottom = 'bottom' in position ? `${position.bottom}px` : '';
      },
      setMaxHeight: async (height) => {
        const mdcRoot = this.mdcRoot;

        if (!mdcRoot) {
          return;
        }

        // must set both for IE support as IE will not set a var
        this.styleMaxHeight = height;
        await this.updateComplete;
        this.styleMaxHeight = `var(--md3-menu-max-height, ${height})`;
      },
    };
  }

  protected onKeydown(evt: KeyboardEvent) {
    if (this.mdcFoundation) {
      this.mdcFoundation.handleKeydown(evt);
    }
  }

  protected onBodyClick(evt: MouseEvent) {
    if (this.stayOpenOnBodyClick) {
      return;
    }
    const path = evt.composedPath();
    if (path.indexOf(this) === -1) {
      this.close();
    }
  }

  protected registerBodyClick() {
    this.onBodyClickBound = this.onBodyClick.bind(this);
    // capture otherwise listener closes menu after quick menu opens
    document.body.addEventListener(
        'click', this.onBodyClickBound, {passive: true, capture: true});
  }

  protected deregisterBodyClick() {
    document.body.removeEventListener(
        'click', this.onBodyClickBound, {capture: true});
  }

  close() {
    this.open = false;
  }

  show() {
    this.open = true;
  }
}
