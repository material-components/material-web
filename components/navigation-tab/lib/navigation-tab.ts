/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../focus/focus-ring';

import {html, PropertyValues, TemplateResult} from 'lit';
import {property, query, state} from 'lit/decorators';
import {ClassInfo, classMap} from 'lit/directives/class-map';
import {ifDefined} from 'lit/directives/if-defined';

import {ActionElement, BeginPressConfig, EndPressConfig} from '../../action_element/action-element';
import {ariaProperty} from '../../decorators/aria-property';
import {pointerPress, shouldShowStrongFocus} from '../../focus/strong-focus';
import {MdRipple} from '../../ripple/ripple';

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
        <span class="md3-navigation-tab__icon-content"
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
    return html`<md-ripple></md-ripple>`;
  }

  /** @soyTemplate */
  protected renderBadge(): TemplateResult|'' {
    return this.showBadge ? html`<span class="md3-navigation-tab__badge ${
                                classMap(this.getBadgeClasses())}">
        <p class="md3-navigation-tab__badge-value">${this.badgeValue}</p>
        </span>` :
                            '';
  }

  /** @soyTemplate */
  protected getBadgeClasses(): ClassInfo {
    return {
      'md3-navigation-tab__badge-large': this.badgeValue,
    };
  }

  /** @soyTemplate */
  protected renderLabel(): TemplateResult|'' {
    return !this.label ? '' : html`
        <span class="md3-navigation-tab__label-text">${this.label}</span>`;
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
      this.ripple.beginFocus();
      buttonElement.focus();
    }
  }

  override blur() {
    const buttonElement = this.buttonElement;
    if (buttonElement) {
      this.ripple.endFocus();
      buttonElement.blur();
    }
  }

  override beginPress({positionEvent}: BeginPressConfig) {
    this.ripple.beginPress(positionEvent);
  }

  override endPress(options: EndPressConfig) {
    this.ripple.endPress();
    super.endPress(options);
    this.dispatchEvent(new CustomEvent(
        'navigation-tab-interaction',
        {detail: {state: this}, bubbles: true, composed: true}));
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
    this.ripple.beginFocus();
  }

  protected handleBlur() {
    this.ripple.endFocus();
    pointerPress();
  }
}
