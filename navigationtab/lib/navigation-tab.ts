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
import {when} from 'lit/directives/when.js';

import {ARIAMixinStrict} from '../../aria/aria.js';
import {requestUpdateOnAriaChange} from '../../aria/delegate.js';
import {ripple} from '../../ripple/directive.js';
import {MdRipple} from '../../ripple/ripple.js';

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

  @state() private showRipple = false;

  @query('button') buttonElement!: HTMLElement|null;

  @queryAsync('md-ripple') ripple!: Promise<MdRipple|null>;

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
        ${ripple(this.getRipple)}
      >
        <md-focus-ring inward></md-focus-ring>
        ${when(this.showRipple, this.renderRipple)}
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

  private readonly getRipple = () => {
    this.showRipple = true;
    return this.ripple;
  };

  private readonly renderRipple = () => {
    return html`<md-ripple ?disabled="${
        this.disabled}" class="md3-navigation-tab__ripple"></md-ripple>`;
  };

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
