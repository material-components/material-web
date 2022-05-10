/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../focus/focus-ring.js';

import {ariaProperty as legacyAriaProperty} from '@material/mwc-base/aria-property.js';
import {html, LitElement, TemplateResult} from 'lit';
import {eventOptions, property, state} from 'lit/decorators.js';
import {ClassInfo, classMap} from 'lit/directives/class-map.js';
import {ifDefined} from 'lit/directives/if-defined.js';

import {FormController, getFormValue} from '../../controller/form-controller.js';
import {ariaProperty} from '../../decorators/aria-property.js';
import {pointerPress as focusRingPointerPress, shouldShowStrongFocus} from '../../focus/strong-focus.js';

/** @soyCompatible */
export class Switch extends LitElement {
  static override shadowRootOptions:
      ShadowRootInit = {mode: 'open', delegatesFocus: true};

  @property({type: Boolean, reflect: true}) disabled = false;
  @property({type: Boolean}) processing = false;
  @property({type: Boolean}) selected = false;
  @property({type: Boolean}) icons = false;
  @property({type: Boolean}) onlySelectedIcon = false;

  // Aria
  @ariaProperty
  // TODO(b/210730484): replace with @soyParam annotation
  @property({type: String, attribute: 'data-aria-label', noAccessor: true})
  override ariaLabel!: string;

  // TODO: Add support in @ariaProperty for idref aria attributes
  /** @soyPrefixAttribute */
  @legacyAriaProperty
  @property({type: String, attribute: 'aria-labelledby'})
  ariaLabelledBy = '';

  @state() protected showFocusRing = false;

  // FormController
  get form() {
    return this.closest('form');
  }
  @property({type: String, reflect: true}) name = '';
  @property({type: String}) value = 'on';
  [getFormValue]() {
    return this.selected ? this.value : null;
  }

  constructor() {
    super();
    this.addController(new FormController(this));
  }

  override click() {
    this.handleClick();
    super.click();
  }

  /** @soyTemplate */
  protected override render(): TemplateResult {
    // TODO(b/230763631): update this template to include spans instead of divs
    return html`
      <button
        type="button"
        class="md3-switch ${classMap(this.getRenderClasses())}"
        role="switch"
        aria-checked="${this.selected}"
        aria-label="${ifDefined(this.ariaLabel)}"
        aria-labelledby="${ifDefined(this.ariaLabelledBy || undefined)}"
        .disabled=${this.disabled}
        @click=${this.handleClick}
        @focus="${this.handleFocus}"
        @blur="${this.handleBlur}"
        @pointerdown="${this.handlePointerDown}"
      >
        ${this.renderFocusRing()}
        <div class="md3-switch__track">
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
      'md3-switch--processing': this.processing,
      'md3-switch--selected': this.selected,
      'md3-switch--unselected': !this.selected,
    };
  }

  /** @soyTemplate */
  protected renderFocusRing(): TemplateResult {
    return html`<md-focus-ring .visible="${
        this.showFocusRing}"></md-focus-ring>`;
  }

  /** @soyTemplate */
  protected renderHandle(): TemplateResult {
    /** @classMap */
    const classes = {
      'md3-switch__handle--big': this.icons && !this.onlySelectedIcon,
    };
    return html`
      <div class="md3-switch__handle-container">
        <div class="md3-switch__handle ${classMap(classes)}">
          ${this.shouldShowIcons() ? this.renderIcons() : html``}
        </div>
        ${this.renderTouchTarget()}
      </div>
    `;
  }

  /** @soyTemplate */
  private renderIcons(): TemplateResult {
    return html`
      <div class="md3-switch__icons">
        ${this.renderOnIcon()}
        ${this.onlySelectedIcon ? html`` : this.renderOffIcon()}
      </div>
    `;
  }

  /**
   * https://fonts.google.com/icons?selected=Material%20Symbols%20Outlined%3Acheck%3AFILL%400%3Bwght%40500%3BGRAD%400%3Bopsz%4024
   *
   * @soyTemplate
   */
  protected renderOnIcon(): TemplateResult {
    return html`
      <svg class="md3-switch__icon md3-switch__icon--on" viewBox="0 0 24 24">
        <path d="M9.55 18.2 3.65 12.3 5.275 10.675 9.55 14.95 18.725 5.775 20.35 7.4Z"/>
      </svg>
    `;
  }

  /**
   * https://fonts.google.com/icons?selected=Material%20Symbols%20Outlined%3Aclose%3AFILL%400%3Bwght%40500%3BGRAD%400%3Bopsz%4024
   *
   * @soyTemplate
   */
  protected renderOffIcon(): TemplateResult {
    return html`
      <svg class="md3-switch__icon md3-switch__icon--off" viewBox="0 0 24 24">
        <path d="M6.4 19.2 4.8 17.6 10.4 12 4.8 6.4 6.4 4.8 12 10.4 17.6 4.8 19.2 6.4 13.6 12 19.2 17.6 17.6 19.2 12 13.6Z"/>
      </svg>
    `;
  }

  /** @soyTemplate */
  private renderTouchTarget(): TemplateResult {
    return html`<span class="md3-switch__touch"></span>`;
  }

  /** @soyTemplate */
  private shouldShowIcons(): boolean {
    return this.icons || this.onlySelectedIcon;
  }

  protected handleClick() {
    if (this.disabled) {
      return;
    }

    this.selected = !this.selected;
  }

  protected handleFocus() {
    this.showFocusRing = shouldShowStrongFocus();
  }

  protected handleBlur() {
    this.showFocusRing = false;
  }

  @eventOptions({passive: true})
  protected handlePointerDown(event: PointerEvent) {
    focusRingPointerPress();
    this.showFocusRing = false;
  }
}
