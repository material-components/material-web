/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore


import {TextAreaCharCounter, TextFieldBase, TextFieldInputMode, TextFieldType} from '@material/mwc-textfield/mwc-textfield-base';
import {ComplexAttributeConverter, html, TemplateResult} from 'lit';
import {property, query} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {ifDefined} from 'lit/directives/if-defined.js';
import {live} from 'lit/directives/live.js';

export {TextAreaCharCounter, TextFieldInputMode, TextFieldType};

const booleanOrStringConverter: ComplexAttributeConverter<boolean|string> = {
  fromAttribute(value) {
    if (value === null) {
      return false;
    } else if (value === '') {
      return true;
    }

    return value;
  },
  toAttribute(value) {
    if (typeof value === 'boolean') {
      return value ? '' : null;
    }

    return value;
  }
};

/** @soyCompatible */
export abstract class TextAreaBase extends TextFieldBase {
  @query('textarea') protected override formElement!: HTMLInputElement;

  @property({type: Number}) rows = 2;

  @property({type: Number}) cols = 20;

  @property({converter: booleanOrStringConverter})
  override charCounter: boolean|TextAreaCharCounter = false;

  /** @soyTemplate */
  override render(): TemplateResult {
    const shouldRenderCharCounter = this.charCounter && this.maxLength !== -1;
    const shouldRenderInternalCharCounter =
        shouldRenderCharCounter && this.charCounter === 'internal';
    const shouldRenderExternalCharCounter =
        shouldRenderCharCounter && !shouldRenderInternalCharCounter;
    const shouldRenderHelperText = !!this.helper || !!this.validationMessage ||
        shouldRenderExternalCharCounter;

    /** @classMap */
    const classes = {
      'mdc-text-field--disabled': this.disabled,
      'mdc-text-field--no-label': !this.label,
      'mdc-text-field--filled': !this.outlined,
      'mdc-text-field--outlined': this.outlined,
      'mdc-text-field--end-aligned': this.endAligned,
      'mdc-text-field--with-internal-counter': shouldRenderInternalCharCounter,
    };

    return html`
      <label class="mdc-text-field mdc-text-field--textarea ${
        classMap(classes)}">
        ${this.renderRipple()}
        ${this.outlined ? this.renderOutline() : this.renderLabel()}
        ${this.renderInput()}
        ${this.renderCharCounter(shouldRenderInternalCharCounter)}
        ${this.renderLineRipple()}
      </label>
      ${
        this.renderHelperText(
            shouldRenderHelperText, shouldRenderExternalCharCounter)}
    `;
  }

  /** @soyTemplate */
  protected override renderInput(): TemplateResult {
    const ariaLabelledbyOrUndef = !!this.label ? 'label' : undefined;
    const minOrUndef = this.minLength === -1 ? undefined : this.minLength;
    const maxOrUndef = this.maxLength === -1 ? undefined : this.maxLength;
    const autocapitalizeOrUndef = this.autocapitalize ?
        (this.autocapitalize as 'off' | 'none' | 'on' | 'sentences' | 'words' |
         'characters' | 'off' | 'none' | 'on' | 'sentences' | 'words' |
         'characters') :
        undefined;

    return html`
      <textarea
          aria-labelledby=${ifDefined(ariaLabelledbyOrUndef)}
          class="mdc-text-field__input"
          .value="${live(this.value) as unknown as string}"
          rows="${this.rows}"
          cols="${this.cols}"
          ?disabled="${this.disabled}"
          placeholder="${this.placeholder}"
          ?required="${this.required}"
          ?readonly="${this.readOnly}"
          minlength="${ifDefined(minOrUndef)}"
          maxlength="${ifDefined(maxOrUndef)}"
          name="${ifDefined(this.name === '' ? undefined : this.name)}"
          inputmode="${ifDefined(this.inputMode)}"
          autocapitalize="${ifDefined(autocapitalizeOrUndef)}"
          @input="${this.handleInputChange}"
          @blur="${this.onInputBlur}">
      </textarea>`;
  }
}
