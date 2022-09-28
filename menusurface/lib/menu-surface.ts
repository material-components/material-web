/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore

// TODO(b/239222919): remove compat dependencies
import {observer} from '@material/web/compat/base/observer.js';
import {deepActiveElementPath, doesElementContainFocus} from '@material/web/compat/base/utils.js';
import {isRtl} from '@material/web/controller/is-rtl.js';
import {html, LitElement} from 'lit';
import {property, query, state} from 'lit/decorators.js';
import {ClassInfo, classMap} from 'lit/directives/class-map.js';
import {styleMap} from 'lit/directives/style-map.js';

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

  @property({type: Boolean})
  @observer(function(this: MenuSurface, isAbsolute: boolean) {
    if (this.mdcFoundation && !this.fixed) {
      this.mdcFoundation.setIsHoisted(isAbsolute);
    }
  })
  absolute = false;

  @property({type: Boolean}) fullwidth = false;

  @property({type: Boolean})
  @observer(function(this: MenuSurface, isFixed: boolean) {
    if (this.mdcFoundation && !this.absolute) {
      this.mdcFoundation.setFixedPosition(isFixed);
    }
  })
  fixed = false;

  @property({type: Number})
  @observer(function(this: MenuSurface, value: number|null) {
    if (this.mdcFoundation && this.y !== null && value !== null) {
      this.mdcFoundation.setAbsolutePosition(value, this.y);
      this.mdcFoundation.setAnchorMargin(
          {left: value, top: this.y, right: -value, bottom: this.y});
    }
  })
  x: number|null = null;

  @property({type: Number})
  @observer(function(this: MenuSurface, value: number|null) {
    if (this.mdcFoundation && this.x !== null && value !== null) {
      this.mdcFoundation.setAbsolutePosition(this.x, value);
      this.mdcFoundation.setAnchorMargin(
          {left: this.x, top: value, right: -this.x, bottom: value});
    }
  })
  y: number|null = null;

  // must be defined before open or else race condition in foundation occurs.
  @property({type: Boolean})
  @observer(function(this: MenuSurface, value: boolean) {
    if (this.mdcFoundation) {
      this.mdcFoundation.setQuickOpen(value);
    }
  })
  quick = false;

  @property({type: Boolean, reflect: true})
  @observer(function(this: MenuSurface, isOpen: boolean, wasOpen: boolean) {
    if (this.mdcFoundation) {
      if (isOpen) {
        this.mdcFoundation.open();
        // wasOpen helps with first render (when it is `undefined`) perf
      } else if (wasOpen !== undefined) {
        this.mdcFoundation.close(this.skipRestoreFocus);
      }
    }
  })
  open = false;

  @property({type: Boolean}) stayOpenOnBodyClick = false;

  @property({type: Boolean}) skipRestoreFocus = false;

  @state()
  @observer(function(this: MenuSurface, value: CornerEnum) {
    if (this.mdcFoundation) {
      if (value) {
        this.mdcFoundation.setAnchorCorner(value);
      } else {
        this.mdcFoundation.setAnchorCorner(value);
      }
    }
  })
  protected bitwiseCorner: CornerEnum = CornerEnum.TOP_START;

  protected previousFlipMenuHorizontally = false;

  /**
   * Whether to align the menu surface to the opposite side of the default
   * alignment.
   */
  @observer(function(this: MenuSurface, flipMenuHorizontally: boolean) {
    if (!this.mdcFoundation) return;

    if (this.previousFlipMenuHorizontally !== flipMenuHorizontally) {
      this.mdcFoundation.flipCornerHorizontally();
    }
    this.previousFlipMenuHorizontally = flipMenuHorizontally;
  })
  @property({type: Boolean})
  flipMenuHorizontally = false;

  @property({type: String})
  @observer(function(this: MenuSurface, value: Corner) {
    if (this.mdcFoundation) {
      if (value) {
        this.bitwiseCorner = stringToCorner[value];
      }
    }
  })
  corner: Corner = 'BOTTOM_START';

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
        return doesElementContainFocus(this);
      },
      saveFocus: () => {
        const activeElementPath = deepActiveElementPath();
        const pathLength = activeElementPath.length;

        if (!pathLength) {
          this.previouslyFocused = null;
        }

        this.previouslyFocused = activeElementPath[pathLength - 1];
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
