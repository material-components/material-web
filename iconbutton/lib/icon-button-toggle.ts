/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Required for @ariaProperty
// tslint:disable:no-new-decorators

import '../../focus/focus-ring.js';
import '../../icon/icon.js';
import '../../ripple/ripple.js';

import {html, nothing, TemplateResult} from 'lit';
import {property} from 'lit/decorators.js';
import {ClassInfo, classMap} from 'lit/directives/class-map.js';
import {when} from 'lit/directives/when.js';

import {ripple} from '../../ripple/directive.js';

import {IconButton} from './icon-button.js';

/**
 * @fires change {Event}
 * Dispatched whenever `selected` is changed via user click
 *
 * @fires input {InputEvent}
 * Dispatched whenever `selected` is changed via user click
 */
export class IconButtonToggle extends IconButton {
  /**
   * The `aria-label` of the button when the toggle button is selected.
   */
  @property({type: String}) ariaLabelSelected!: string;

  /**
   * Sets the selected state. When false, displays the default icon. When true,
   * displays the `selectedIcon`, or the default icon If no `selectedIcon` is
   * provided.
   */
  @property({type: Boolean, reflect: true}) selected = false;

  protected override render(): TemplateResult {
    const hasToggledAriaLabel = this.ariaLabel && this.ariaLabelSelected;
    const ariaPressedValue = hasToggledAriaLabel ? nothing : this.selected;
    const ariaLabelValue = (hasToggledAriaLabel && this.selected) ?
        this.ariaLabelSelected :
        this.ariaLabel;
    return html`<button
          class="md3-icon-button ${classMap(this.getRenderClasses())}"
          aria-pressed="${ariaPressedValue}"
          aria-label="${ariaLabelValue || nothing}"
          ?disabled="${this.disabled}"
          @focus="${this.handleFocus}"
          @blur="${this.handleBlur}"
          @pointerdown="${this.handlePointerDown}"
          @click="${this.handleClick}"
          ${ripple(this.getRipple)}>
        ${this.renderFocusRing()}
        ${when(this.showRipple, this.renderRipple)}
        ${this.renderTouchTarget()}
        ${!this.selected ? this.renderIcon() : nothing}
        ${this.selected ? this.renderSelectedIcon() : nothing}
      </button>`;
  }

  protected renderSelectedIcon() {
    // Use default slot as fallback to not require specifying multiple icons
    return html`<md-icon class="md3-icon-button__icon md3-icon-button__icon--selected"><slot name="selectedIcon"><slot></slot></slot></md-icon>`;
  }

  protected override getRenderClasses(): ClassInfo {
    return {
      ...super.getRenderClasses(),
      'md3-icon-button--selected': this.selected,
    };
  }

  protected handleClick() {
    if (this.disabled) {
      return;
    }

    this.selected = !this.selected;
    this.dispatchEvent(
        new InputEvent('input', {bubbles: true, composed: true}));
    // Bubbles but does not compose to mimic native browser <input> & <select>
    // Additionally, native change event is not an InputEvent.
    this.dispatchEvent(new Event('change', {bubbles: true}));
  }
}
