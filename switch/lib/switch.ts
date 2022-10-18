/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../focus/focus-ring.js';
import '../../ripple/ripple.js';

import {html, TemplateResult} from 'lit';
import {eventOptions, property, query, state} from 'lit/decorators.js';
import {ClassInfo, classMap} from 'lit/directives/class-map.js';
import {ifDefined} from 'lit/directives/if-defined.js';

import {ActionElement, BeginPressConfig, EndPressConfig} from '../../actionelement/action-element.js';
import {FormController, getFormValue} from '../../controller/form-controller.js';
import {ariaProperty} from '../../decorators/aria-property.js';
import {pointerPress as focusRingPointerPress, shouldShowStrongFocus} from '../../focus/strong-focus.js';
import {MdRipple} from '../../ripple/ripple.js';

/** @soyCompatible */
export class Switch extends ActionElement {
  static override shadowRootOptions:
      ShadowRootInit = {mode: 'open', delegatesFocus: true};

  @property({type: Boolean, reflect: true}) disabled = false;
  @property({type: Boolean}) processing = false;
  @property({type: Boolean}) selected = false;
  @property({type: Boolean}) icons = false;
  @property({type: Boolean}) showOnlySelectedIcon = false;

  // Aria
  @ariaProperty  // tslint:disable-line:no-new-decorators
  // TODO(b/210730484): replace with @soyParam annotation
  @property({type: String, attribute: 'data-aria-label', noAccessor: true})
  override ariaLabel!: string;

  // TODO: Add support in @ariaProperty for idref aria attributes
  @ariaProperty  // tslint:disable-line:no-new-decorators
  @property({type: String, attribute: 'data-aria-labelledby', noAccessor: true})
  ariaLabelledBy = '';

  @state() protected showFocusRing = false;

  // Ripple
  @query('md-ripple') readonly ripple!: MdRipple;

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
    this.endPress({cancelled: false});
    super.click();
  }

  /** @soyTemplate */
  protected override render(): TemplateResult {
    const ariaLabelValue = this.ariaLabel ? this.ariaLabel : undefined;
    const ariaLabelledByValue =
        this.ariaLabelledBy ? this.ariaLabelledBy : undefined;
    // TODO(b/230763631): update this template to include spans instead of divs
    return html`
      <button
        type="button"
        class="md3-switch ${classMap(this.getRenderClasses())}"
        role="switch"
        aria-checked="${this.selected}"
        aria-label="${ifDefined(ariaLabelValue)}"
        aria-labelledby="${ifDefined(ariaLabelledByValue)}"
        ?disabled=${this.disabled}
        @click=${this.handleClick}
        @focus="${this.handleFocus}"
        @blur="${this.handleBlur}"
        @pointerdown=${this.handlePointerDown}
        @pointerenter=${this.handlePointerEnter}
        @pointerup=${this.handlePointerUp}
        @pointercancel=${this.handlePointerCancel}
        @pointerleave=${this.handlePointerLeave}
        @contextmenu=${this.handleContextMenu}
      >
        ${this.renderFocusRing()}
        <div class="md3-switch__track">
          ${this.renderHandle()}
        </div>
      </button>

      <input
        class="md3-switch__input"
        type="checkbox"
        aria-hidden="true"
        name="${this.name}"
        ?checked=${this.selected}
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
  protected renderRipple(): TemplateResult {
    return html`
      <div class="md3-switch__ripple">
        <md-ripple
          ?disabled="${this.disabled}"
          unbounded>
        </md-ripple>
      </div>
    `;
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
      'md3-switch__handle--big': this.icons && !this.showOnlySelectedIcon,
    };
    return html`
      <div class="md3-switch__handle-container">
        ${this.renderRipple()}
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
        ${this.showOnlySelectedIcon ? html`` : this.renderOffIcon()}
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
    return this.icons || this.showOnlySelectedIcon;
  }

  override beginPress({positionEvent}: BeginPressConfig) {
    this.ripple.beginPress(positionEvent);
  }

  override endPress({cancelled}: EndPressConfig) {
    this.ripple.endPress();

    if (cancelled || this.disabled) {
      return;
    }

    this.selected = !this.selected;
    super.endPress({cancelled, actionData: {selected: this.selected}});
  }

  protected handleFocus() {
    this.showFocusRing = shouldShowStrongFocus();
  }

  protected handleBlur() {
    this.showFocusRing = false;
  }

  protected handlePointerEnter(e: PointerEvent) {
    this.ripple.beginHover(e);
  }

  override handlePointerLeave(e: PointerEvent) {
    super.handlePointerLeave(e);
    this.ripple.endHover();
  }

  @eventOptions({passive: true})
  override handlePointerDown(event: PointerEvent) {
    super.handlePointerDown(event);
    focusRingPointerPress();
    this.showFocusRing = false;
  }
}
