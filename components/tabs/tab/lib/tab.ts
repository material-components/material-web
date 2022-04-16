/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 *
 * @requirecss {tabs.tab.lib.shared_styles}
 */


import '../../../focus/focus-ring';
import '../../../icon/icon';

import {addHasRemoveClass, BaseElement} from '@material/mwc-base/base-element';
import {observer} from '@material/mwc-base/observer';
import {html, TemplateResult} from 'lit';
import {eventOptions, property, query, state} from 'lit/decorators';
import {ClassInfo, classMap} from 'lit/directives/class-map';

import {pointerPress, shouldShowStrongFocus} from '../../../focus/strong-focus';
import {MdRipple} from '../../../ripple/ripple';
import {TabIndicator} from '../../tab_indicator/lib/tab-indicator';

import {MDCTabAdapter} from './adapter';
import MDCTabFoundation from './foundation';
import {TabInteractionEvent, TabInteractionEventDetail} from './types';

// used for generating unique id for each tab
let tabIdCounter = 0;

/** @soyCompatible */
export class Tab extends BaseElement {
  static override shadowRootOptions:
      ShadowRootInit = {mode: 'open', delegatesFocus: true};

  protected mdcFoundation!: MDCTabFoundation;

  protected readonly mdcFoundationClass = MDCTabFoundation;

  @query('.md3-tab') protected mdcRoot!: HTMLElement;

  @query('.md3-tab__indicator') protected tabIndicator!: TabIndicator;

  @property() label = '';

  @property() icon = '';

  @property({type: Boolean}) hasImageIcon = false;

  @property({type: Boolean}) isFadingIndicator = false;

  @property({type: Boolean}) minWidth = false;

  @property({type: Boolean}) isMinWidthIndicator = false;

  @property({type: Boolean, reflect: true, attribute: 'active'}) active = false;

  @property() indicatorIcon = '';

  @observer(async function(this: Tab, value: boolean) {
    await this.updateComplete;
    this.mdcFoundation.setFocusOnActivate(value);
  })
  @property({type: Boolean})
  focusOnActivate = true;

  @state() protected showFocusRing = false;

  protected initFocus = false;

  /**
   * Other properties
   * indicatorContent <slot>
   * previousIndicatorClientRect (needed?)
   * onTransitionEnd (needed?)
   */

  @query('.md3-tab__content') protected _contentElement!: HTMLElement;

  @query('md-ripple') ripple!: MdRipple;

  override connectedCallback() {
    this.dir = document.dir;
    super.connectedCallback();
  }

  protected override firstUpdated() {
    super.firstUpdated();
    // create an unique id
    this.id = this.id || `md3-tab-${++tabIdCounter}`;
  }

  /** @soyTemplate */
  protected override render(): TemplateResult {
    const shouldRenderIcon = this.hasImageIcon || this.icon;
    return html`
      <button
        @click="${this.handleClick}"
        class="md3-tab ${classMap(this.getRootClasses())}"
        role="tab"
        aria-selected="${this.active}"
        tabindex="${this.active ? 0 : -1}"
        @focus="${this.focus}"
        @blur="${this.handleBlur}"
        @mousedown="${this.handleRippleMouseDown}"
        @mouseenter="${this.handleRippleMouseEnter}"
        @mouseleave="${this.handleRippleMouseLeave}"
        @touchstart="${this.handleRippleTouchStart}"
        @touchend="${this.handleRippleDeactivate}"
        @touchcancel="${this.handleRippleDeactivate}">
        <span class="md3-tab__content">
          ${shouldRenderIcon ? this.renderIcon(this.icon) : ''}
          ${this.label ? this.renderLabel(this.label) : ''}
          ${
        this.isMinWidthIndicator ?
            this.renderIndicator(this.indicatorIcon, this.isFadingIndicator) :
            ''}
        </span>
        ${
        this.isMinWidthIndicator ?
            '' :
            this.renderIndicator(this.indicatorIcon, this.isFadingIndicator)}
        ${this.renderRipple()}
        ${this.renderFocusRing()}
      </button>`;
  }

  /** @soyTemplate */
  protected getRootClasses(): ClassInfo {
    return {
      'md3-tab--min-width': this.minWidth,
    };
  }

  /** @soyTemplate */
  protected renderIndicator(indicatorIcon: string, isFadingIndicator: boolean):
      TemplateResult {
    return html``;
  }

  /** @soyTemplate */
  protected renderIcon(icon: string): TemplateResult {
    return html`<md-icon class="md3-tab__icon"><slot name="icon">${
        icon}</slot></md-icon>`;
  }

  /** @soyTemplate */
  protected renderLabel(label: string): TemplateResult {
    return html`
        <span class="md3-tab__text-label">${label}</span>`;
  }

  // TODO(dfreedm): Make this use selected as a param after Polymer/internal#739
  /** @soyTemplate */
  protected renderRipple(): TemplateResult {
    return html`<md-ripple></md-ripple>`;
  }

  /** @soyTemplate */
  protected renderFocusRing(): TemplateResult {
    return html`
    <md-focus-ring
      class="md3-tab__focus-ring"
      .visible="${this.showFocusRing}">
    </md-focus-ring>`;
  }

  protected createAdapter(): MDCTabAdapter {
    return {
      ...addHasRemoveClass(this.mdcRoot),
      activateIndicator: async (previousIndicatorClientRect: DOMRect) => {
        await this.tabIndicator.updateComplete;
        this.tabIndicator.activate(previousIndicatorClientRect);
      },
      deactivateIndicator: async () => {
        await this.tabIndicator.updateComplete;
        this.tabIndicator.deactivate();
      },
      notifyInteracted: () => {
        const event: TabInteractionEvent =
            new CustomEvent<TabInteractionEventDetail>('tab-interaction', {
              detail: {tabId: this.id},
              bubbles: true,
              composed: true,
              cancelable: true,
            });
        this.dispatchEvent(event);
      },
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

  activate(clientRect: DOMRect) {
    // happens only on initialization. We don't want to focus to prevent
    // scroll
    if (!clientRect) {
      this.initFocus = true;
    }

    if (this.mdcFoundation) {
      this.mdcFoundation.activate(clientRect);
      this.active = this.mdcFoundation.isActive();
    } else {
      // happens if this is called by tab-bar on initialization, but tab has
      // not finished rendering.
      this.updateComplete.then(() => {
        this.mdcFoundation.activate(clientRect);
        this.active = this.mdcFoundation.isActive();
      });
    }
  }

  deactivate() {
    this.mdcFoundation.deactivate();
    this.active = this.mdcFoundation.isActive();
  }

  computeDimensions() {
    return this.mdcFoundation.computeDimensions();
  }

  computeIndicatorClientRect() {
    return this.tabIndicator.computeContentClientRect();
  }

  override focus() {
    // TODO(b/210731759): Workaround for ShadyDOM where delegatesFocus is not
    // implemented.
    this.mdcRoot.focus();
    this.handleFocus();
  }

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
    this.ripple.beginPress(event);
    pointerPress();
  }

  @eventOptions({passive: true})
  protected handleRippleTouchStart(event: Event) {
    this.ripple.beginPress(event);
  }

  protected handleRippleDeactivate() {
    this.ripple.endPress();
  }

  protected handleRippleMouseEnter() {
    this.ripple.beginHover();
  }

  protected handleRippleMouseLeave() {
    this.ripple.endHover();
  }

  protected handleRippleFocus() {
    this.ripple.beginFocus();
    this.showFocusRing = shouldShowStrongFocus();
  }

  protected handleRippleBlur() {
    this.ripple.endFocus();
    this.showFocusRing = false;
  }
}
