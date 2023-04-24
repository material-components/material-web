/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../badge/badge.js';
import '../../focus/focus-ring.js';
import '../../ripple/ripple.js';

import {html, LitElement, nothing, PropertyValues} from 'lit';
import {property, query, queryAsync, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {ifDefined} from 'lit/directives/if-defined.js';
import {when} from 'lit/directives/when.js';

import {ariaProperty} from '../../decorators/aria-property.js';
import {pointerPress, shouldShowStrongFocus} from '../../focus/strong-focus.js';
import {ripple} from '../../ripple/directive.js';
import {MdRipple} from '../../ripple/ripple.js';

import {NavigationTabState} from './state.js';

/**
 * TODO(b/265346501): add docs
 */
export class NavigationTab extends LitElement implements NavigationTabState {
  @property({type: Boolean}) disabled = false;
  @property({type: Boolean, reflect: true}) active = false;
  @property({type: Boolean}) hideInactiveLabel = false;
  @property() label?: string;
  @property() badgeValue = '';
  @property({type: Boolean}) showBadge = false;

  @state() protected showFocusRing = false;
  @state() protected showRipple = false;

  @ariaProperty  // tslint:disable-line:no-new-decorators
  @property({attribute: 'data-aria-label', noAccessor: true})
  override ariaLabel!: string;

  @query('button') buttonElement!: HTMLElement;

  @queryAsync('md-ripple') ripple!: Promise<MdRipple|null>;

  override render() {
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
        @click="${this.handleClick}"
      ${ripple(this.getRipple)}>${this.renderFocusRing()}${
        when(this.showRipple, this.renderRipple)}
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

  protected getRenderClasses() {
    return {
      'md3-navigation-tab--hide-inactive-label': this.hideInactiveLabel,
      'md3-navigation-tab--active': this.active,
    };
  }

  protected renderFocusRing() {
    return html`<md-focus-ring .visible="${
        this.showFocusRing}"></md-focus-ring>`;
  }

  protected getRipple = () => {
    this.showRipple = true;
    return this.ripple;
  };

  protected renderRipple = () => {
    return html`<md-ripple ?disabled="${
        this.disabled}" class="md3-navigation-tab__ripple"></md-ripple>`;
  };

  protected renderBadge() {
    return this.showBadge ?
        html`<md-badge .value="${this.badgeValue}"></md-badge>` :
        nothing;
  }

  protected renderLabel() {
    const ariaHidden = this.ariaLabel ? 'true' : 'false';
    return !this.label ?
        nothing :
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

  handleClick() {
    // TODO(b/269772145): connect to ripple
    this.dispatchEvent(new CustomEvent(
        'navigation-tab-interaction',
        {detail: {state: this}, bubbles: true, composed: true}));
  }

  handlePointerDown(e: PointerEvent) {
    pointerPress();
    this.showFocusRing = shouldShowStrongFocus();
  }

  protected handleFocus() {
    this.showFocusRing = shouldShowStrongFocus();
  }

  protected handleBlur() {
    this.showFocusRing = false;
  }
}
