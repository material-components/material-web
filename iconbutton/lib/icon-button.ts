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
import {property, query, queryAssignedElements, queryAsync, state} from 'lit/decorators.js';
import {ClassInfo, classMap} from 'lit/directives/class-map.js';
import {when} from 'lit/directives/when.js';

import {isRtl} from '../../controller/is-rtl.js';
import {ariaProperty} from '../../decorators/aria-property.js';
import {pointerPress, shouldShowStrongFocus} from '../../focus/strong-focus.js';
import {ripple} from '../../ripple/directive.js';
import {MdRipple} from '../../ripple/ripple.js';
import {ARIAHasPopup} from '../../types/aria.js';

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

  /**
   * The `aria-label` of the button when the icon button is selected or "on".
   */
  @property({type: String}) ariaLabelSelected!: string;

  /**
   * Sets the icon button to the "on" state and displays the `selectedIcon`. If
   * false, sets the toggle button to the "off" state and displays the
   * default icon.
   */
  @property({type: Boolean, reflect: true}) selected = false;

  @state() protected flipIcon: boolean = isRtl(this, this.flipIconInRtl);

  @ariaProperty
  @property({type: String, attribute: 'data-aria-label'})
  override ariaLabel!: string;

  @ariaProperty
  @property({type: String, attribute: 'data-aria-haspopup'})
  override ariaHasPopup!: ARIAHasPopup;

  @query('button') protected buttonElement!: HTMLElement;

  @queryAsync('md-ripple') protected ripple!: Promise<MdRipple|null>;

  @state() protected showFocusRing = false;

  @state() protected showRipple = false;

  @state() protected hasSelectedIcon = false;

  @queryAssignedElements({slot: 'selectedIcon', flatten: true})
  protected selectedIconElements!: HTMLElement[];

  protected getRipple = () => {
    this.showRipple = true;
    return this.ripple;
  };

  protected readonly renderRipple = () => {
    return html`<md-ripple ?disabled="${this.disabled}"></md-ripple>`;
  };

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
        aria-haspopup="${this.ariaHasPopup || nothing}"
        ?disabled="${this.disabled}"
        @focus="${this.handleFocus}"
        @blur="${this.handleBlur}"
        @pointerdown="${this.handlePointerDown}"
        @click="${this.handleClick}"
        ${ripple(this.getRipple)}>
        ${this.renderFocusRing()}
        ${when(this.showRipple, this.renderRipple)}
        ${this.renderIcon()}
        ${this.renderSelectedIcon()}
        ${this.renderTouchTarget()}
  </button>`;
  }

  protected getRenderClasses(): ClassInfo {
    return {
      'md3-icon-button--flip-icon': this.flipIcon,
      'md3-icon-button--selected': this.hasSelectedIcon && this.selected,
    };
  }

  protected renderIcon(): TemplateResult {
    return html`<md-icon class="md3-icon-button__icon"><slot></slot></md-icon>`;
  }

  protected renderSelectedIcon() {
    return html`<md-icon class="md3-icon-button__icon md3-icon-button__icon--selected"><slot name="selectedIcon" @slotchange="${
        this.handleSelectedSlotChange}"></slot></md-icon>`;
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

  protected handleSelectedSlotChange() {
    this.hasSelectedIcon = this.selectedIconElements.length > 0;
  }

  protected handleClick() {
    if (!this.hasSelectedIcon) {
      return;
    }
    this.selected = !this.selected;
    const detail = {selected: this.selected};
    this.dispatchEvent(new CustomEvent(
        'icon-button-toggle-change', {detail, bubbles: true, composed: true}));
  }
}
