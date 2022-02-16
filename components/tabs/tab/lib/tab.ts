/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../tab_indicator/tab-indicator';
import '@material/mwc-ripple/mwc-ripple';

import {addHasRemoveClass, BaseElement} from '@material/mwc-base/base-element';
import {observer} from '@material/mwc-base/observer';
import {Ripple} from '@material/mwc-ripple/mwc-ripple';
import {RippleHandlers} from '@material/mwc-ripple/ripple-handlers';
import {html} from 'lit';
import {eventOptions, property, query, queryAsync, state} from 'lit/decorators.js';
import {ClassInfo, classMap} from 'lit/directives/class-map.js';

import {MdTabIndicator} from '../../tab_indicator/tab-indicator';

import {MDCTabAdapter} from './adapter';
import MDCTabFoundation from './foundation';

export interface TabInteractionEventDetail {
  tabId: string;
}

// used for generating unique id for each tab
let tabIdCounter = 0;

export class Tab extends BaseElement {
  static override shadowRootOptions:
      ShadowRootInit = {mode: 'open', delegatesFocus: true};

  protected mdcFoundation!: MDCTabFoundation;

  protected readonly mdcFoundationClass = MDCTabFoundation;

  @query('.md3-tab') protected mdcRoot!: HTMLElement;

  @query('md-tab-indicator') protected tabIndicator!: MdTabIndicator;

  @property() label = '';

  @property() icon = '';

  @property({type: Boolean}) hasImageIcon = false;

  @property({type: Boolean}) isFadingIndicator = false;

  @property({type: Boolean}) minWidth = false;

  @property({type: Boolean}) isMinWidthIndicator = false;

  @property({type: Boolean, reflect: true, attribute: 'active'})
  get active(): boolean {
    return this._active;
  }

  @property() indicatorIcon = '';

  @property({type: Boolean}) stacked = false;

  @observer(async function(this: Tab, value: boolean) {
    await this.updateComplete;
    this.mdcFoundation.setFocusOnActivate(value);
  })
  @property({type: Boolean})
  focusOnActivate = true;

  protected _active = false;

  protected initFocus = false;

  /**
   * Other properties
   * indicatorContent <slot>
   * previousIndicatorClientRect (needed?)
   * onTransitionEnd (needed?)
   */

  @query('.md3-tab__content') protected _contentElement!: HTMLElement;

  @state() protected shouldRenderRipple = false;

  @state() protected useStateLayerCustomProperties = false;

  @queryAsync('mwc-ripple') ripple!: Promise<Ripple|null>;

  protected rippleElement: Ripple|null = null;

  override connectedCallback() {
    this.dir = document.dir;
    super.connectedCallback();
  }

  protected override firstUpdated() {
    super.firstUpdated();
    // create an unique id
    this.id = this.id || `md3-tab-${++tabIdCounter}`;
  }

  protected override render() {
    let iconTemplate = html``;
    if (this.hasImageIcon || this.icon) {
      // NOTE: MUST be on same line as spaces will cause vert alignment issues
      // in IE
      iconTemplate = html`
        <span class="md3-tab__icon material-icons"><slot name="icon">${
          this.icon}</slot></span>`;
    }

    let labelTemplate = html``;
    if (this.label) {
      labelTemplate = html`
        <span class="md3-tab__text-label">${this.label}</span>`;
    }

    return html`
      <button
        @click="${this.handleClick}"
        class="md3-tab ${classMap(this.getRootClasses())}"
        role="tab"
        aria-selected="${this._active}"
        tabindex="${this._active ? 0 : -1}"
        @focus="${this.focus}"
        @blur="${this.handleBlur}"
        @mousedown="${this.handleRippleMouseDown}"
        @mouseenter="${this.handleRippleMouseEnter}"
        @mouseleave="${this.handleRippleMouseLeave}"
        @touchstart="${this.handleRippleTouchStart}"
        @touchend="${this.handleRippleDeactivate}"
        @touchcancel="${this.handleRippleDeactivate}">
        <span class="md3-tab__content">
          ${iconTemplate}
          ${labelTemplate}
          ${this.isMinWidthIndicator ? this.renderIndicator() : ''}
        </span>
        ${this.isMinWidthIndicator ? '' : this.renderIndicator()}
        ${this.renderRipple()}
      </button>`;
  }

  protected getRootClasses(): ClassInfo {
    return {
      'md3-tab--min-width': this.minWidth,
      'md3-tab--stacked': this.stacked,
    };
  }

  protected renderIndicator() {
    return html`<md-tab-indicator
        .icon="${this.indicatorIcon}"
        .fade="${this.isFadingIndicator}"></md-tab-indicator>`;
  }

  // TODO(dfreedm): Make this use selected as a param after Polymer/internal#739
  /** @soyCompatible */
  protected renderRipple() {
    return this.shouldRenderRipple ?
        html`<mwc-ripple primary
        .internalUseStateLayerCustomProperties="${
            this.useStateLayerCustomProperties}"></mwc-ripple>` :
        '';
  }

  protected createAdapter(): MDCTabAdapter {
    return {
      ...addHasRemoveClass(this.mdcRoot),
      activateIndicator: async (previousIndicatorClientRect: ClientRect) => {
        await this.tabIndicator.updateComplete;
        this.tabIndicator.activate(previousIndicatorClientRect);
      },
      deactivateIndicator: async () => {
        await this.tabIndicator.updateComplete;
        this.tabIndicator.deactivate();
      },
      notifyInteracted: () =>
          this.dispatchEvent(new CustomEvent<TabInteractionEventDetail>(
              MDCTabFoundation.strings.INTERACTED_EVENT, {
                detail: {tabId: this.id},
                bubbles: true,
                composed: true,
                cancelable: true,
              })),
      getOffsetLeft: () => this.offsetLeft,
      getOffsetWidth: () => this.mdcRoot.offsetWidth,
      getContentOffsetLeft: () => this._contentElement.offsetLeft,
      getContentOffsetWidth: () => this._contentElement.offsetWidth,
      focus: () => {
        if (this.initFocus) {
          this.initFocus = false;
        } else {
          this.mdcRoot.focus();
        }
      },
    };
  }

  activate(clientRect: ClientRect) {
    // happens only on initialization. We don't want to focus to prevent scroll
    if (!clientRect) {
      this.initFocus = true;
    }

    if (this.mdcFoundation) {
      this.mdcFoundation.activate(clientRect);
      this.setActive(this.mdcFoundation.isActive());
    } else {
      // happens if this is called by tab-bar on initialization, but tab has not
      // finished rendering.
      this.updateComplete.then(() => {
        this.mdcFoundation.activate(clientRect);
        this.setActive(this.mdcFoundation.isActive());
      });
    }
  }

  deactivate() {
    this.mdcFoundation.deactivate();
    this.setActive(this.mdcFoundation.isActive());
  }

  protected setActive(newValue: boolean) {
    const oldValue = this.active;

    if (oldValue !== newValue) {
      this._active = newValue;
      this.requestUpdate('active', oldValue);
    }
  }

  computeDimensions() {
    return this.mdcFoundation.computeDimensions();
  }

  computeIndicatorClientRect() {
    return this.tabIndicator.computeContentClientRect();
  }

  // NOTE: needed only for ShadyDOM where delegatesFocus is not implemented
  override focus() {
    this.mdcRoot.focus();
    this.handleFocus();
  }

  protected rippleHandlers: RippleHandlers = new RippleHandlers(() => {
    this.shouldRenderRipple = true;
    this.ripple.then((v) => this.rippleElement = v);
    return this.ripple;
  });

  protected handleClick() {
    this.handleFocus();
    this.mdcFoundation.handleClick();
  }

  protected handleFocus() {
    this.handleRippleFocus();
  }

  protected handleBlur() {
    this.handleRippleBlur();
  }

  protected handleRippleMouseDown(event: Event) {
    const onUp = () => {
      window.removeEventListener('mouseup', onUp);

      this.handleRippleDeactivate();
    };

    window.addEventListener('mouseup', onUp);
    this.rippleHandlers.startPress(event);
  }

  @eventOptions({passive: true})
  protected handleRippleTouchStart(event: Event) {
    this.rippleHandlers.startPress(event);
  }

  protected handleRippleDeactivate() {
    this.rippleHandlers.endPress();
  }

  protected handleRippleMouseEnter() {
    this.rippleHandlers.startHover();
  }

  protected handleRippleMouseLeave() {
    this.rippleHandlers.endHover();
  }

  protected handleRippleFocus() {
    this.rippleHandlers.startFocus();
  }

  protected handleRippleBlur() {
    this.rippleHandlers.endFocus();
  }

  get isRippleActive() {
    return this.rippleElement?.isActive || false;
  }
}
