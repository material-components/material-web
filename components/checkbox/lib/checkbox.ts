/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../focus/focus-ring';

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore

import {ariaProperty as legacyAriaProperty} from '@material/mwc-base/aria-property';
import {html, LitElement, PropertyValues, TemplateResult} from 'lit';
import {eventOptions, property, query, queryAsync, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {ifDefined} from 'lit/directives/if-defined.js';

import {ariaProperty} from '../../decorators/aria-property';
import {pointerPress, shouldShowStrongFocus} from '../../focus/strong-focus';
import {MdRipple} from '../../ripple/ripple';
import {RippleHandlers} from '../../ripple/ripple-handlers';


/** @soyCompatible */
export class Checkbox extends LitElement {
  @query('input') protected formElement!: HTMLInputElement;

  @property({type: Boolean, reflect: true}) checked = false;

  @property({type: Boolean}) indeterminate = false;

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

  @queryAsync('md-ripple') ripple!: Promise<MdRipple|null>;

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

  protected rippleElement: MdRipple|null = null;

  protected rippleHandlers: RippleHandlers = new RippleHandlers(() => {
    this.shouldRenderRipple = true;
    this.ripple.then((v) => this.rippleElement = v);
    return this.ripple;
  });

  // TODO(dfreedm): Make this use selected as a param after Polymer/internal#739
  /** @soyTemplate */
  protected renderRipple(): TemplateResult|string {
    return this.shouldRenderRipple ? this.renderRippleTemplate() : '';
  }

  /** @soyTemplate */
  protected renderRippleTemplate(): TemplateResult {
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
              @mousedown="${this.handleRippleMouseDown}"
              @mouseenter="${this.handleRippleMouseEnter}"
              @mouseleave="${this.handleRippleMouseLeave}"
              @touchstart="${this.handleRippleTouchStart}"
              @touchend="${this.handleRippleDeactivate}"
              @touchcancel="${this.handleRippleDeactivate}">
        <div class="md3-checkbox__background"
          @animationend="${this.resetAnimationClass}">
          <svg class="md3-checkbox__checkmark"
              viewBox="0 0 24 24">
            <path class="md3-checkbox__checkmark-path"
                  fill="none"
                  d="M1.73,12.91 8.1,19.28 22.79,4.59"></path>
          </svg>
          <div class="md3-checkbox__mixedmark"></div>
        </div>
        ${this.renderRipple()}
      </div>`;
  }

  protected setFormData(formData: FormData) {
    if (this.name && this.checked) {
      formData.append(this.name, this.value);
    }
  }

  protected handleFocus() {
    this.focused = true;
    this.handleRippleFocus();
  }

  protected handleBlur() {
    this.focused = false;
    this.handleRippleBlur();
  }

  protected handleRippleMouseDown(event: Event) {
    const onUp = () => {
      window.removeEventListener('mouseup', onUp);

      this.handleRippleDeactivate();
    };

    window.addEventListener('mouseup', onUp);
    this.rippleHandlers.startPress(event);
    pointerPress();
  }

  @eventOptions({passive: true})
  protected handleRippleTouchStart(event: Event) {
    this.rippleHandlers.startPress(event);
  }

  protected handleRippleDeactivate() {
    this.rippleHandlers.endPress();
  }

  protected handleRippleMouseEnter() {
    this.rippleHandlers.startHover();
  }

  protected handleRippleMouseLeave() {
    this.rippleHandlers.endHover();
  }

  protected handleRippleFocus() {
    this.showFocusRing = shouldShowStrongFocus();
    this.rippleHandlers.startFocus();
  }

  protected handleRippleBlur() {
    this.showFocusRing = false;
    this.rippleHandlers.endFocus();
  }

  protected handleChange() {
    this.checked = this.formElement.checked;
    this.indeterminate = this.formElement.indeterminate;
  }

  protected resetAnimationClass() {
    this.animationClass = '';
  }

  get isRippleActive() {
    return false;
  }
}
