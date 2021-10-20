/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../ripple/mwc-ripple';

import {ariaProperty} from '@material/mwc-base/aria-property';
import {BaseElement} from '@material/mwc-base/base-element';
import {html, TemplateResult} from 'lit';
import {eventOptions, property, query, queryAsync, state} from 'lit/decorators';
import {ClassInfo, classMap} from 'lit/directives/class-map';
import {ifDefined} from 'lit/directives/if-defined';

import {Ripple} from '../../ripple/mwc-ripple';
import {RippleHandlers} from '../../ripple/ripple-handlers';

import {MDCNavigationTabFoundation} from './foundation';
import {MDCNavigationTabAdapter, MDCNavigationTabState} from './state';

/** @soyCompatible */
export class NavigationTab extends BaseElement implements
    MDCNavigationTabState {
  // MDCNavigationTabState
  @property({type: Boolean, reflect: true}) active = false;
  @property({type: Boolean}) hideInactiveLabel = false;
  @property({type: String}) label?: string;
  @property({type: String}) badgeValue = '';
  @property({type: Boolean}) showBadge = false;

  @queryAsync('md-ripple') ripple!: Promise<Ripple|null>;

  @state() protected shouldRenderRipple = false;
  protected rippleHandlers = new RippleHandlers(() => {
    this.shouldRenderRipple = true;
    return this.ripple;
  });

  /** @soyPrefixAttribute */  // tslint:disable-next-line:no-new-decorators
  @ariaProperty @property({attribute: 'aria-label'}) ariaLabel?: string;

  // BaseElement
  @query('.mdc-navigation-tab') protected mdcRoot!: HTMLElement;
  getRoot(): HTMLElement {
    return this.mdcRoot;
  }
  protected readonly mdcFoundationClass = MDCNavigationTabFoundation;
  protected mdcFoundation!: MDCNavigationTabFoundation;

  /** @soyTemplate */
  override render(): TemplateResult {
    return html`
      <button
        class="mdc-navigation-tab ${classMap(this.getRenderClasses())}"
        role="tab"
        aria-selected="${this.active}"
        aria-label="${ifDefined(this.ariaLabel)}"
        tabindex="${this.active ? 0 : -1}"
        @click="${this.handleClick}"
        @focus="${this.handleRippleFocus}"
        @blur="${this.handleRippleBlur}"
        @mousedown="${this.handleRippleMouseDown}"
        @mouseenter="${this.handleRippleMouseEnter}"
        @mouseleave="${this.handleRippleMouseLeave}"
        @touchstart="${this.handleRippleTouchStart}"
        @touchend="${this.handleRippleTouchEnd}"
        @touchcancel="${this.handleRippleTouchEnd}"
      >${this.renderRipple()}
        <span class="mdc-navigation-tab__icon-content"
          ><span class="mdc-navigation-tab__active-indicator"
            ></span><span class="mdc-navigation-tab__icon"
          ><slot name="inactiveIcon"></slot
        ></span>
        <span class="mdc-navigation-tab__icon mdc-navigation-tab__icon--active"
          ><slot name="activeIcon"></slot
        ></span>${this.renderBadge()}</span
        >${this.renderLabel()}
      </button>`;
  }

  /** @soyTemplate */
  protected getRenderClasses(): ClassInfo {
    return {
      'mdc-navigation-tab--hide-inactive-label': this.hideInactiveLabel,
      'mdc-navigation-tab--active': this.active,
    };
  }

  /** @soyTemplate */
  protected renderRipple(): TemplateResult|string {
    return this.shouldRenderRipple ? this.renderRippleTemplate() : '';
  }

  /** @soyTemplate */
  protected renderRippleTemplate(): TemplateResult {
    return html`<md-ripple></md-ripple>`;
  }

  /** @soyTemplate */
  protected renderBadge(): TemplateResult|'' {
    return this.showBadge ? html`<span class="mdc-navigation-tab__badge ${
                                classMap(this.getBadgeClasses())}">
        <p class="mdc-navigation-tab__badge-value">${this.badgeValue}</p>
        </span>` :
                            '';
  }

  /** @soyTemplate */
  protected getBadgeClasses(): ClassInfo {
    return {
      'mdc-navigation-tab__badge-large': this.badgeValue,
    };
  }

  /** @soyTemplate */
  protected renderLabel(): TemplateResult|'' {
    return !this.label ? '' : html`
        <span class="mdc-navigation-tab__label-text">${this.label}</span>`;
  }

  override firstUpdated() {
    super.firstUpdated();
    const event =
        new Event('navigation-tab-rendered', {bubbles: true, composed: true});
    this.dispatchEvent(event);
  }

  protected createAdapter(): MDCNavigationTabAdapter {
    return {
      state: this,
      emitInteractionEvent: (eventDetail) => this.dispatchEvent(new CustomEvent(
          'navigation-tab-interaction',
          {detail: {state: eventDetail}, bubbles: true, composed: true})),
    };
  }

  override focus() {
    this.mdcRoot.focus();
    this.handleRippleFocus();
  }

  protected handleClick() {
    this.mdcFoundation.handleClick();
  }

  protected handleRippleFocus() {
    this.rippleHandlers.startFocus();
  }

  protected handleRippleBlur() {
    this.rippleHandlers.endFocus();
  }

  @eventOptions({passive: true})
  protected handleRippleMouseDown(event: Event) {
    const onUp = () => {
      window.removeEventListener('mouseup', onUp);

      this.rippleHandlers.endPress();
    };

    window.addEventListener('mouseup', onUp);
    this.rippleHandlers.startPress(event);
  }

  protected handleRippleMouseEnter() {
    this.rippleHandlers.startHover();
  }

  protected handleRippleMouseLeave() {
    this.rippleHandlers.endHover();
  }

  @eventOptions({passive: true})
  protected handleRippleTouchStart(event: Event) {
    this.rippleHandlers.startPress(event);
  }

  protected handleRippleTouchEnd() {
    this.rippleHandlers.endPress();
  }
}
