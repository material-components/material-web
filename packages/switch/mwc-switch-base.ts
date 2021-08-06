/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/mwc-ripple/mwc-ripple';

import {ariaProperty} from '@material/mwc-base/aria-property';
import {FormElement} from '@material/mwc-base/form-element';
import {Ripple} from '@material/mwc-ripple/mwc-ripple';
import {RippleHandlers} from '@material/mwc-ripple/ripple-handlers';
import {MDCSwitchAdapter, MDCSwitchState} from '@material/switch/adapter';
import {MDCSwitchFoundation} from '@material/switch/foundation';
import {eventOptions, html, property, query, queryAsync, state} from 'lit-element';
import {TemplateResult} from 'lit-html';
import {ClassInfo, classMap} from 'lit-html/directives/class-map';
import {ifDefined} from 'lit-html/directives/if-defined';

export class SwitchBase extends FormElement implements MDCSwitchState {
  // MDCSwitchState
  @property({type: Boolean}) processing = false;
  @property({type: Boolean}) selected = false;

  // Aria
  /** @soyPrefixAttribute */
  @ariaProperty
  @property({type: String, attribute: 'aria-label'})
  ariaLabel = '';

  /** @soyPrefixAttribute */
  @ariaProperty
  @property({type: String, attribute: 'aria-labelledby'})
  ariaLabelledBy = '';

  // Ripple
  @queryAsync('mwc-ripple') readonly ripple!: Promise<Ripple|null>;

  @state() protected shouldRenderRipple = false;

  protected rippleHandlers = new RippleHandlers(() => {
    this.shouldRenderRipple = true;
    return this.ripple;
  });

  // FormElement
  @property({type: String, reflect: true}) name = '';
  @property({type: String}) value = 'on';

  @query('input') protected readonly formElement!: HTMLElement;

  protected setFormData(formData: FormData) {
    if (this.name && this.selected) {
      formData.append(this.name, this.value);
    }
  }

  // BaseElement
  @query('.mdc-switch') protected readonly mdcRoot!: HTMLElement;
  protected readonly mdcFoundationClass = MDCSwitchFoundation;
  protected mdcFoundation?: MDCSwitchFoundation;

  click() {
    // Switch uses a hidden input as its form element, but a different <button>
    // for interaction. It overrides click() from FormElement to avoid clicking
    // the hidden input.
    if (this.disabled) {
      return;
    }

    this.mdcRoot?.focus();
    this.mdcRoot?.click();
  }

  /** @soyTemplate */
  protected render(): TemplateResult {
    return html`
      <button
        type="button"
        class="mdc-switch ${classMap(this.getRenderClasses())}"
        role="switch"
        aria-checked="${this.selected}"
        aria-label="${ifDefined(this.ariaLabel || undefined)}"
        aria-labelledby="${ifDefined(this.ariaLabelledBy || undefined)}"
        .disabled=${this.disabled}
        @click=${this.handleClick}
        @focus="${this.handleFocus}"
        @blur="${this.handleBlur}"
        @pointerdown="${this.handlePointerDown}"
        @pointerup="${this.handlePointerUp}"
        @pointerenter="${this.handlePointerEnter}"
        @pointerleave="${this.handlePointerLeave}"
      >
        <div class="mdc-switch__track"></div>
        <div class="mdc-switch__handle-track">
          ${this.renderHandle()}
        </div>
      </button>

      <input
        type="checkbox"
        aria-hidden="true"
        name="${this.name}"
        .checked=${this.selected}
        .value=${this.value}
      >
    `;
  }

  /** @soyTemplate */
  protected getRenderClasses(): ClassInfo {
    return {
      'mdc-switch--processing': this.processing,
      'mdc-switch--selected': this.selected,
      'mdc-switch--unselected': !this.selected,
    };
  }

  /** @soyTemplate */
  protected renderHandle(): TemplateResult {
    return html`
      <div class="mdc-switch__handle">
        ${this.renderShadow()}
        ${this.renderRipple()}
        <div class="mdc-switch__icons">
          ${this.renderOnIcon()}
          ${this.renderOffIcon()}
        </div>
      </div>
    `;
  }

  /** @soyTemplate */
  protected renderShadow(): TemplateResult {
    return html`
      <div class="mdc-switch__shadow">
        <div class="mdc-elevation-overlay"></div>
      </div>
    `;
  }

  /** @soyTemplate */
  protected renderRipple(): TemplateResult {
    if (this.shouldRenderRipple) {
      return html`
        <div class="mdc-switch__ripple">
          <mwc-ripple
            internalUseStateLayerCustomProperties
            .disabled="${this.disabled}"
            unbounded>
          </mwc-ripple>
        </div>
      `;
    } else {
      return html``;
    }
  }

  /** @soyTemplate */
  protected renderOnIcon(): TemplateResult {
    return html`
      <svg class="mdc-switch__icon mdc-switch__icon--on" viewBox="0 0 24 24">
        <path d="M19.69,5.23L8.96,15.96l-4.23-4.23L2.96,13.5l6,6L21.46,7L19.69,5.23z" />
      </svg>
    `;
  }

  /** @soyTemplate */
  protected renderOffIcon(): TemplateResult {
    return html`
      <svg class="mdc-switch__icon mdc-switch__icon--off" viewBox="0 0 24 24">
        <path d="M20 13H4v-2h16v2z" />
      </svg>
    `;
  }

  protected handleClick() {
    this.mdcFoundation?.handleClick();
  }

  protected handleFocus() {
    this.rippleHandlers.startFocus();
  }

  protected handleBlur() {
    this.rippleHandlers.endFocus();
  }

  @eventOptions({passive: true})
  protected handlePointerDown(event: PointerEvent) {
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
    this.rippleHandlers.startPress(event);
  }

  protected handlePointerUp() {
    this.rippleHandlers.endPress();
  }

  protected handlePointerEnter() {
    this.rippleHandlers.startHover();
  }

  protected handlePointerLeave() {
    this.rippleHandlers.endHover();
  }

  protected createAdapter(): MDCSwitchAdapter {
    return {state: this};
  }
}
