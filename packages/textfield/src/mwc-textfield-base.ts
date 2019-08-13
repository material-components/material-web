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

import {addHasRemoveClass, classMap, FormElement, html, property, query, TemplateResult} from '@material/mwc-base/form-element.js';
import {floatingLabel, FloatingLabel} from '@material/mwc-floating-label/mwc-floating-label-directive';
import {lineRipple, LineRipple} from '@material/mwc-line-ripple/mwc-line-ripple-directive.js';
import {NotchedOutline} from '@material/mwc-notched-outline';
import {MDCTextFieldAdapter, MDCTextFieldInputAdapter, MDCTextFieldLabelAdapter, MDCTextFieldLineRippleAdapter, MDCTextFieldOutlineAdapter, MDCTextFieldRootAdapter} from '@material/textfield/adapter.js';
import MDCTextFieldFoundation from '@material/textfield/foundation.js';

import {characterCounter, CharacterCounter} from './character-counter/mwc-character-counter-directive.js';

const passiveEvents = ['touchstart', 'touchmove', 'scroll', 'mousewheel'];

export abstract class TextFieldBase extends FormElement {
  protected mdcFoundation!: MDCTextFieldFoundation;

  protected readonly mdcFoundationClass = MDCTextFieldFoundation;

  @query('.mdc-text-field') protected mdcRoot!: HTMLElement;

  @query('input') protected formElement!: HTMLInputElement;

  @query('.mdc-floating-label') protected labelElement!: FloatingLabel|null;

  @query('.mdc-line-ripple') protected lineRippleElement!: LineRipple|null;

  @query('mwc-notched-outline') protected outlineElement!: NotchedOutline|null;

  @query('.mdc-notched-outline__notch') protected notchElement!: HTMLElement;

  @query('.mdc-text-field-character-counter')
  protected charCounterElement!: CharacterCounter;

  @property() value = '';

  @property() type = 'text';

  @property() placeholder = '';

  @property() label = '';

  @property() icon = '';

  @property() iconTrailing = '';

  @property({type: Boolean, reflect: true}) disabled = false;

  @property({type: Boolean}) required = false;

  @property({type: Number}) maxlength = -1;

  @property({type: Boolean, reflect: true}) outlined = false;

  @property({type: Boolean, reflect: true}) fullWidth = false;

  @property() helper = '';

  @property({type: Boolean}) helperPersistent = false;

  @property({type: Boolean}) charCounter = false;

  @property({type: Boolean}) protected outlineOpen = false;
  @property({type: Number}) protected outlineWidth = 0;

  render() {
    const classes = {
      'mdc-text-field--disabled': this.disabled,
      'mdc-text-field--no-label': !this.label,
      'mdc-text-field--outlined': this.outlined,
      'mdc-text-field--fullwidth': this.fullWidth,
      'mdc-text-field--with-leading-icon': this.icon,
      'mdc-text-field--with-trailing-icon': this.iconTrailing,
    };
    return html`
      <div class="mdc-text-field ${classMap(classes)}">
        ${this.icon ? this.renderIcon(this.icon) : ''}
        ${this.renderInput()}
        ${this.iconTrailing ? this.renderIcon(this.iconTrailing) : ''}
        ${this.outlined ? this.renderOutlined() : this.renderLabelText()}
      </div>
      ${(this.helper || this.charCounter) ? this.renderHelperText() : ''}
    `;
  }

  protected renderInput() {
    return html`
      <input
          id="text-field"
          class="mdc-text-field__input"
          type="${this.type}"
          .value="${this.value}"
          ?disabled="${this.disabled}"
          placeholder="${this.placeholder}"
          ?required="${this.required}"
          maxlength="${this.maxlength}"
          @change="${this.handleInputChange}">`;
  }

  protected renderIcon(icon: String) {
    return html`<i class="material-icons mdc-text-field__icon">${icon}</i>`;
  }

  protected renderOutlined() {
    let labelTemplate: TemplateResult|string = '';
    if (this.label) {
      labelTemplate = html`
        <label .foundation=${floatingLabel()} for="text-field">
          ${this.label}
        </label>
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
      <label .foundation=${floatingLabel()} for="text-field">
        ${this.label}
      </label>`;
    }

    return html`
      ${labelTemplate}
      <div .foundation=${lineRipple()}></div>
    `;
  }

  protected renderHelperText() {
    const classes = {
      'mdc-text-field-helper-text--persistent': this.helperPersistent,
    };

    let charCounterTemplate: TemplateResult|string = '';
    if (this.charCounter) {
      charCounterTemplate = html`<div .foundation=${characterCounter()}></div>`;
    }
    return html`
      <div class="mdc-text-field-helper-line">
        <div class="mdc-text-field-helper-text ${classMap(classes)}">
          ${this.helper}
        </div>
        ${charCounterTemplate}
      </div>
    `;
  }

  protected handleInputChange() {
    this.value = this.formElement.value;
  }

  protected createFoundation() {
    if (this.mdcFoundation !== undefined) {
      this.mdcFoundation.destroy();
    }
    this.mdcFoundation = new this.mdcFoundationClass(this.createAdapter(), {
      characterCounter: this.charCounterElement ?
          this.charCounterElement.foundation :
          undefined
    });
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
      registerTextFieldInteractionHandler: (evtType: string, handler: any) =>
          this.addEventListener(evtType, handler),
      deregisterTextFieldInteractionHandler: (evtType: string, handler: any) =>
          this.removeEventListener(evtType, handler),
      registerValidationAttributeChangeHandler: (handler: any) => {
        const getAttributesList =
            (mutationsList: MutationRecord[]): string[] => {
              return mutationsList.map((mutation) => mutation.attributeName)
                         .filter((attributeName) => attributeName) as string[];
            };
        const observer = new MutationObserver(
            (mutationsList) => handler(getAttributesList(mutationsList)));
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
      isFocused: () => this.shadowRoot!.activeElement === this.formElement,
      registerInputInteractionHandler: (evtType: string, handler: any) =>
          this.formElement.addEventListener(
              evtType, handler, {passive: evtType in passiveEvents}),
      deregisterInputInteractionHandler: (evtType: string, handler: any) =>
          this.formElement.removeEventListener(evtType, handler),
    };
  }

  protected getLabelAdapterMethods(): MDCTextFieldLabelAdapter {
    return {
      floatLabel: (shouldFloat: boolean) =>
          this.labelElement && this.labelElement.foundation.float(shouldFloat),
      getLabelWidth: () => {
        return this.labelElement ? this.labelElement.foundation.getWidth() : 0;
      },
      hasLabel: () => Boolean(this.labelElement),
      shakeLabel: (shouldShake: boolean) =>
          this.labelElement && this.labelElement.foundation.shake(shouldShake),
    };
  }

  protected getLineRippleAdapterMethods(): MDCTextFieldLineRippleAdapter {
    return {
      activateLineRipple: () => {
        if (this.lineRippleElement) {
          this.lineRippleElement.foundation.activate();
        }
      },
      deactivateLineRipple: () => {
        if (this.lineRippleElement) {
          this.lineRippleElement.foundation.deactivate();
        }
      },
      setLineRippleTransformOrigin: (normalizedX: number) => {
        if (this.lineRippleElement) {
          this.lineRippleElement.foundation.setRippleCenter(normalizedX);
        }
      },
    };
  }

  async firstUpdated() {
    const outlineElement = this.outlineElement;
    if (outlineElement) {
      await outlineElement.updateComplete;
    }
    super.firstUpdated();
  }

  protected getOutlineAdapterMethods(): MDCTextFieldOutlineAdapter {
    return {
      closeOutline: () => this.outlineElement && (this.outlineOpen = false),
      hasOutline: () => Boolean(this.outlineElement),
      notchOutline: (labelWidth) => {
        const outlineElement = this.outlineElement;
        if (outlineElement) {
          this.outlineWidth = labelWidth;
          this.outlineOpen = true;
        }
      }
    };
  }
}
