/**
@license
Copyright 2018 Google Inc. All Rights Reserved.

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
import { html, query, observer, property, Adapter, Foundation, customElement } from '@material/mwc-base/base-element.js';
import { FormElement, HTMLElementWithLineRipple } from '@material/mwc-base/form-element.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { style } from './mwc-textfield-css.js';
import { lineRipple } from '@material/mwc-line-ripple/line-ripple-directive';
import MDCTextfieldFoundation from '@material/textfield/foundation.js';

export interface TextfieldFoundation extends Foundation {
    setDisabled(value: boolean): void;
    setValue(value: string): void;
    setHelperTextContent(value: string): void;
}

export declare var TextfieldFoundation: {
    prototype: TextfieldFoundation;
    new(adapter: Adapter): TextfieldFoundation;
}

declare global {
    interface HTMLElementTagNameMap {
        'mwc-textfield': Textfield;
    }
}

@customElement('mwc-textfield' as any)
export class Textfield extends FormElement {

    @query('.mdc-textfield')
    protected mdcRoot!: HTMLElement;

    @query('input')
    protected formElement!: HTMLInputElement;

    @query('label')
    protected label!: HTMLLabelElement;

    @property({ type: String })
    @observer(function (this: Textfield, value: string) {
        this.mdcFoundation.setValue(value);
    })
    value = '';

    @property({ type: String })
    icon = '';

    @property({ type: Boolean })
    iconTrailing = false;

    @property({ type: Boolean })
    box = false;

    @property({ type: Boolean })
    outlined = false;

    @property({ type: Boolean })
    @observer(function (this: Textfield, value: boolean) {
        this.mdcFoundation.setDisabled(value);
    })
    disabled = false;

    @property({ type: Boolean })
    fullWidth = false;

    @property({ type: Boolean })
    required = false;

    @property({ type: String })
    @observer(function (this: Textfield, value: string) {
        this.mdcFoundation.setHelperTextContent(value);
    })
    helperText = '';

    @property({ type: String })
    placeHolder = '';

    @property({ type: String })
    type = '';

    protected mdcFoundation!: TextfieldFoundation;
    protected readonly mdcFoundationClass: typeof TextfieldFoundation = MDCTextfieldFoundation;

    protected createAdapter() {
        return {
            ...super.createAdapter(),
            addClass: () => { },
            removeClass: () => { },
            hasClass: () => { },
            registerInputInteractionHandler: (type: string, handler: EventListener) => {
                this.formElement.addEventListener(type, handler);
            },
            deregisterInputInteractionHandler: (type: string, handler: EventListener) => {
                this.formElement.removeEventListener(type, handler);
            },
            registerTextFieldInteractionHandler: (type: string, handler: EventListener) => {
                this.formElement.addEventListener(type, handler);
            },
            deregisterTextFieldInteractionHandler: (type: string, handler: EventListener) => {
                this.formElement.removeEventListener(type, handler);
            },
            registerInteractionHandler: (type: string, handler: EventListener) => {
                this.label.addEventListener(type, handler);
            },
            deregisterInteractionHandler: (type: string, handler: EventListener) => {
                this.label.removeEventListener(type, handler);
            },
            registerValidationAttributeChangeHandler: () => { },
            deregisterValidationAttributeChangeHandler: () => { },
            getNativeInput: () => {
                return this.formElement;
            },
            isFocused: () => { },
            isRtl: () => { },
            activateLineRipple: () => {
                if (this.lineRipple) {
                    this.lineRipple.activate();
                }
            },
            deactivateLineRipple: () => {
                if (this.lineRipple) {
                    this.lineRipple.deactivate();
                }
            },
            setLineRippleTransformOrigin: () => { },
            shakeLabel: () => { },
            floatLabel: () => { },
            hasLabel: () => { },
            getLabelWidth: () => { },
            hasOutline: () => { },
            notchOutline: () => { },
            closeOutline: () => { },
        }
    }

    renderStyle() {
        return style;
    }

    get lineRipple() {
        return this.rippleNode ? this.rippleNode.lineRipple : undefined;
    }

    @query('.mdc-line-ripple')
    protected rippleNode!: HTMLElementWithLineRipple;

    render() {
        const { value, label, box, outlined, disabled, icon, iconTrailing, fullWidth, required, placeHolder, helperText, type } = this;

        const hostClassInfo = {
            'mdc-text-field--with-leading-icon': icon && !iconTrailing,
            'mdc-text-field--with-trailing-icon': icon && iconTrailing,
            'mdc-text-field--box': !fullWidth && box,
            'mdc-text-field--outlined': !fullWidth && outlined,
            'mdc-text-field--disabled': disabled,
            'mdc-text-field--fullwidth': fullWidth,
        };

        return html`
            ${this.renderStyle()}
            <div class="mdc-text-field mdc-text-field--upgraded ${classMap(hostClassInfo)}">
                ${this._renderIcon({ icon, fullWidth })}
                ${this._renderInput({ value, required, type, placeHolder, label })}
                ${this._renderLabel({ label, value, fullWidth })}
                ${this._renderSVG({ fullWidth, outlined })}
            </div>
            ${this._renderHelperText({ helperText })}
        `;
    }

    _renderIcon({ icon, fullWidth }) {
        return !fullWidth && icon
            ? html`<i class="material-icons mdc-text-field__icon" tabindex="0">${icon}</i>`
            : '';
    }

    _renderInput({ value, required, type, placeHolder, label }) {
        return html`<input type="${type}" placeholder="${placeHolder}" ?required="${required}" class="mdc-text-field__input ${value ? 'mdc-text-field--upgraded' : ''}" id="text-field" .value="${value}" aria-label="${label}">`;
    }

    _renderLabel({ label, value, fullWidth }) {
        return !fullWidth && label
            ? html`<label class="mdc-floating-label ${value ? 'mdc-floating-label--float-above' : ''} for=" text-field">${label}</label>`
            : '';
    }

    _renderSVG({ outlined, fullWidth }) {
        return !fullWidth && outlined
            ? html`
                <div class="mdc-notched-outline">
                    <svg><path class="mdc-notched-outline__path" /></svg>
                </div>
                <div class="mdc-notched-outline__idle"></div>
            `
            : html`<div class="mdc-line-ripple" .lineRipple="${lineRipple({})}"></div>`;
    }

    _renderHelperText({ helperText }) {
        return helperText
            ? html`<p class="mdc-text-field-helper-text" aria-hidden="true">${helperText}</p>`
            : '';
    }

}
