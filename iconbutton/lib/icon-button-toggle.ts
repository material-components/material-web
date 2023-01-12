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
 * @fires icon-button-toggle-change {CustomEvent<{selected: boolean}>}
 * Dispatched whenever `selected` is changed via user click
 */
export class IconButtonToggle extends IconButton {
  /**
   * The `aria-label` of the button when the toggle button is selected or "on".
   */
  @property({type: String}) ariaLabelSelected!: string;

  /**
   * Sets the toggle button to the "on" state and displays the `onIcon`. If
   * false, sets the toggle button to the "off" state and displays the
   * `offIcon`.
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
        ${this.renderIcon()}
        ${this.renderSelectedIcon()}
      </button>`;
  }

  protected renderSelectedIcon() {
    return html`<md-icon class="md3-icon-button__icon md3-icon-button__icon--on"><slot name="selectedIcon"></slot></md-icon>`;
  }

  protected override getRenderClasses(): ClassInfo {
    return {
      ...super.getRenderClasses(),
      'md3-icon-button--on': this.selected,
    };
  }

  protected handleClick() {
    this.selected = !this.selected;
    const detail = {selected: this.selected};
    this.dispatchEvent(new CustomEvent(
        'icon-button-toggle-change', {detail, bubbles: true, composed: true}));
  }
}
