/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {MDCMenuSurfaceAdapter} from '@material/menu-surface/adapter';
import {Corner as CornerEnum, CornerBit} from '@material/menu-surface/constants';
import MDCMenuSurfaceFoundation from '@material/menu-surface/foundation';
import {addHasRemoveClass, BaseElement} from '@material/mwc-base/base-element';
import {observer} from '@material/mwc-base/observer';
import {deepActiveElementPath, doesElementContainFocus} from '@material/mwc-base/utils';
import {html, internalProperty, property, query} from 'lit-element';
import {classMap} from 'lit-html/directives/class-map';
import {styleMap} from 'lit-html/directives/style-map';

export type Corner = keyof typeof CornerEnum;
export type AnchorableElement = HTMLElement&{anchor: Element | null};
export type MenuCorner = 'START'|'END';

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
export abstract class MenuSurfaceBase extends BaseElement {
  protected mdcFoundation!: MDCMenuSurfaceFoundation;

  protected readonly mdcFoundationClass = MDCMenuSurfaceFoundation;

  @query('.mdc-menu-surface') mdcRoot!: HTMLDivElement;

  @query('slot') slotElement!: HTMLSlotElement|null;

  @property({type: Boolean})
  @observer(function(this: MenuSurfaceBase, isAbsolute: boolean) {
    if (this.mdcFoundation && !this.fixed) {
      this.mdcFoundation.setIsHoisted(isAbsolute);
    }
  })
  absolute = false;

  @property({type: Boolean}) fullwidth = false;

  @property({type: Boolean})
  @observer(function(this: MenuSurfaceBase, isFixed: boolean) {
    if (this.mdcFoundation && !this.absolute) {
      this.mdcFoundation.setIsHoisted(isFixed);
    }
  })
  fixed = false;

  @property({type: Number})
  @observer(function(this: MenuSurfaceBase, value: number|null) {
    if (this.mdcFoundation && this.y !== null && value !== null) {
      this.mdcFoundation.setAbsolutePosition(value, this.y);
      this.mdcFoundation.setAnchorMargin(
          {left: value, top: this.y, right: -value, bottom: this.y});
    }
  })
  x: number|null = null;

  @property({type: Number})
  @observer(function(this: MenuSurfaceBase, value: number|null) {
    if (this.mdcFoundation && this.x !== null && value !== null) {
      this.mdcFoundation.setAbsolutePosition(this.x, value);
      this.mdcFoundation.setAnchorMargin(
          {left: this.x, top: value, right: -this.x, bottom: value});
    }
  })
  y: number|null = null;

  // must be defined before open or else race condition in foundation occurs.
  @property({type: Boolean})
  @observer(function(this: MenuSurfaceBase, value: boolean) {
    if (this.mdcFoundation) {
      this.mdcFoundation.setQuickOpen(value);
    }
  })
  quick = false;

  @property({type: Boolean, reflect: true})
  @observer(function(this: MenuSurfaceBase, isOpen: boolean, wasOpen: boolean) {
    if (this.mdcFoundation) {
      if (isOpen) {
        this.mdcFoundation.open();
        // wasOpen helps with first render (when it is `undefined`) perf
      } else if (wasOpen !== undefined) {
        this.mdcFoundation.close();
      }
    }
  })
  open = false;

  @internalProperty()
  @observer(function(this: MenuSurfaceBase, value: CornerEnum) {
    if (this.mdcFoundation) {
      if (value) {
        this.mdcFoundation.setAnchorCorner(value);
      } else {
        this.mdcFoundation.setAnchorCorner(value);
      }
    }
  })

  protected bitwiseCorner: CornerEnum = CornerEnum.TOP_START;
  protected previousMenuCorner: MenuCorner|null = null;

  // must be defined before observer of anchor corner for initialization
  @property({type: String})
  @observer(function(this: MenuSurfaceBase, value: MenuCorner) {
    if (this.mdcFoundation) {
      const isValidValue = value === 'START' || value === 'END';
      const isFirstTimeSet = this.previousMenuCorner === null;
      const cornerChanged =
          !isFirstTimeSet && value !== this.previousMenuCorner;
      const initiallySetToEnd = isFirstTimeSet && value === 'END';

      if (isValidValue && (cornerChanged || initiallySetToEnd)) {
        this.bitwiseCorner = this.bitwiseCorner ^ CornerBit.RIGHT;
        this.mdcFoundation.flipCornerHorizontally();
        this.previousMenuCorner = value;
      }
    }
  })
  menuCorner: MenuCorner = 'START';

  @property({type: String})
  @observer(function(this: MenuSurfaceBase, value: Corner) {
    if (this.mdcFoundation) {
      if (value) {
        let newCorner = stringToCorner[value];
        if (this.menuCorner === 'END') {
          newCorner = newCorner ^ CornerBit.RIGHT;
        }

        this.bitwiseCorner = newCorner;
      }
    }
  })
  corner: Corner = 'TOP_START';

  @internalProperty() protected styleTop = '';
  @internalProperty() protected styleLeft = '';
  @internalProperty() protected styleRight = '';
  @internalProperty() protected styleBottom = '';
  @internalProperty() protected styleMaxHeight = '';
  @internalProperty() protected styleTransformOrigin = '';

  anchor: HTMLElement|null = null;

  protected previouslyFocused: HTMLElement|Element|null = null;
  protected previousAnchor: HTMLElement|null = null;
  protected onBodyClickBound: (evt: MouseEvent) => void = () => undefined;

  render() {
    const classes = {
      'mdc-menu-surface--fixed': this.fixed,
      'mdc-menu-surface--fullwidth': this.fullwidth,
    };

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
          class="mdc-menu-surface ${classMap(classes)}"
          style="${styleMap(styles)}"
          @keydown=${this.onKeydown}
          @opened=${this.registerBodyClick}
          @closed=${this.deregisterBodyClick}>
        <slot></slot>
      </div>`;
  }

  createAdapter(): MDCMenuSurfaceAdapter {
    return {
      ...addHasRemoveClass(this.mdcRoot),
      hasAnchor: () => {
        return !!this.anchor;
      },
      notifyClose: () => {
        const init: CustomEventInit = {bubbles: true, composed: true};
        const ev = new CustomEvent('closed', init);
        this.open = false;
        this.mdcRoot.dispatchEvent(ev);
      },
      notifyOpen: () => {
        const init: CustomEventInit = {bubbles: true, composed: true};
        const ev = new CustomEvent('opened', init);
        this.open = true;
        this.mdcRoot.dispatchEvent(ev);
      },
      isElementInContainer: () => false,
      isRtl: () => {
        if (this.mdcRoot) {
          return getComputedStyle(this.mdcRoot).direction === 'rtl';
        }

        return false;
      },
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
        this.styleMaxHeight = `var(--mdc-menu-max-height, ${height})`;
      },
    };
  }

  protected onKeydown(evt: KeyboardEvent) {
    if (this.mdcFoundation) {
      this.mdcFoundation.handleKeydown(evt);
    }
  }

  protected onBodyClick(evt: MouseEvent) {
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
    document.body.removeEventListener('click', this.onBodyClickBound);
  }

  close() {
    this.open = false;
  }

  show() {
    this.open = true;
  }
}
