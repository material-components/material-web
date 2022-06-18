/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/focus/focus-ring';
import '@material/web/ripple/ripple';

import {ariaProperty as legacyAriaProperty} from '@material/mwc-base/aria-property';
import {ActionElement, BeginPressConfig, EndPressConfig} from '@material/web/actionelement/action-element';
import {ariaProperty} from '@material/web/decorators/aria-property';
import {pointerPress, shouldShowStrongFocus} from '@material/web/focus/strong-focus';
import {MdRipple} from '@material/web/ripple/ripple';
import {html, PropertyValues, TemplateResult} from 'lit';
import {property, query, state} from 'lit/decorators';
import {classMap} from 'lit/directives/class-map';
import {ifDefined} from 'lit/directives/if-defined';

/** @soyCompatible */
export class Checkbox extends ActionElement {
  @query('input') protected formElement!: HTMLInputElement;

  @property({type: Boolean, reflect: true}) checked = false;

  @property({type: Boolean, reflect: true}) indeterminate = false;

  @property({type: Boolean, reflect: true}) disabled = false;

  @property({type: String, reflect: true}) name = '';

  @property({type: String}) value = 'on';

  /** @soyPrefixAttribute */
  @ariaProperty
  @property({type: String, attribute: 'aria-label'})
  override ariaLabel!: string;

  /** @soyPrefixAttribute */
  @legacyAriaProperty
  @property({type: String, attribute: 'aria-labelledby'})
  ariaLabelledBy!: undefined|string;

  /** @soyPrefixAttribute */
  @legacyAriaProperty
  @property({type: String, attribute: 'aria-describedby'})
  ariaDescribedBy!: undefined|string;

  /**
   * Touch target extends beyond visual boundary of a component by default.
   * Set to `true` to remove touch target added to the component.
   * @see https://material.io/design/usability/accessibility.html
   */
  @property({type: Boolean}) reducedTouchTarget = false;

  @state() protected animationClass = '';

  @state() protected shouldRenderRipple = false;

  @state() protected showFocusRing = false;

  @state() protected focused = false;

  @query('md-ripple') ripple!: MdRipple;

  // MDC Foundation is unused
  protected mdcFoundationClass = undefined;

  protected mdcFoundation = undefined;

  protected createAdapter() {
    return {};
  }

  protected override update(changedProperties: PropertyValues) {
    const oldIndeterminate = changedProperties.get('indeterminate');
    const oldChecked = changedProperties.get('checked');
    const oldDisabled = changedProperties.get('disabled');
    if (oldIndeterminate !== undefined || oldChecked !== undefined ||
        oldDisabled !== undefined) {
      const oldState = this.calculateAnimationStateName(
          !!oldChecked, !!oldIndeterminate, !!oldDisabled);
      const newState = this.calculateAnimationStateName(
          this.checked, this.indeterminate, this.disabled);
      this.animationClass = `${oldState}-${newState}`;
    }
    super.update(changedProperties);
  }

  protected calculateAnimationStateName(
      checked: boolean, indeterminate: boolean, disabled: boolean): string {
    if (disabled) {
      return 'disabled';
    } else if (indeterminate) {
      return 'indeterminate';
    } else if (checked) {
      return 'checked';
    } else {
      return 'unchecked';
    }
  }

  /** @soyTemplate */
  protected renderRipple(): TemplateResult {
    return html`<md-ripple
        .disabled="${this.disabled}"
        unbounded></md-ripple>`;
  }

  /** @soyTemplate */
  protected renderFocusRing(): TemplateResult {
    return html`<md-focus-ring .visible="${
        this.showFocusRing}"></md-focus-ring>`;
  }

  /**
   * @soyTemplate
   * @soyAttributes checkboxAttributes: input
   * @soyClasses checkboxClasses: .md3-checkbox
   */
  protected override render(): TemplateResult {
    const selected = this.indeterminate || this.checked;
    /* eslint-disable eqeqeq */
    // tslint:disable:triple-equals
    /** @classMap */
    const classes = {
      'md3-checkbox--disabled': this.disabled,
      'md3-checkbox--selected': selected,
      'md3-checkbox--touch': !this.reducedTouchTarget,
      'md3-ripple-upgraded--background-focused': this.focused,
      // transition animiation classes
      'md3-checkbox--anim-checked-indeterminate':
          this.animationClass == 'checked-indeterminate',
      'md3-checkbox--anim-checked-unchecked':
          this.animationClass == 'checked-unchecked',
      'md3-checkbox--anim-indeterminate-checked':
          this.animationClass == 'indeterminate-checked',
      'md3-checkbox--anim-indeterminate-unchecked':
          this.animationClass == 'indeterminate-unchecked',
      'md3-checkbox--anim-unchecked-checked':
          this.animationClass == 'unchecked-checked',
      'md3-checkbox--anim-unchecked-indeterminate':
          this.animationClass == 'unchecked-indeterminate',
    };
    // tslint:enable:triple-equals
    /* eslint-enable eqeqeq */
    const ariaChecked = this.indeterminate ? 'mixed' : undefined;
    return html`
      <div class="md3-checkbox md3-checkbox--upgraded ${classMap(classes)}">
        ${this.renderFocusRing()}
        <input type="checkbox"
              class="md3-checkbox__native-control"
              name="${ifDefined(this.name)}"
              aria-checked="${ifDefined(ariaChecked)}"
              aria-label="${ifDefined(this.ariaLabel)}"
              aria-labelledby="${ifDefined(this.ariaLabelledBy)}"
              aria-describedby="${ifDefined(this.ariaDescribedBy)}"
              data-indeterminate="${this.indeterminate ? 'true' : 'false'}"
              ?disabled="${this.disabled}"
              .indeterminate="${this.indeterminate}"
              .checked="${this.checked}"
              .value="${this.value}"
              @change="${this.handleChange}"
              @focus="${this.handleFocus}"
              @blur="${this.handleBlur}"
              @pointerdown=${this.handlePointerDown}
              @pointerenter=${this.handlePointerEnter}
              @pointerup=${this.handlePointerUp}
              @pointercancel=${this.handlePointerCancel}
              @pointerleave=${this.handlePointerLeave}
              @click=${this.handleClick}
              @contextmenu=${this.handleContextMenu}
              >
        <div class="md3-checkbox__background"
          @animationend="${this.resetAnimationClass}">
          <svg class="md3-checkbox__checkmark"
              viewBox="0 0 24 24" aria-hidden="true">
            <path class="md3-checkbox__checkmark-path"
                  fill="none"
                  d="M1.73,12.91 8.1,19.28 22.79,4.59"></path>
          </svg>
          <div class="md3-checkbox__mixedmark"></div>
        </div>
        <div class="md3-checkbox__ripple">
          ${this.renderRipple()}
        </div>
      </div>`;
  }

  protected setFormData(formData: FormData) {
    if (this.name && this.checked) {
      formData.append(this.name, this.value);
    }
  }

  override beginPress({positionEvent}: BeginPressConfig) {
    this.ripple.beginPress(positionEvent);
  }

  override endPress({cancelled}: EndPressConfig) {
    this.ripple.endPress();

    if (cancelled) {
      return;
    }

    super.endPress({
      cancelled,
      actionData:
          {checked: this.formElement.checked, value: this.formElement.value}
    });
  }

  protected handleFocus() {
    this.focused = true;
    this.showFocusRing = shouldShowStrongFocus();
  }

  protected handleBlur() {
    this.focused = false;
    this.showFocusRing = false;
  }

  protected handlePointerEnter(e: PointerEvent) {
    this.ripple.beginHover(e);
  }

  override handlePointerLeave(e: PointerEvent) {
    super.handlePointerLeave(e);
    this.ripple.endHover();
  }

  override handlePointerDown(e: PointerEvent) {
    super.handlePointerDown(e);

    pointerPress();
    this.showFocusRing = shouldShowStrongFocus();
  }

  protected handleChange() {
    this.checked = this.formElement.checked;
    this.indeterminate = this.formElement.indeterminate;

    this.dispatchEvent(new Event('change', {
      bubbles: true,
      composed: true,
    }));
  }

  protected resetAnimationClass() {
    this.animationClass = '';
  }

  get isRippleActive() {
    return false;
  }
}
