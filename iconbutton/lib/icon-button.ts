/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// This is required for @ariaProperty
// tslint:disable:no-new-decorators

import '../../focus/focus-ring.js';
import '../../icon/icon.js';
import '../../ripple/ripple.js';

import {html, LitElement, nothing, TemplateResult} from 'lit';
import {property, query, queryAsync, state} from 'lit/decorators.js';
import {ClassInfo, classMap} from 'lit/directives/class-map.js';
import {when} from 'lit/directives/when.js';

import {isRtl} from '../../controller/is-rtl.js';
import {ariaProperty} from '../../decorators/aria-property.js';
import {pointerPress, shouldShowStrongFocus} from '../../focus/strong-focus.js';
import {ripple} from '../../ripple/directive.js';
import {MdRipple} from '../../ripple/ripple.js';
import {ARIAExpanded, ARIAHasPopup} from '../../types/aria.js';

type LinkTarget = '_blank'|'_parent'|'_self'|'_top';

// tslint:disable-next-line:enforce-comments-on-exported-symbols
export class IconButton extends LitElement {
  /**
   * Disables the icon button and makes it non-interactive.
   */
  @property({type: Boolean, reflect: true}) disabled = false;

  /**
   * Flips the icon if it is in an RTL context at startup.
   */
  @property({type: Boolean}) flipIconInRtl = false;

  @ariaProperty
  @property({attribute: 'data-aria-label'})
  override ariaLabel!: string;

  @ariaProperty
  @property({attribute: 'data-aria-haspopup'})
  override ariaHasPopup!: ARIAHasPopup;

  @ariaProperty
  @property({attribute: 'data-aria-expanded'})
  override ariaExpanded!: ARIAExpanded;

  /**
   * Sets the underlying `HTMLAnchorElement`'s `href` resource attribute.
   */
  @property() href = '';

  /**
   * Sets the underlying `HTMLAnchorElement`'s `target` attribute.
   */
  @property() target = '';

  /**
   * The `aria-label` of the button when the button is toggleable and selected.
   */
  @property({attribute: 'selected-aria-label', reflect: true})
  selectedAriaLabel!: string;

  /**
   * When true, the button will toggle between selected and unselected
   * states
   */
  @property({type: Boolean}) toggle = false;

  /**
   * Sets the selected state. When false, displays the default icon. When true,
   * displays the `selectedIcon`, or the default icon If no `selectedIcon` is
   * provided.
   */
  @property({type: Boolean, reflect: true}) selected = false;

  @query('button') protected buttonElement!: HTMLElement;

  @queryAsync('md-ripple') protected ripple!: Promise<MdRipple|null>;

  @state() protected showFocusRing = false;

  @state() protected showRipple = false;

  @state() protected flipIcon: boolean = isRtl(this, this.flipIconInRtl);

  protected getRipple = () => {
    this.showRipple = true;
    return this.ripple;
  };

  protected readonly renderRipple = () => {
    return html`<md-ripple ?disabled="${
    !this.href && this.disabled}"></md-ripple>`;
  };

  /**
   * Link buttons cannot be disabled.
   */
  override willUpdate() {
    if (this.href) {
      this.disabled = false;
    }
  }

  protected override render(): TemplateResult {
    return this.href ? this.renderDiv() : this.renderButton();
  }

  protected renderRootChildren() {
    return html`
      ${this.renderFocusRing()}
      ${when(this.showRipple, this.renderRipple)}
      ${!this.selected ? this.renderIcon() : nothing}
      ${this.selected ? this.renderSelectedIcon() : nothing}
      ${this.renderTouchTarget()}
      ${this.href && this.renderLink()}
    `;
  }

  protected getProps() {
    const hasToggledAriaLabel = this.ariaLabel && this.selectedAriaLabel;
    const ariaPressedValue = hasToggledAriaLabel ? nothing : this.selected;
    let ariaLabelValue: string|typeof nothing = nothing;
    if (!this.href) {
      ariaLabelValue = (hasToggledAriaLabel && this.selected) ?
          this.selectedAriaLabel :
          this.ariaLabel;
    }
    return {ariaLabelValue, ariaPressedValue};
  }

  protected renderButton() {
    const {ariaLabelValue, ariaPressedValue} = this.getProps();
    return html`<button
        class="md3-icon-button ${classMap(this.getRenderClasses())}"
        aria-label="${ariaLabelValue || nothing}"
        aria-haspopup="${!this.href && this.ariaHasPopup || nothing}"
        aria-expanded="${!this.href && this.ariaExpanded || nothing}"
        aria-pressed="${ariaPressedValue}"
        ?disabled="${!this.href && this.disabled}"
        @focus="${this.handleFocus}"
        @blur="${this.handleBlur}"
        @pointerdown="${this.handlePointerDown}"
        @click="${this.handleClick}"
        ${ripple(this.getRipple)}>
        ${this.renderRootChildren()}
    </button>`;
  }

  protected renderDiv() {
    const {ariaLabelValue, ariaPressedValue} = this.getProps();
    return html`<div
        class="md3-icon-button ${classMap(this.getRenderClasses())}"
        aria-label="${ariaLabelValue || nothing}"
        aria-haspopup="${!this.href && this.ariaHasPopup || nothing}"
        aria-expanded="${!this.href && this.ariaExpanded || nothing}"
        aria-pressed="${ariaPressedValue}"
        ?disabled="${!this.href && this.disabled}"
        @focus="${this.handleFocus}"
        @blur="${this.handleBlur}"
        @pointerdown="${this.handlePointerDown}"
        @click="${this.handleClick}"
        ${ripple(this.getRipple)}>
        ${this.renderRootChildren()}
    </div>`;
  }

  protected renderLink() {
    return html`<a class="md3-icon-button__link" href="${this.href}"
                  target="${this.target as LinkTarget || nothing}"
                  @focus="${this.handleFocus}"
                  @blur="${this.handleBlur}"
                  aria-label="${this.ariaLabel || nothing}"></a>`;
  }

  protected getRenderClasses(): ClassInfo {
    return {
      'md3-icon-button--flip-icon': this.flipIcon,
      'md3-icon-button--selected': this.toggle && this.selected,
    };
  }

  protected renderIcon(): TemplateResult {
    return html`<md-icon class="md3-icon-button__icon"><slot></slot></md-icon>`;
  }

  protected renderSelectedIcon() {
    // Use default slot as fallback to not require specifying multiple icons
    return html`<md-icon class="md3-icon-button__icon md3-icon-button__icon--selected"><slot name="selectedIcon"><slot></slot></slot></md-icon>`;
  }

  protected renderTouchTarget(): TemplateResult {
    return html`<span class="md3-icon-button__touch"></span>`;
  }

  protected renderFocusRing(): TemplateResult {
    return html`<md-focus-ring .visible="${
        this.showFocusRing}"></md-focus-ring>`;
  }

  override connectedCallback() {
    this.flipIcon = isRtl(this, this.flipIconInRtl);
    super.connectedCallback();
  }

  handlePointerDown() {
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
    if (!this.toggle || this.disabled) {
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
