/**
@license
Copyright 2019 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import '@material/mwc-ripple/mwc-ripple.js';

import {FormElement} from '@material/mwc-base/form-element.js';
import {Ripple} from '@material/mwc-ripple/mwc-ripple.js';
import {RippleHandlers} from '@material/mwc-ripple/ripple-handlers.js';
import {html, internalProperty, property, PropertyValues, query, queryAsync} from 'lit-element';
import {classMap} from 'lit-html/directives/class-map.js';
import {ifDefined} from 'lit-html/directives/if-defined.js';

/** @soyCompatible */
export class CheckboxBase extends FormElement {
  @query('.mdc-checkbox') protected mdcRoot!: HTMLElement;

  @query('input') protected formElement!: HTMLInputElement;

  @property({type: Boolean, reflect: true}) checked = false;

  @property({type: Boolean}) indeterminate = false;

  @property({type: Boolean, reflect: true}) disabled = false;

  @property({type: String}) value = '';

  @internalProperty() protected animationClass = '';

  @internalProperty() protected shouldRenderRipple = false;

  @queryAsync('mwc-ripple') ripple!: Promise<Ripple|null>;

  // MDC Foundation is unused
  protected mdcFoundationClass = undefined;

  protected mdcFoundation = undefined;

  protected createAdapter() {
    return {};
  }

  protected update(changedProperties: PropertyValues) {
    const oldIndeterminate = changedProperties.get('indeterminate');
    const oldChecked = changedProperties.get('checked');
    if (oldIndeterminate !== undefined || oldChecked !== undefined) {
      const oldState =
          this.calculateAnimationStateName(!!oldChecked, !!oldIndeterminate);
      const newState =
          this.calculateAnimationStateName(this.checked, this.indeterminate);
      this.animationClass = `${oldState}-${newState}`;
    }
    super.update(changedProperties);
  }

  protected calculateAnimationStateName(
      checked: boolean, indeterminate: boolean): string {
    if (indeterminate) {
      return 'indeterminate';
    } else if (checked) {
      return 'checked';
    } else {
      return 'unchecked';
    }
  }

  private rippleElement: Ripple|null = null;

  protected rippleHandlers: RippleHandlers = new RippleHandlers(() => {
    this.shouldRenderRipple = true;
    this.ripple.then((v) => this.rippleElement = v);
    return this.ripple;
  });

  // TODO(dfreedm): Make this use selected as a param after Polymer/internal#739
  /** @soyCompatible */
  protected renderRipple() {
    const selected = this.indeterminate || this.checked;
    return html`${
        this.shouldRenderRipple ?
            html`<mwc-ripple .accent="${selected}" .disabled="${
                this.disabled}" .unbounded="${true}"></mwc-ripple>` :
            ''}`;
  }

  /**
   * @soyCompatible
   * @soyAttributes checkboxAttributes: input
   */
  protected render() {
    const selected = this.indeterminate || this.checked;
    /* eslint-disable eqeqeq */
    // tslint:disable:triple-equals
    /** @classMap */
    const classes = {
      'mdc-checkbox--disabled': this.disabled,
      'mdc-checkbox--selected': selected,
      // transition animiation classes
      'mdc-checkbox--anim-checked-indeterminate':
          this.animationClass == 'checked-indeterminate',
      'mdc-checkbox--anim-checked-unchecked':
          this.animationClass == 'checked-unchecked',
      'mdc-checkbox--anim-indeterminate-checked':
          this.animationClass == 'indeterminate-checked',
      'mdc-checkbox--anim-indeterminate-unchecked':
          this.animationClass == 'indeterminate-unchecked',
      'mdc-checkbox--anim-unchecked-checked':
          this.animationClass == 'unchecked-checked',
      'mdc-checkbox--anim-unchecked-indeterminate':
          this.animationClass == 'unchecked-indeterminate',
    };
    // tslint:enable:triple-equals
    /* eslint-enable eqeqeq */
    const ariaChecked = this.indeterminate ? 'mixed' : undefined;
    return html`
      <div class="mdc-checkbox mdc-checkbox--upgraded ${classMap(classes)}">
        <input type="checkbox"
              class="mdc-checkbox__native-control"
              aria-checked="${ifDefined(ariaChecked)}"
              data-indeterminate="${this.indeterminate ? 'true' : 'false'}"
              ?disabled="${this.disabled}"
              .indeterminate="${this.indeterminate}"
              .checked="${this.checked}"
              .value="${this.value}"
              @change="${this._changeHandler}"
              @focus="${this._handleFocus}"
              @blur="${this._handleBlur}"
              @mousedown="${this._activateRipple}"
              @mouseup="${this._deactivateRipple}"
              @mouseenter="${this._handleMouseEnter}"
              @mouseleave="${this._handleMouseLeave}"
              @touchstart="${this._activateRipple}"
              @touchend="${this._deactivateRipple}"
              @touchcancel="${this._deactivateRipple}">
        <div class="mdc-checkbox__background">
          <svg class="mdc-checkbox__checkmark"
              viewBox="0 0 24 24">
            <path class="mdc-checkbox__checkmark-path"
                  fill="none"
                  d="M1.73,12.91 8.1,19.28 22.79,4.59"></path>
          </svg>
          <div class="mdc-checkbox__mixedmark"></div>
        </div>
        ${this.renderRipple()}
      </div>`;
  }

  private _handleFocus() {
    this.rippleHandlers.startFocus();
  }

  private _handleBlur() {
    this.rippleHandlers.endFocus();
  }

  private _activateRipple() {
    this.rippleHandlers.startPress();
  }

  private _deactivateRipple() {
    this.rippleHandlers.endPress();
  }

  private _handleMouseEnter() {
    this.rippleHandlers.startHover();
  }

  private _handleMouseLeave() {
    this.rippleHandlers.endHover();
  }

  private _changeHandler() {
    this.checked = this.formElement.checked;
    this.indeterminate = this.formElement.indeterminate;
  }

  get isRippleActive() {
    return this.rippleElement?.isActive || false;
  }
}
