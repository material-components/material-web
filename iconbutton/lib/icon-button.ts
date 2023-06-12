/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../focus/focus-ring.js';
import '../../ripple/ripple.js';

import {html, LitElement, nothing} from 'lit';
import {property, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {html as staticHtml, literal} from 'lit/static-html.js';

import {ARIAMixinStrict} from '../../internal/aria/aria.js';
import {requestUpdateOnAriaChange} from '../../internal/aria/delegate.js';
import {isRtl} from '../../internal/controller/is-rtl.js';

type LinkTarget = '_blank'|'_parent'|'_self'|'_top';

// tslint:disable-next-line:enforce-comments-on-exported-symbols
export class IconButton extends LitElement {
  static {
    requestUpdateOnAriaChange(this);
  }

  /**
   * Disables the icon button and makes it non-interactive.
   */
  @property({type: Boolean, reflect: true}) disabled = false;

  /**
   * Flips the icon if it is in an RTL context at startup.
   */
  @property({type: Boolean}) flipIconInRtl = false;

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

  @state() private flipIcon = isRtl(this, this.flipIconInRtl);

  /**
   * Link buttons cannot be disabled.
   */
  override willUpdate() {
    if (this.href) {
      this.disabled = false;
    }
  }

  protected override render() {
    const tag = this.href ? literal`div` : literal`button`;
    // Needed for closure conformance
    const {ariaLabel, ariaHasPopup, ariaExpanded} = this as ARIAMixinStrict;
    const hasToggledAriaLabel = ariaLabel && this.selectedAriaLabel;
    const ariaPressedValue = hasToggledAriaLabel ? nothing : this.selected;
    let ariaLabelValue: string|null|typeof nothing = nothing;
    if (!this.href) {
      ariaLabelValue = (hasToggledAriaLabel && this.selected) ?
          this.selectedAriaLabel :
          ariaLabel;
    }
    return staticHtml`<${tag}
        class="icon-button ${classMap(this.getRenderClasses())}"
        id="button"
        aria-label="${ariaLabelValue || nothing}"
        aria-haspopup="${!this.href && ariaHasPopup || nothing}"
        aria-expanded="${!this.href && ariaExpanded || nothing}"
        aria-pressed="${ariaPressedValue}"
        ?disabled="${!this.href && this.disabled}"
        @click="${this.handleClick}">
        ${this.renderFocusRing()}
        ${this.renderRipple()}
        ${!this.selected ? this.renderIcon() : nothing}
        ${this.selected ? this.renderSelectedIcon() : nothing}
        ${this.renderTouchTarget()}
        ${this.href && this.renderLink()}
  </${tag}>`;
  }

  private renderLink() {
    // Needed for closure conformance
    const {ariaLabel} = this as ARIAMixinStrict;
    return html`
      <a class="link"
        id="link"
        href="${this.href}"
        target="${this.target as LinkTarget || nothing}"
        aria-label="${ariaLabel || nothing}"
      ></a>
    `;
  }

  protected getRenderClasses() {
    return {
      'flip-icon': this.flipIcon,
      'selected': this.toggle && this.selected,
    };
  }

  private renderIcon() {
    return html`<span class="icon"><slot></slot></span>`;
  }

  private renderSelectedIcon() {
    // Use default slot as fallback to not require specifying multiple icons
    return html`<span class="icon icon--selected"><slot name="selectedIcon"><slot></slot></slot></span>`;
  }

  private renderTouchTarget() {
    return html`<span class="touch"></span>`;
  }

  private renderFocusRing() {
    return html`<md-focus-ring for=${
        this.href ? 'link' : 'button'}></md-focus-ring>`;
  }

  private renderRipple() {
    return html`<md-ripple
      for=${this.href ? 'link' : nothing}
      ?disabled="${!this.href && this.disabled}"
    ></md-ripple>`;
  }

  override connectedCallback() {
    this.flipIcon = isRtl(this, this.flipIconInRtl);
    super.connectedCallback();
  }

  private handleClick() {
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
