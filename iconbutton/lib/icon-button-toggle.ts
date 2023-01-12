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

import {html, LitElement, nothing, TemplateResult} from 'lit';
import {property, queryAsync, state} from 'lit/decorators.js';
import {ClassInfo, classMap} from 'lit/directives/class-map.js';
import {when} from 'lit/directives/when.js';

import {ariaProperty} from '../../decorators/aria-property.js';
import {pointerPress, shouldShowStrongFocus} from '../../focus/strong-focus.js';
import {ripple} from '../../ripple/directive.js';
import {MdRipple} from '../../ripple/ripple.js';

/**
 * @fires icon-button-toggle-change {CustomEvent<{selected: boolean}>}
 * Dispatched whenever `selected` is changed via user click
 */
export class IconButtonToggle extends LitElement {
  @ariaProperty
  @property({type: String, attribute: 'data-aria-label'})
  override ariaLabel!: string;

  /**
   * Disables the icon button and makes it non-interactive.
   */
  @property({type: Boolean, reflect: true}) disabled = false;

  /**
   * The `aria-label` of the button when the toggle button is selected or "on".
   */
  @property({type: String}) ariaLabelOn!: string;

  /**
   * The `aria-label` of the button when the toggle button is not selected or
   * "off".
   */
  @property({type: String}) ariaLabelOff!: string;

  /**
   * Sets the toggle button to the "on" state and displays the `onIcon`. If
   * false, sets the toggle button to the "off" state and displays the
   * `offIcon`.
   */
  @property({type: Boolean, reflect: true}) selected = false;

  @queryAsync('md-ripple') ripple!: Promise<MdRipple|null>;

  @state() protected showFocusRing = false;

  @state() protected showRipple = false;

  protected readonly getRipple = () => {
    this.showRipple = true;
    return this.ripple;
  };

  protected readonly renderRipple = () => {
    return html`<md-ripple ?disabled="${this.disabled}"></md-ripple>`;
  };

  protected override render(): TemplateResult {
    const hasToggledAriaLabel = this.ariaLabelOn && this.ariaLabelOff;
    const ariaPressedValue = hasToggledAriaLabel ? nothing : this.selected;
    const ariaLabelValue = hasToggledAriaLabel ?
        (this.selected ? this.ariaLabelOn : this.ariaLabelOff) :
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
        <md-icon class="md3-icon-button__icon">
          <slot name="offIcon"></slot>
        </md-icon>
        <md-icon class="md3-icon-button__icon md3-icon-button__icon--on">
          <slot name="onIcon"></slot>
        </md-icon>
      </button>`;
  }

  protected getRenderClasses(): ClassInfo {
    return {
      'md3-icon-button--on': this.selected,
    };
  }

  protected renderTouchTarget() {
    return html`<span class="md3-icon-button__touch"></span>`;
  }

  protected renderFocusRing() {
    return html`<md-focus-ring .visible="${
        this.showFocusRing}"></md-focus-ring>`;
  }

  protected handlePointerDown(e: PointerEvent) {
    pointerPress();
    this.showFocusRing = shouldShowStrongFocus();
  }

  protected handleFocus() {
    this.showFocusRing = shouldShowStrongFocus();
  }

  protected handleBlur() {
    this.showFocusRing = false;
  }

  protected handleClick() {
    this.selected = !this.selected;
    const detail = {selected: this.selected};
    this.dispatchEvent(new CustomEvent(
        'icon-button-toggle-change', {detail, bubbles: true, composed: true}));
  }
}
