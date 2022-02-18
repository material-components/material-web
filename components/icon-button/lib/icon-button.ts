/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, TemplateResult} from 'lit';
import {property, query, queryAsync, state} from 'lit/decorators';
import {ifDefined} from 'lit/directives/if-defined';

import {ActionElement, BeginPressConfig, EndPressConfig} from '../../action_element/action-element';
import {ariaProperty} from '../../decorators/aria-property';
import {Ripple} from '../../ripple/mwc-ripple';
import {RippleHandlers} from '../../ripple/ripple-handlers';
import {ARIAHasPopup} from '../../types/aria';

/** @soyCompatible */
export class IconButton extends ActionElement {
  @property({type: Boolean, reflect: true}) disabled = false;

  @property({type: String}) icon = '';

  /** @soyPrefixAttribute */
  @ariaProperty
  @property({type: String, attribute: 'aria-label'})
  override ariaLabel!: string;

  /** @soyPrefixAttribute */
  @ariaProperty
  @property({type: String, attribute: 'aria-haspopup'})
  override ariaHasPopup!: ARIAHasPopup;

  @query('button') buttonElement!: HTMLElement;

  @queryAsync('md-ripple') ripple!: Promise<Ripple|null>;

  @state() protected shouldRenderRipple = false;

  protected rippleHandlers: RippleHandlers = new RippleHandlers(() => {
    this.shouldRenderRipple = true;
    return this.ripple;
  });

  /** @soyTemplate */
  protected renderRipple(): TemplateResult|string {
    return this.shouldRenderRipple ? html`
            <md-ripple
                .disabled="${this.disabled}"
                unbounded>
            </md-ripple>` :
                                     '';
  }

  override focus() {
    const buttonElement = this.buttonElement;
    if (buttonElement) {
      this.rippleHandlers.startFocus();
      buttonElement.focus();
    }
  }

  override blur() {
    const buttonElement = this.buttonElement;
    if (buttonElement) {
      this.rippleHandlers.endFocus();
      buttonElement.blur();
    }
  }

  /** @soyTemplate */
  protected override render(): TemplateResult {
    return html`<button
        class="md3-icon-button"
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
        @clickmod="${this.handleClick}"
        @contextmenu="${this.handleContextMenu}"
    >${this.renderRipple()}
    ${this.renderIcon()}${this.renderTouchTarget()}<span><slot></slot></span>
  </button>`;
  }

  /** @soyTemplate */
  protected renderIcon(): TemplateResult|string {
    return this.icon ? html`<i class="material-icons">${this.icon}</i>` : '';
  }

  /** @soyTemplate */
  protected renderTouchTarget(): TemplateResult {
    return html`<span class="md3-icon-button__touch"></span>`;
  }

  override beginPress({positionEvent}: BeginPressConfig) {
    // TODO(b/149026822): remove `?? undefined`
    this.rippleHandlers.startPress(positionEvent ?? undefined);
  }

  override endPress(options: EndPressConfig) {
    this.rippleHandlers.endPress();
    super.endPress(options);
  }

  protected handlePointerEnter(e: PointerEvent) {
    // TODO(b/149026822): Remove check, handle in ripple
    if (e.pointerType !== 'touch') {
      this.rippleHandlers.startHover();
    }
  }

  override handlePointerLeave(e: PointerEvent) {
    super.handlePointerLeave(e);
    this.rippleHandlers.endHover();
  }

  protected handleFocus() {
    this.rippleHandlers.startFocus();
  }

  protected handleBlur() {
    this.rippleHandlers.endFocus();
  }
}
