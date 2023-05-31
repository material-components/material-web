/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../../focus/focus-ring.js';
import '../../../ripple/ripple.js';
import '../../badge/badge.js';

import {html, LitElement, nothing, PropertyValues} from 'lit';
import {property, query} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';

import {ARIAMixinStrict} from '../../../internal/aria/aria.js';
import {requestUpdateOnAriaChange} from '../../../internal/aria/delegate.js';

import {NavigationTabState} from './state.js';

/**
 * TODO(b/265346501): add docs
 */
export class NavigationTab extends LitElement implements NavigationTabState {
  static {
    requestUpdateOnAriaChange(this);
  }

  @property({type: Boolean}) disabled = false;
  @property({type: Boolean, reflect: true}) active = false;
  @property({type: Boolean}) hideInactiveLabel = false;
  @property() label?: string;
  @property() badgeValue = '';
  @property({type: Boolean}) showBadge = false;

  @query('button') buttonElement!: HTMLElement|null;

  protected override render() {
    // Needed for closure conformance
    const {ariaLabel} = this as ARIAMixinStrict;
    return html`
      <button
        class="md3-navigation-tab ${classMap(this.getRenderClasses())}"
        role="tab"
        aria-selected="${this.active}"
        aria-label=${ariaLabel || nothing}
        tabindex="${this.active ? 0 : -1}"
        @click="${this.handleClick}"
      >
        <md-focus-ring inward></md-focus-ring>
        <md-ripple ?disabled="${
        this.disabled}" class="md3-navigation-tab__ripple"></md-ripple>
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

  private getRenderClasses() {
    return {
      'md3-navigation-tab--hide-inactive-label': this.hideInactiveLabel,
      'md3-navigation-tab--active': this.active,
    };
  }

  private renderBadge() {
    return this.showBadge ?
        html`<md-badge .value="${this.badgeValue}"></md-badge>` :
        nothing;
  }

  private renderLabel() {
    // Needed for closure conformance
    const {ariaLabel} = this as ARIAMixinStrict;
    const ariaHidden = ariaLabel ? 'true' : 'false';
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
}
