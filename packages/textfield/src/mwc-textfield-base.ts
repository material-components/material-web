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
import '@material/mwc-notched-outline';

import {MDCFloatingLabelFoundation} from '@material/floating-label/foundation.js';
import {MDCLineRippleFoundation} from '@material/line-ripple/foundation.js';
import {addHasRemoveClass, FormElement} from '@material/mwc-base/form-element.js';
import {floatingLabel, FloatingLabel} from '@material/mwc-floating-label';
import {lineRipple, LineRipple} from '@material/mwc-line-ripple';
import {NotchedOutline} from '@material/mwc-notched-outline';
import {MDCTextFieldAdapter, MDCTextFieldInputAdapter, MDCTextFieldLabelAdapter, MDCTextFieldLineRippleAdapter, MDCTextFieldOutlineAdapter, MDCTextFieldRootAdapter} from '@material/textfield/adapter.js';
import MDCTextFieldFoundation from '@material/textfield/foundation.js';
import {eventOptions, html, property, PropertyValues, query, TemplateResult} from 'lit-element';
import {classMap} from 'lit-html/directives/class-map.js';
import {ifDefined} from 'lit-html/directives/if-defined.js';
import {live} from 'lit-html/directives/live.js';

// must be done to get past lit-analyzer checks
declare global {
  interface Element {
    floatingLabelFoundation?: MDCFloatingLabelFoundation;
    lineRippleFoundation?: MDCLineRippleFoundation;
  }
}

type CustomValidityState = {
  -readonly[P in keyof ValidityState]: ValidityState[P]
};


const passiveEvents = ['touchstart', 'touchmove', 'scroll', 'mousewheel'];

const createValidityObj =
    (customValidity: Partial<ValidityState> = {}): ValidityState => {
      /*
       * We need to make ValidityState an object because it is readonly and
       * we cannot use the spread operator. Also, we don't export
       * `CustomValidityState` because it is a leaky implementation and the user
       * already has access to `ValidityState` in lib.dom.ts. Also an interface
       * {a: Type} can be casted to {readonly a: Type} so passing any object
       * should be fine.
       */
      const objectifiedCustomValidity: Partial<CustomValidityState> = {};

      // eslint-disable-next-line guard-for-in
      for (const propName in customValidity) {
        /*
         * Casting is needed because ValidityState's props are all readonly and
         * thus cannot be set on `onjectifiedCustomValidity`. In the end, the
         * interface is the same as ValidityState (but not readonly), but the
         * function signature casts the output to ValidityState (thus readonly).
         */
        objectifiedCustomValidity[propName as keyof CustomValidityState] =
            customValidity[propName as keyof ValidityState];
      }

      return {
        badInput: false,
        customError: false,
        patternMismatch: false,
        rangeOverflow: false,
        rangeUnderflow: false,
        stepMismatch: false,
        tooLong: false,
        tooShort: false,
        typeMismatch: false,
        valid: true,
        valueMissing: false,
        ...objectifiedCustomValidity
      };
    };

/**
 * This is the enumerated typeof HTMLInputElement.type as declared by
 * lit-analyzer.
 */
export type TextFieldType = 'text'|'search'|'tel'|'url'|'email'|'password'|
    'date'|'month'|'week'|'time'|'datetime-local'|'number'|'color';

/**
 * This is the enumerated typeof HTMLInputElement.inputMode as declared by
 * lit-analyzer.
 */
export type TextFieldInputMode =
    'verbatim'|'latin'|'latin-name'|'latin-prose'|'full-width-latin'|'kana'|
    'kana-name'|'katakana'|'numeric'|'tel'|'email'|'url';

export abstract class TextFieldBase extends FormElement {
  protected mdcFoundation!: MDCTextFieldFoundation;

  protected readonly mdcFoundationClass = MDCTextFieldFoundation;

  @query('.mdc-text-field') protected mdcRoot!: HTMLElement;

  @query('input') protected formElement!: HTMLInputElement;

  @query('.mdc-floating-label') protected labelElement!: FloatingLabel|null;

  @query('.mdc-line-ripple') protected lineRippleElement!: LineRipple|null;

  @query('mwc-notched-outline') protected outlineElement!: NotchedOutline|null;

  @query('.mdc-notched-outline__notch') protected notchElement!: HTMLElement;

  @property({type: String}) value = '';

  @property({type: String}) type: TextFieldType = 'text';

  @property({type: String}) placeholder = '';

  @property({type: String}) label = '';

  @property({type: String}) icon = '';

  @property({type: String}) iconTrailing = '';

  @property({type: Boolean, reflect: true}) disabled = false;

  @property({type: Boolean}) required = false;

  @property({type: Number}) minLength = -1;

  @property({type: Number}) maxLength = -1;

  @property({type: Boolean, reflect: true}) outlined = false;

  @property({type: Boolean, reflect: true}) fullWidth = false;

  @property({type: String}) helper = '';

  @property({type: Boolean}) validateOnInitialRender = false;

  @property({type: String}) validationMessage = '';

  @property({type: Boolean}) autoValidate = false;

  @property({type: String}) pattern = '';

  @property({type: Number}) min: number|string = '';

  @property({type: Number}) max: number|string = '';

  @property({type: Number}) step: number|null = null;

  @property({type: Number}) size: number|null = null;

  @property({type: Boolean}) helperPersistent = false;

  @property({type: Boolean}) charCounter = false;

  @property({type: Boolean}) endAligned = false;

  @property({type: String}) prefix = '';

  @property({type: String}) suffix = '';

  // lit-analyzer requires specific string types, but TS does not compile since
  // base class is unspecific "string". It also needs non-null coercion (!)
  // since we don't want to provide a default value, but the base class is not
  // typed to allow undefined.
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  @property({type: String}) inputMode!: TextFieldInputMode;

  @property({type: Boolean}) readOnly = false;

  @property({type: Boolean}) protected outlineOpen = false;
  @property({type: Number}) protected outlineWidth = 0;
  @property({type: Boolean}) protected isUiValid = true;

  protected _validity: ValidityState = createValidityObj();
  protected _outlineUpdateComplete: null|Promise<unknown> = null;

  get validity(): ValidityState {
    this._checkValidity(this.value);

    return this._validity;
  }

  get willValidate(): boolean {
    return this.formElement.willValidate;
  }

  get selectionStart(): number|null {
    return this.formElement.selectionStart;
  }

  get selectionEnd(): number|null {
    return this.formElement.selectionEnd;
  }

  protected get shouldRenderHelperText(): boolean {
    return !!this.helper || !!this.validationMessage || this.charCounterVisible;
  }

  protected get charCounterVisible(): boolean {
    return this.charCounter && this.maxLength !== -1;
  }

  validityTransform:
      ((value: string,
        nativeValidity: ValidityState) => Partial<ValidityState>)|null = null;

  focus() {
    const focusEvt = new CustomEvent('focus');
    this.formElement.dispatchEvent(focusEvt);
    this.formElement.focus();
  }

  blur() {
    const blurEvt = new CustomEvent('blur');
    this.formElement.dispatchEvent(blurEvt);
    this.formElement.blur();
  }

  select() {
    this.formElement.select();
  }

  setSelectionRange(
      selectionStart: number, selectionEnd: number,
      selectionDirection?: 'forward'|'backward'|'none') {
    this.formElement.setSelectionRange(
        selectionStart, selectionEnd, selectionDirection);
  }

  render() {
    const classes = {
      'mdc-text-field--disabled': this.disabled,
      'mdc-text-field--no-label': !this.label,
      'mdc-text-field--filled': !this.outlined,
      'mdc-text-field--outlined': this.outlined,
      'mdc-text-field--fullwidth': this.fullWidth,
      'mdc-text-field--with-leading-icon': this.icon,
      'mdc-text-field--with-trailing-icon': this.iconTrailing,
      'mdc-text-field--end-aligned': this.endAligned,
    };

    const ripple =
        !this.outlined ? html`<div class="mdc-text-field__ripple"></div>` : '';
    return html`
      <label class="mdc-text-field ${classMap(classes)}">
        ${ripple}
        ${this.icon ? this.renderIcon(this.icon) : ''}
        ${this.prefix ? this.renderAffix(this.prefix) : ''}
        ${this.renderInput()}
        ${this.suffix ? this.renderAffix(this.suffix, true) : ''}
        ${this.iconTrailing ? this.renderIcon(this.iconTrailing, true) : ''}
        ${this.outlined ? this.renderOutlined() : this.renderLabelText()}
      </label>
      ${this.renderHelperText(this.renderCharCounter())}
    `;
  }

  updated(changedProperties: PropertyValues) {
    if (changedProperties.has('value') &&
        changedProperties.get('value') !== undefined) {
      this.mdcFoundation.setValue(this.value);
    }
  }

  protected renderInput() {
    const minOrUndef = this.minLength === -1 ? undefined : this.minLength;
    const maxOrUndef = this.maxLength === -1 ? undefined : this.maxLength;
    // TODO: live() directive needs casting for lit-analyzer
    // https://github.com/runem/lit-analyzer/pull/91/files
    return html`
      <input
          aria-labelledby="label"
          class="mdc-text-field__input"
          type="${this.type}"
          .value="${live(this.value) as unknown as string}"
          ?disabled="${this.disabled}"
          placeholder="${this.placeholder}"
          ?required="${this.required}"
          ?readonly="${this.readOnly}"
          minlength="${ifDefined(minOrUndef)}"
          maxlength="${ifDefined(maxOrUndef)}"
          pattern="${ifDefined(this.pattern ? this.pattern : undefined)}"
          min="${ifDefined(this.min === '' ? undefined : this.min as number)}"
          max="${ifDefined(this.max === '' ? undefined : this.max as number)}"
          step="${ifDefined(this.step === null ? undefined : this.step)}"
          size="${ifDefined(this.size === null ? undefined : this.size)}"
          inputmode="${ifDefined(this.inputMode)}"
          @input="${this.handleInputChange}"
          @blur="${this.onInputBlur}">`;
  }

  protected renderAffix(content: string, isSuffix = false) {
    const classes = {
      'mdc-text-field__affix--prefix': !isSuffix,
      'mdc-text-field__affix--suffix': isSuffix
    };

    return html`<span class="mdc-text-field__affix ${classMap(classes)}">
        ${content}</span>`;
  }

  protected renderIcon(icon: string, isTrailingIcon = false) {
    const classes = {
      'mdc-text-field__icon--leading': !isTrailingIcon,
      'mdc-text-field__icon--trailing': isTrailingIcon
    };

    return html`<i class="material-icons mdc-text-field__icon ${
        classMap(classes)}">${icon}</i>`;
  }

  protected renderOutlined() {
    let labelTemplate: TemplateResult|string = '';
    if (this.label) {
      labelTemplate = html`
        <span
            .floatingLabelFoundation=${floatingLabel(this.label)}
            @labelchange=${this.onLabelChange}
            id="label">
          ${this.label}
        </span>
      `;
    }
    return html`
      <mwc-notched-outline
          .width=${this.outlineWidth}
          .open=${this.outlineOpen}
          class="mdc-notched-outline">
        ${labelTemplate}
      </mwc-notched-outline>`;
  }

  protected renderLabelText() {
    let labelTemplate: TemplateResult|string = '';
    if (this.label && !this.fullWidth) {
      labelTemplate = html`
      <span
          .floatingLabelFoundation=${floatingLabel(this.label)}
          id="label">
        ${this.label}
      </span>`;
    }

    return html`
      ${labelTemplate}
      <span .lineRippleFoundation=${lineRipple()}></span>
    `;
  }

  protected renderHelperText(charCounterTemplate?: TemplateResult) {
    if (!this.shouldRenderHelperText) {
      return undefined;
    }

    const showValidationMessage = this.validationMessage && !this.isUiValid;
    const classes = {
      'mdc-text-field-helper-text--persistent': this.helperPersistent,
      'mdc-text-field-helper-text--validation-msg': showValidationMessage,
    };

    return html`
      <div class="mdc-text-field-helper-line">
        <div class="mdc-text-field-helper-text ${classMap(classes)}">${
        showValidationMessage ? this.validationMessage : this.helper}</div>
        ${charCounterTemplate}
      </div>
    `;
  }

  protected renderCharCounter() {
    if (!this.charCounterVisible) {
      return undefined;
    }

    const length = Math.min(this.value.length, this.maxLength);
    return html`<span class="mdc-text-field-character-counter">${length} / ${
        this.maxLength}</span>`;
  }

  protected onInputBlur() {
    this.reportValidity();
  }

  checkValidity(): boolean {
    const isValid = this._checkValidity(this.value);

    if (!isValid) {
      const invalidEvent =
          new Event('invalid', {bubbles: false, cancelable: true});
      this.dispatchEvent(invalidEvent);
    }

    return isValid;
  }

  reportValidity(): boolean {
    const isValid = this.checkValidity();

    this.mdcFoundation.setValid(isValid);
    this.isUiValid = isValid;

    return isValid;
  }

  protected _checkValidity(value: string) {
    const nativeValidity = this.formElement.validity;

    let validity = createValidityObj(nativeValidity);

    if (this.validityTransform) {
      const customValidity = this.validityTransform(value, validity);
      validity = {...validity, ...customValidity};
      this.mdcFoundation.setUseNativeValidation(false);
    } else {
      this.mdcFoundation.setUseNativeValidation(true);
    }

    this._validity = validity;

    return this._validity.valid;
  }

  setCustomValidity(message: string) {
    this.validationMessage = message;
    this.formElement.setCustomValidity(message);
  }

  @eventOptions({passive: true})
  protected handleInputChange() {
    this.value = this.formElement.value;

    if (this.autoValidate) {
      this.reportValidity();
    }
  }

  protected createFoundation() {
    if (this.mdcFoundation !== undefined) {
      this.mdcFoundation.destroy();
    }
    this.mdcFoundation = new this.mdcFoundationClass(this.createAdapter());
    this.mdcFoundation.init();
  }

  protected createAdapter(): MDCTextFieldAdapter {
    return {
      ...this.getRootAdapterMethods(),
      ...this.getInputAdapterMethods(),
      ...this.getLabelAdapterMethods(),
      ...this.getLineRippleAdapterMethods(),
      ...this.getOutlineAdapterMethods(),
    };
  }

  protected getRootAdapterMethods(): MDCTextFieldRootAdapter {
    return {
      registerTextFieldInteractionHandler: (evtType, handler) =>
          this.addEventListener(evtType, handler),
      deregisterTextFieldInteractionHandler: (evtType, handler) =>
          this.removeEventListener(evtType, handler),
      registerValidationAttributeChangeHandler: (handler) => {
        const getAttributesList =
            (mutationsList: MutationRecord[]): string[] => {
              return mutationsList.map((mutation) => mutation.attributeName)
                         .filter((attributeName) => attributeName) as string[];
            };
        const observer = new MutationObserver((mutationsList) => {
          handler(getAttributesList(mutationsList));
        });
        const config = {attributes: true};
        observer.observe(this.formElement, config);
        return observer;
      },
      deregisterValidationAttributeChangeHandler:
          (observer: MutationObserver) => observer.disconnect(),
      ...addHasRemoveClass(this.mdcRoot),
    };
  }

  protected getInputAdapterMethods(): MDCTextFieldInputAdapter {
    return {
      getNativeInput: () => this.formElement,
      isFocused: () => this.shadowRoot ?
          this.shadowRoot.activeElement === this.formElement :
          false,
      registerInputInteractionHandler: (evtType, handler) =>
          this.formElement.addEventListener(
              evtType, handler, {passive: evtType in passiveEvents}),
      deregisterInputInteractionHandler: (evtType, handler) =>
          this.formElement.removeEventListener(evtType, handler),
    };
  }

  protected getLabelAdapterMethods(): MDCTextFieldLabelAdapter {
    return {
      floatLabel: (shouldFloat: boolean) => this.labelElement &&
          this.labelElement.floatingLabelFoundation.float(shouldFloat),
      getLabelWidth: () => {
        return this.labelElement ?
            this.labelElement.floatingLabelFoundation.getWidth() :
            0;
      },
      hasLabel: () => Boolean(this.labelElement),
      shakeLabel: (shouldShake: boolean) => this.labelElement &&
          this.labelElement.floatingLabelFoundation.shake(shouldShake),
    };
  }

  protected getLineRippleAdapterMethods(): MDCTextFieldLineRippleAdapter {
    return {
      activateLineRipple: () => {
        if (this.lineRippleElement) {
          this.lineRippleElement.lineRippleFoundation.activate();
        }
      },
      deactivateLineRipple: () => {
        if (this.lineRippleElement) {
          this.lineRippleElement.lineRippleFoundation.deactivate();
        }
      },
      setLineRippleTransformOrigin: (normalizedX: number) => {
        if (this.lineRippleElement) {
          this.lineRippleElement.lineRippleFoundation.setRippleCenter(
              normalizedX);
        }
      },
    };
  }

  async _getUpdateComplete() {
    await super._getUpdateComplete();
    await this._outlineUpdateComplete;
  }

  async firstUpdated() {
    const outlineElement = this.outlineElement;
    if (outlineElement) {
      this._outlineUpdateComplete = outlineElement.updateComplete;
      await this._outlineUpdateComplete;
    }

    super.firstUpdated();

    if (this.validateOnInitialRender) {
      this.reportValidity();
    }
  }

  protected getOutlineAdapterMethods(): MDCTextFieldOutlineAdapter {
    return {
      closeOutline: () => this.outlineElement && (this.outlineOpen = false),
      hasOutline: () => Boolean(this.outlineElement),
      notchOutline: (labelWidth) => {
        const outlineElement = this.outlineElement;
        if (outlineElement && !this.outlineOpen) {
          this.outlineWidth = labelWidth;
          this.outlineOpen = true;
        }
      }
    };
  }

  protected async onLabelChange() {
    if (this.label) {
      await this.layout();
    }
  }

  async layout() {
    await this.updateComplete;

    if (this.labelElement && this.outlineElement) {
      /* When the textfield automatically notches due to a value and label
       * being defined, the textfield may be set to `display: none` by the user.
       * this means that the notch is of size 0px. We provide this function so
       * that the user may manually resize the notch to the floated label's
       * width.
       */
      const labelWidth = this.labelElement.floatingLabelFoundation.getWidth();
      if (this.outlineOpen) {
        this.outlineWidth = labelWidth;
      }
    }
  }
}
