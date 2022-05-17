/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/badge/badge';
import '@material/web/focus/focus-ring';

import {ActionElement, PressBeginEvent, PressEndEvent} from '@material/web/actionelement/action-element';
import {ariaProperty} from '@material/web/decorators/aria-property';
import {pointerPress, shouldShowStrongFocus} from '@material/web/focus/strong-focus';
import {MdRipple} from '@material/web/ripple/ripple';
import {html, PropertyValues, TemplateResult} from 'lit';
import {property, query, state} from 'lit/decorators';
import {ClassInfo, classMap} from 'lit/directives/class-map';
import {ifDefined} from 'lit/directives/if-defined';

import {NavigationTabState} from './state';

/** @soyCompatible */
export class NavigationTab extends ActionElement implements NavigationTabState {
  disabled = false;
  @property({type: Boolean, reflect: true}) active = false;
  @property({type: Boolean}) hideInactiveLabel = false;
  @property({type: String}) label?: string;
  @property({type: String}) badgeValue = '';
  @property({type: Boolean}) showBadge = false;

  @state() protected showFocusRing = false;

  // TODO(b/210730484): replace with @soyParam annotation
  // tslint:disable-next-line:no-new-decorators
  @ariaProperty
  @property({type: String, attribute: 'data-aria-label', noAccessor: true})
  override ariaLabel!: string;

  @query('button') buttonElement!: HTMLElement;

  @query('md-ripple') ripple!: MdRipple;

  constructor() {
    super();
    this.addEventListener('pressbegin', this.handlePressBegin);
    this.addEventListener('pressend', this.handlePressEnd);
  }

  /** @soyTemplate */
  override render(): TemplateResult {
    return html`
      <button
        class="md3-navigation-tab ${classMap(this.getRenderClasses())}"
        role="tab"
        aria-selected="${this.active}"
        aria-label="${ifDefined(this.ariaLabel)}"
        tabindex="${this.active ? 0 : -1}"
        @focus="${this.handleFocus}"
        @blur="${this.handleBlur}"
        @pointerdown="${this.handlePointerDown}"
        @pointerup="${this.handlePointerUp}"
        @pointercancel="${this.handlePointerCancel}"
        @pointerleave="${this.handlePointerLeave}"
        @pointerenter="${this.handlePointerEnter}"
        @click="${this.handleClick}"
        @clickmod="${this.handleClick}"
        @contextmenu="${this.handleContextMenu}"
      >${this.renderFocusRing()}${this.renderRipple()}
        <span aria-hidden="true" class="md3-navigation-tab__icon-content"
          ><span class="md3-navigation-tab__active-indicator"
            ></span><span class="md3-navigation-tab__icon"
          ><slot name="inactiveIcon"></slot
        ></span>
        <span class="md3-navigation-tab__icon md3-navigation-tab__icon--active"
          ><slot name="activeIcon"></slot
        ></span>${this.renderBadge()}</span
        >${this.renderLabel()}
      </button>`;
  }

  /** @soyTemplate */
  protected getRenderClasses(): ClassInfo {
    return {
      'md3-navigation-tab--hide-inactive-label': this.hideInactiveLabel,
      'md3-navigation-tab--active': this.active,
    };
  }

  /** @soyTemplate */
  protected renderFocusRing(): TemplateResult {
    return html`<md-focus-ring .visible="${
        this.showFocusRing}"></md-focus-ring>`;
  }

  /** @soyTemplate */
  protected renderRipple(): TemplateResult|string {
    return html`<md-ripple class="md3-navigation-tab__ripple"></md-ripple>`;
  }

  /** @soyTemplate */
  protected renderBadge(): TemplateResult|'' {
    return this.showBadge ?
        html`<md-badge .value="${this.badgeValue}"></md-badge>` :
        '';
  }

  /** @soyTemplate */
  protected renderLabel(): TemplateResult|'' {
    const ariaHidden = this.ariaLabel ? 'true' : 'false';
    return !this.label ?
        '' :
        html`
         <span aria-hidden="${
            ariaHidden}" class="md3-navigation-tab__label-text">${
            this.label}</span>`;
  }

  override firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    const event =
        new Event('navigation-tab-rendered', {bubbles: true, composed: true});
    this.dispatchEvent(event);
  }

  override focus() {
    const buttonElement = this.buttonElement;
    if (buttonElement) {
      buttonElement.focus();
    }
  }

  override blur() {
    const buttonElement = this.buttonElement;
    if (buttonElement) {
      buttonElement.blur();
    }
  }

  // protected handlePressBegin(event: PressBeginEvent) {
  protected handlePressBegin(event: CustomEvent) {
    this.ripple.beginPress(event.detail.positionEvent);
  }

  // protected handlePressEnd(event: PressEndEvent) {
  protected handlePressEnd(event: CustomEvent) {
    this.ripple.endPress();
    if (!event.detail.cancelled) {
      this.dispatchEvent(new CustomEvent(
          'navigation-tab-interaction',
          {detail: {state: this}, bubbles: true, composed: true}));
    }
  }

  override handlePointerDown(e: PointerEvent) {
    super.handlePointerDown(e);
    pointerPress();
    this.showFocusRing = shouldShowStrongFocus();
  }

  override handlePointerUp(e: PointerEvent) {
    super.handlePointerUp(e);
  }

  protected handlePointerEnter(e: PointerEvent) {
    this.ripple.beginHover(e);
  }

  override handlePointerLeave(e: PointerEvent) {
    super.handlePointerLeave(e);
    this.ripple.endHover();
  }

  protected handleFocus() {
    this.showFocusRing = shouldShowStrongFocus();
  }

  protected handleBlur() {
    this.showFocusRing = false;
  }
}
