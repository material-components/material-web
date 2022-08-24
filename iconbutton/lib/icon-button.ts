/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/focus/focus-ring.js';
import '@material/web/icon/icon.js';

import {ActionElement, BeginPressConfig, EndPressConfig} from '@material/web/actionelement/action-element.js';
import {ariaProperty} from '@material/web/decorators/aria-property.js';
import {pointerPress, shouldShowStrongFocus} from '@material/web/focus/strong-focus.js';
import {MdRipple} from '@material/web/ripple/ripple.js';
import {ARIAHasPopup} from '@material/web/types/aria.js';
import {html, TemplateResult} from 'lit';
import {property, query, state} from 'lit/decorators.js';
import {ClassInfo, classMap} from 'lit/directives/class-map.js';
import {ifDefined} from 'lit/directives/if-defined.js';
import {html as staticHtml, literal} from 'lit/static-html.js';

/** @soyCompatible */
export abstract class IconButton extends ActionElement {
  @property({type: Boolean, reflect: true}) disabled = false;

  @property({type: String}) icon = '';

  @property({type: Boolean}) flipIconInRtl = false;

  @property({type: Boolean}) flipIcon = false;

  /** @soyPrefixAttribute */
  @ariaProperty  // tslint:disable-line:no-new-decorators
  @property({type: String, attribute: 'aria-label'})
  override ariaLabel!: string;

  /** @soyPrefixAttribute */
  @ariaProperty  // tslint:disable-line:no-new-decorators
  @property({type: String, attribute: 'aria-haspopup'})
  override ariaHasPopup!: ARIAHasPopup;

  @query('button') buttonElement!: HTMLElement;

  @query('md-ripple') ripple!: MdRipple;

  @state() protected showFocusRing = false;

  protected readonly rippleElementTag = literal`md-ripple`;

  protected readonly focusElementTag = literal`md-focus-ring`;

  protected readonly iconElementTag = literal`md-icon`;

  /** @soyTemplate */
  protected renderRipple(): TemplateResult|string {
    return staticHtml`<${this.rippleElementTag} ?disabled="${
        this.disabled}" unbounded> </${this.rippleElementTag}>`;
  }

  /** @soyTemplate */
  protected override render(): TemplateResult {
    return html`<button
        class="md3-icon-button ${classMap(this.getRenderClasses())}"
        aria-label="${ifDefined(this.ariaLabel)}"
        aria-haspopup="${ifDefined(this.ariaHasPopup)}"
        ?disabled="${this.disabled}"
        @focus="${this.handleFocus}"
        @blur="${this.handleBlur}"
        @pointerdown="${this.handlePointerDown}"
        @pointerup="${this.handlePointerUp}"
        @pointercancel="${this.handlePointerCancel}"
        @pointerleave="${this.handlePointerLeave}"
        @pointerenter="${this.handlePointerEnter}"
        @click="${this.handleClick}"
        @contextmenu="${this.handleContextMenu}">
        ${this.renderFocusRing()}
        ${this.renderRipple()}
        <span class="md3-icon-button__icon">${this.renderIcon(this.icon)}</span>
        ${this.renderTouchTarget()}
        <span class="md3-icon-button__icon"><slot></slot></span>
  </button>`;
  }

  /** @soyTemplate */
  protected getRenderClasses(): ClassInfo {
    return {
      'md3-icon-button--flip-icon': this.flipIcon,
    };
  }

  /** @soyTemplate */
  protected renderIcon(icon: string): TemplateResult|string {
    return icon ?
        staticHtml`<${this.iconElementTag}>${icon}</${this.iconElementTag}>` :
        '';
  }

  /** @soyTemplate */
  protected renderTouchTarget(): TemplateResult {
    return html`<span class="md3-icon-button__touch"></span>`;
  }

  /** @soyTemplate */
  protected renderFocusRing(): TemplateResult {
    return staticHtml`<${this.focusElementTag} .visible="${
        this.showFocusRing}"></${this.focusElementTag}>`;
  }

  override connectedCallback() {
    this.maybeFlipIconInRtl();

    super.connectedCallback();
  }

  private maybeFlipIconInRtl() {
    if (!this.flipIconInRtl) return;

    const isRtl =
        getComputedStyle(this).getPropertyValue('direction') === 'rtl';
    this.flipIcon = isRtl;
  }

  override beginPress({positionEvent}: BeginPressConfig) {
    this.ripple.beginPress(positionEvent);
  }

  override endPress(options: EndPressConfig) {
    this.ripple.endPress();
    super.endPress(options);
  }

  override handlePointerDown(e: PointerEvent) {
    super.handlePointerDown(e);
    pointerPress();
    this.showFocusRing = shouldShowStrongFocus();
  }

  protected handlePointerEnter(e: PointerEvent) {
    this.ripple.beginHover(e);
  }

  override handlePointerLeave(e: PointerEvent) {
    super.handlePointerLeave(e);
    this.ripple.endHover();
  }

  protected handleFocus() {
    this.showFocusRing = shouldShowStrongFocus();
  }

  protected handleBlur() {
    this.showFocusRing = false;
  }
}
