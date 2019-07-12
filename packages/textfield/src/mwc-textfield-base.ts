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
import {FormElement, html, query, property, classMap, addHasRemoveClass} from '@material/mwc-base/form-element.js';
import MDCTextFieldFoundation from '@material/textfield/foundation.js';
import {MDCTextFieldAdapter} from '@material/textfield/adapter.js';
import {MDCFloatingLabel} from '@material/floating-label';
import {MDCLineRipple} from '@material/line-ripple';
import {MDCNotchedOutline} from '@material/notched-outline';
import {MDCTextFieldCharacterCounter} from '@material/textfield/character-counter';

const passiveEvents = ['touchstart', 'touchmove', 'scroll', 'mousewheel'];

export abstract class TextFieldBase extends FormElement {
  protected mdcFoundation!: MDCTextFieldFoundation;

  protected readonly mdcFoundationClass = MDCTextFieldFoundation;

  @query('.mdc-text-field')
  protected mdcRoot!: HTMLElement;

  @query('input')
  protected formElement!: HTMLInputElement;

  @query('.mdc-floating-label')
  protected labelElement!: HTMLLabelElement;

  @query('.mdc-line-ripple')
  protected lineRippleElement!: HTMLElement;

  @query('.mdc-notched-outline')
  protected outlineElement!: HTMLElement;

  @query('.mdc-text-field-character-counter')
  protected charCounterElement!: HTMLElement;

  @property()
  value = '';

  @property()
  type = 'text';

  @property()
  placeholder = '';

  @property()
  label = '';

  @property()
  icon = '';

  @property()
  iconTrailing = '';

  @property({type: Boolean, reflect: true})
  disabled = false;

  @property({type: Boolean})
  required = false;

  @property({type: Number})
  maxlength = -1;

  @property({type: Boolean, reflect: true})
  outlined = false;

  @property({type: Boolean, reflect: true})
  fullWidth = false;

  @property()
  helper = '';

  @property({type: Boolean})
  helperPersistent = false;

  @property({type: Boolean})
  charCounter = false;

  private _floatingLabel!: MDCFloatingLabel | null;
  private _lineRipple!: MDCLineRipple | null;
  private _outline!: MDCNotchedOutline | null;
  private _characterCounter!: MDCTextFieldCharacterCounter | null;

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
      <label class="mdc-text-field ${classMap(classes)}">
        ${this.icon ? this.renderIcon(this.icon) : ''}
        ${this.renderInput()}
        ${this.iconTrailing ? this.renderIcon(this.iconTrailing) : ''}
        ${this.outlined ? this.renderOutlined() : this.renderLabelText()}
      </label>
      ${(this.helper || this.charCounter) ? this.renderHelperText() : ''}
    `;
  }

  protected renderInput() {
    return html`
      <input id="text-field"
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
    return html`
      <div class="mdc-notched-outline">
        <div class="mdc-notched-outline__leading"></div>
        ${this.label ? html`<div class="mdc-notched-outline__notch">
          <span class="mdc-floating-label">${this.label}</span>
        </div>` : ''}
        <div class="mdc-notched-outline__trailing"></div>
      </div>`;
  }

  protected renderLabelText() {
    return html`
      ${this.label && !this.fullWidth ? html`<span class="mdc-floating-label">${this.label}</span>` : ''}
      <div class="mdc-line-ripple"></div>
    `;
  }

  protected renderHelperText() {
    const classes = {
      'mdc-text-field-helper-text--persistent': this.helperPersistent,
    };
    return html`
      <div class="mdc-text-field-helper-line">
        <div class="mdc-text-field-helper-text ${classMap(classes)}">${this.helper}</div>
        ${this.charCounter ? html`<div class="mdc-text-field-character-counter"></div>` : ''}
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
    this._characterCounter = this.charCounterElement ? new MDCTextFieldCharacterCounter(this.charCounterElement) : null;
    this.mdcFoundation = new this.mdcFoundationClass(this.createAdapter(), {
      characterCounter: this._characterCounter ? this._characterCounter.foundation : undefined
    });
    this.mdcFoundation.init();
  }

  protected createAdapter(): MDCTextFieldAdapter {
    this._floatingLabel = this.labelElement ? new MDCFloatingLabel(this.labelElement) : null;
    this._lineRipple = this.lineRippleElement ? new MDCLineRipple(this.lineRippleElement) : null;
    this._outline = this.outlineElement ? new MDCNotchedOutline(this.outlineElement) : null;
    return {
      ...addHasRemoveClass(this.mdcRoot),
      ...this.getRootAdapterMethods(),
      ...this.getInputAdapterMethods(),
      ...this.getLabelAdapterMethods(),
      ...this.getLineRippleAdapterMethods(),
      ...this.getOutlineAdapterMethods(),
    };
  }

  private getRootAdapterMethods() {
    return {
      registerTextFieldInteractionHandler: (evtType: string,
          handler: any) => this.addEventListener(evtType, handler),
      deregisterTextFieldInteractionHandler: (evtType: string,
          handler: any) => this.removeEventListener(evtType, handler),
      registerValidationAttributeChangeHandler: (handler: any) => {
        const getAttributesList = (mutationsList: MutationRecord[]): string[] => {
          return mutationsList
              .map((mutation) => mutation.attributeName)
              .filter((attributeName) => attributeName) as string[];
        };
        const observer = new MutationObserver((mutationsList) => handler(getAttributesList(mutationsList)));
        const config = {attributes: true};
        observer.observe(this.formElement, config);
        return observer;
      },
      deregisterValidationAttributeChangeHandler: (observer: MutationObserver) => observer.disconnect(),
    };
  }

  private getInputAdapterMethods() {
    return {
      getNativeInput: () => this.formElement,
      isFocused: () => this.shadowRoot!.activeElement === this.formElement,
      registerInputInteractionHandler: (evtType: string,
          handler: any) => this.formElement.addEventListener(evtType, handler, {passive: evtType in passiveEvents}),
      deregisterInputInteractionHandler: (evtType: string,
          handler: any) => this.formElement.removeEventListener(evtType, handler),
    };
  }

  private getLabelAdapterMethods() {
    return {
      floatLabel: (shouldFloat: boolean) => this._floatingLabel && this._floatingLabel.float(shouldFloat),
      getLabelWidth: () => this._floatingLabel ? this._floatingLabel.getWidth() : 0,
      hasLabel: () => Boolean(this._floatingLabel),
      shakeLabel: (shouldShake: boolean) => this._floatingLabel && this._floatingLabel.shake(shouldShake),
    };
  }

  private getLineRippleAdapterMethods() {
    return {
      activateLineRipple: () => {
        if (this._lineRipple) {
          this._lineRipple.activate();
        }
      },
      deactivateLineRipple: () => {
        if (this._lineRipple) {
          this._lineRipple.deactivate();
        }
      },
      setLineRippleTransformOrigin: (normalizedX: number) => {
        if (this._lineRipple) {
          this._lineRipple.setRippleCenter(normalizedX);
        }
      },
    };
  }

  private getOutlineAdapterMethods() {
    return {
      closeOutline: () => this._outline && this._outline.closeNotch(),
      hasOutline: () => Boolean(this._outline),
      notchOutline: (labelWidth: number) => this._outline && this._outline.notch(labelWidth),
    };
  }
}
