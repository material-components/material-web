/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../../focus/md-focus-ring.js';
import '../../../ripple/ripple.js';

import {html, LitElement, nothing, PropertyValues, TemplateResult} from 'lit';
import {property, queryAssignedElements, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';

import {ARIAMixinStrict} from '../../../internal/aria/aria.js';
import {requestUpdateOnAriaChange} from '../../../internal/aria/delegate.js';

/**
 * SegmentedButton is a web component implementation of the Material Design
 * segmented button component. It is intended **only** for use as a child of a
 * `SementedButtonSet` component. It is **not** intended for use in any other
 * context.
 *
 * @fires segmented-button-interaction {Event} Dispatched whenever a button is
 * clicked. --bubbles --composed
 */
export class SegmentedButton extends LitElement {
  static {
    requestUpdateOnAriaChange(SegmentedButton);
  }

  @property({type: Boolean}) disabled = false;
  @property({type: Boolean}) selected = false;
  @property() label = '';
  @property({type: Boolean, attribute: 'no-checkmark'}) noCheckmark = false;
  @property({type: Boolean, attribute: 'has-icon'}) hasIcon = false;

  @state() private animState = '';
  @queryAssignedElements({slot: 'icon', flatten: true})
  private readonly iconElement!: HTMLElement[];

  protected override update(props: PropertyValues<SegmentedButton>) {
    this.animState = this.nextAnimationState(props);
    super.update(props);
    // NOTE: This needs to be set *after* calling super.update() to ensure the
    // appropriate CSS classes are applied.
    this.hasIcon = this.iconElement.length > 0;
  }

  private nextAnimationState(
    changedProps: PropertyValues<SegmentedButton>,
  ): string {
    const prevSelected = changedProps.get('selected');
    // Early exit for first update.
    if (prevSelected === undefined) return '';

    const nextSelected = this.selected;
    const nextHasCheckmark = !this.noCheckmark;
    if (!prevSelected && nextSelected && nextHasCheckmark) {
      return 'selecting';
    }
    if (prevSelected && !nextSelected && nextHasCheckmark) {
      return 'deselecting';
    }
    return '';
  }

  private handleClick() {
    const event = new Event('segmented-button-interaction', {
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  protected override render() {
    // Needed for closure conformance
    const {ariaLabel} = this as ARIAMixinStrict;
    return html`
      <button
        tabindex="${this.disabled ? '-1' : '0'}"
        aria-label=${ariaLabel || nothing}
        aria-pressed=${this.selected}
        ?disabled=${this.disabled}
        @click="${this.handleClick}"
        class="md3-segmented-button ${classMap(this.getRenderClasses())}">
        <md-focus-ring
          class="md3-segmented-button__focus-ring"
          part="focus-ring"></md-focus-ring>
        <md-ripple
          ?disabled="${this.disabled}"
          class="md3-segmented-button__ripple"></md-ripple>
        ${this.renderOutline()} ${this.renderLeading()} ${this.renderLabel()}
        ${this.renderTouchTarget()}
      </button>
    `;
  }

  protected getRenderClasses() {
    return {
      'md3-segmented-button--selected': this.selected,
      'md3-segmented-button--unselected': !this.selected,
      'md3-segmented-button--with-label': this.label !== '',
      'md3-segmented-button--without-label': this.label === '',
      'md3-segmented-button--with-icon': this.hasIcon,
      'md3-segmented-button--with-checkmark': !this.noCheckmark,
      'md3-segmented-button--without-checkmark': this.noCheckmark,
      'md3-segmented-button--selecting': this.animState === 'selecting',
      'md3-segmented-button--deselecting': this.animState === 'deselecting',
    };
  }

  protected renderOutline(): TemplateResult | typeof nothing {
    return nothing;
  }

  private renderLeading() {
    return this.label === ''
      ? this.renderLeadingWithoutLabel()
      : this.renderLeadingWithLabel();
  }

  private renderLeadingWithoutLabel() {
    return html`
      <span class="md3-segmented-button__leading" aria-hidden="true">
        <span class="md3-segmented-button__graphic">
          <svg class="md3-segmented-button__checkmark" viewBox="0 0 24 24">
            <path
              class="md3-segmented-button__checkmark-path"
              fill="none"
              d="M1.73,12.91 8.1,19.28 22.79,4.59"></path>
          </svg>
        </span>
        <span class="md3-segmented-button__icon" aria-hidden="true">
          <slot name="icon"></slot>
        </span>
      </span>
    `;
  }

  private renderLeadingWithLabel() {
    return html`
      <span class="md3-segmented-button__leading" aria-hidden="true">
        <span class="md3-segmented-button__graphic">
          <svg class="md3-segmented-button__checkmark" viewBox="0 0 24 24">
            <path
              class="md3-segmented-button__checkmark-path"
              fill="none"
              d="M1.73,12.91 8.1,19.28 22.79,4.59"></path>
          </svg>
          <span class="md3-segmented-button__icon" aria-hidden="true">
            <slot name="icon"></slot>
          </span>
        </span>
      </span>
    `;
  }

  private renderLabel() {
    return html`
      <span class="md3-segmented-button__label-text">${this.label}</span>
    `;
  }

  private renderTouchTarget() {
    return html`<span class="md3-segmented-button__touch"></span>`;
  }
}
