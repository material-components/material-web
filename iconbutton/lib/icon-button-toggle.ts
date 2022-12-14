/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../focus/focus-ring.js';
import '../../icon/icon.js';
import '../../ripple/ripple.js';

import {html, LitElement, TemplateResult} from 'lit';
import {property, queryAsync, state} from 'lit/decorators.js';
import {ClassInfo, classMap} from 'lit/directives/class-map.js';
import {ifDefined} from 'lit/directives/if-defined.js';
import {when} from 'lit/directives/when.js';

import {ariaProperty} from '../../decorators/aria-property.js';
import {pointerPress, shouldShowStrongFocus} from '../../focus/strong-focus.js';
import {ripple} from '../../ripple/directive.js';
import {MdRipple} from '../../ripple/ripple.js';

/** @soyCompatible */
export class IconButtonToggle extends LitElement {
  /** @soyPrefixAttribute */
  @ariaProperty  // tslint:disable-line:no-new-decorators
  @property({type: String, attribute: 'aria-label'})
  override ariaLabel!: string;

  @property({type: Boolean, reflect: true}) disabled = false;

  @property({type: String}) onIcon = '';

  @property({type: String}) offIcon = '';

  // `aria-label` of the button when `on` is true.
  @property({type: String}) ariaLabelOn!: string;

  // `aria-label` of the button when `on` is false.
  @property({type: String}) ariaLabelOff!: string;

  @property({type: Boolean, reflect: true}) selected = false;

  @queryAsync('md-ripple') ripple!: Promise<MdRipple|null>;

  @state() protected showFocusRing = false;

  @state() protected showRipple = false;

  protected readonly getRipple = () => {
    this.showRipple = true;
    return this.ripple;
  };

  protected readonly renderRipple = () => {
    return html`<md-ripple ?disabled="${this.disabled}" unbounded></md-ripple>`;
  };

  /** @soyTemplate */
  protected override render(): TemplateResult {
    const hasToggledAriaLabel = this.ariaLabelOn && this.ariaLabelOff;
    const ariaPressedValue = hasToggledAriaLabel ? undefined : this.selected;
    const ariaLabelValue = hasToggledAriaLabel ?
        (this.selected ? this.ariaLabelOn : this.ariaLabelOff) :
        this.ariaLabel;
    return html`<button
          class="md3-icon-button ${classMap(this.getRenderClasses())}"
          aria-pressed="${ifDefined(ariaPressedValue)}"
          aria-label="${ifDefined(ariaLabelValue)}"
          ?disabled="${this.disabled}"
          @focus="${this.handleFocus}"
          @blur="${this.handleBlur}"
          @pointerdown="${this.handlePointerDown}"
          @click="${this.handleClick}"
          ${ripple(this.getRipple)}>
        ${this.renderFocusRing()}
        ${when(this.showRipple, this.renderRipple)}
        ${this.renderTouchTarget()}
        <span class="md3-icon-button__icon">
          <slot name="offIcon">${this.renderIcon(this.offIcon)}</slot>
        </span>
        <span class="md3-icon-button__icon md3-icon-button__icon--on">
          <slot name="onIcon">${this.renderIcon(this.onIcon)}</slot>
        </span>
      </button>`;
  }

  /** @soyTemplate */
  protected getRenderClasses(): ClassInfo {
    return {
      'md3-icon-button--on': this.selected,
    };
  }

  /** @soyTemplate */
  protected renderIcon(icon: string): TemplateResult|string {
    return icon ? html`<md-icon>${icon}</md-icon>` : '';
  }

  /** @soyTemplate */
  protected renderTouchTarget(): TemplateResult {
    return html`<span class="md3-icon-button__touch"></span>`;
  }

  /** @soyTemplate */
  protected renderFocusRing(): TemplateResult {
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
