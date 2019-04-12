import { BaseElement, html, property, query, queryAll, customElement, addHasRemoveClass } from '@material/mwc-base/base-element.js';
import { classMap } from 'lit-html/directives/class-map.js';
import '@material/mwc-icon/mwc-icon-font.js';
import {ripple} from '@material/mwc-ripple/ripple-directive.js';

import MDCTextFieldFoundation from '@material/textfield/foundation.js';
import { MDCTextFieldAdapter } from '@material/textfield/adapter.js';

import { MDCLineRipple, MDCLineRippleFoundation } from '@material/line-ripple/index';
import { MDCTextFieldHelperText, MDCTextFieldHelperTextFoundation } from '@material/textfield/helper-text/index';
import { MDCTextFieldIcon, MDCTextFieldIconFoundation } from '@material/textfield/icon/index';
import { MDCFloatingLabel, MDCFloatingLabelFoundation } from '@material/floating-label/index';
import { MDCNotchedOutline, MDCNotchedOutlineFoundation } from '@material/notched-outline/index';
import { style } from './mwc-textfield-css';

declare global {
    interface HTMLElementTagNameMap {
        'mwc-textfield': TextField;
    }
}

const {
  INPUT_SELECTOR,
  LABEL_SELECTOR,
  LINE_RIPPLE_SELECTOR,
  OUTLINE_SELECTOR,
  ICON_SELECTOR,
  ARIA_CONTROLS
} = MDCTextFieldFoundation.strings;

const {
  WITH_LEADING_ICON,
  TEXTAREA,
  OUTLINED
} = MDCTextFieldFoundation.cssClasses;

@customElement('mwc-textfield' as any)
export class TextField extends BaseElement {
    @query('.mdc-text-field')
    protected mdcRoot!: HTMLElement;

    @query(INPUT_SELECTOR)
    protected inputSelector!: HTMLInputElement;

    @query(LABEL_SELECTOR)
    protected labelSelector!: HTMLElement;

    @query(LINE_RIPPLE_SELECTOR)
    protected lineRippleSelector!: HTMLElement;

    @query(OUTLINE_SELECTOR)
    protected outlineSelector!: HTMLElement;

    @queryAll(ICON_SELECTOR)
    protected iconSelector!: HTMLElement[];

    @property({ type: String })
    label = ''

    @property({ type: String, reflect: true })
    value = ''

    @property({ type: String })
    icon = ''

    @property({ type: Boolean })
    iconTrailing = false

    @property({ type: Boolean })
    box = false

    @property({ type: Boolean })
    outlined = false

    @property({ type: Boolean })
    disabled = false

    @property({ type: Boolean })
    fullWidth = false

    @property({ type: Boolean })
    required = false

    @property({ type: String })
    helperText = ''

    @property({ type: String })
    placeHolder = ''

    @property({ type: String })
    type = ''

    @property()
    lineRipple_

    @property()
    helperText_

    @property()
    leadingIcon_

    @property()
    trailingIcon_

    @property()
    label_

    @property()
    outline_

    protected mdcFoundationClass = MDCTextFieldFoundation;

    protected mdcFoundation!: MDCTextFieldFoundation;

    static styles = style;

    // TODO(sorvell) #css: styling for fullwidth
    render() {
        const {value, label, box, outlined, disabled, icon, iconTrailing, fullWidth, required, placeHolder, helperText, type} = this;
        const hostClassInfo = {
            'mdc-text-field--with-leading-icon': icon && !iconTrailing,
            'mdc-text-field--with-trailing-icon': icon && iconTrailing,
            'mdc-text-field--box': !fullWidth && box,
            'mdc-text-field--outlined': !fullWidth && outlined,
            'mdc-text-field--disabled': disabled,
            'mdc-text-field--fullwidth': fullWidth,
        };
    return html`
        <div class="mdc-text-field mdc-text-field--upgraded ${classMap(hostClassInfo)}">
            ${!fullWidth && icon ? html`<i class="material-icons mdc-text-field__icon" tabindex="0">${icon}</i>` : ''}
            ${this._renderInput({value, required, type, placeHolder, label})}
            ${!fullWidth ? html`<label class="mdc-floating-label ${value ? 'mdc-floating-label--float-above' : ''}" for="text-field">${label}</label>` : ''}
            ${!fullWidth && outlined ? 
                html`<div class="mdc-notched-outline">
                        <svg><path class="mdc-notched-outline__path"/></svg>
                    </div>
                    <div class="mdc-notched-outline__idle"></div>` : 
                html`<div class="mdc-line-ripple"></div>`
            }
        </div>
        ${helperText ? html`<p class="mdc-text-field-helper-text" aria-hidden="true">${helperText}</p>` : ''}`;
    }

    _renderInput({value, required, type, placeHolder, label}) {
        return html`<input .ripple="${ripple({unbounded: false})}" type="${type}" placeholder="${placeHolder}" ?required="${required}" class="mdc-text-field__input ${value ? 'mdc-text-field--upgraded' : ''}" id="text-field" .value="${value}" aria-label="${label}">`;
    }

    protected createAdapter(): MDCTextFieldAdapter {
        //I still haven't found a better way to initialize factories.
        this.initFactories()

        return {
            ...addHasRemoveClass(this.mdcRoot),
            registerTextFieldInteractionHandler: (evtType, handler) => this.mdcRoot.addEventListener(evtType, handler),
            deregisterTextFieldInteractionHandler: (evtType, handler) => this.mdcRoot.removeEventListener(evtType, handler),
            registerValidationAttributeChangeHandler: (handler) => {
                const getAttributesList = (mutationsList) => mutationsList.map((mutation) => mutation.attributeName);
                const observer = new MutationObserver((mutationsList) => handler(getAttributesList(mutationsList)));
                const targetNode = this.inputSelector;
                const config = { attributes: true };
                observer.observe(targetNode, config);
                return observer;
            },
            deregisterValidationAttributeChangeHandler: (observer) => observer.disconnect(),
            isFocused: () => document.activeElement === this.inputSelector,
            isRtl: () => window.getComputedStyle(this.mdcRoot).getPropertyValue('direction') === 'rtl',

            shakeLabel: (shouldShake) => this.label_.shake(shouldShake),
            floatLabel: (shouldFloat) => this.label_.float(shouldFloat),
            hasLabel: () => !!this.label_,
            getLabelWidth: () => {
                if (this.label_.getWidth() === 0) return -12;
                return this.label_.getWidth()
            },

            activateLineRipple: () => {
                if (this.lineRipple_) {
                    this.lineRipple_.activate();
                }
            },
            deactivateLineRipple: () => {
                if (this.lineRipple_) {
                    this.lineRipple_.deactivate();
                }
            },
            setLineRippleTransformOrigin: (normalizedX) => {
                if (this.lineRipple_) {
                    this.lineRipple_.setRippleCenter(normalizedX);
                }
            },

            notchOutline: (labelWidth, isRtl) => this.outline_.notch(labelWidth, isRtl),
            closeOutline: () => this.outline_.closeNotch(),
            hasOutline: () => !!this.outline_,

            registerInputInteractionHandler: (evtType, handler) => this.inputSelector.addEventListener(evtType, handler),
            deregisterInputInteractionHandler: (evtType, handler) => this.inputSelector.removeEventListener(evtType, handler),
            getNativeInput: () => this.inputSelector,

            helperText: this.helperText_ ? this.helperText_.foundation : undefined,
            leadingIcon: this.leadingIcon_ ? this.leadingIcon_.foundation : undefined,
            trailingIcon: this.trailingIcon_ ? this.trailingIcon_.foundation : undefined
        }
    }

    initFactories(
        lineRippleFactory = (el) => new MDCLineRipple(el),
        helperTextFactory = (el) => new MDCTextFieldHelperText(el),
        iconFactory = (el) => new MDCTextFieldIcon(el),
        labelFactory = (el) => new MDCFloatingLabel(el),
        outlineFactory = (el) => new MDCNotchedOutline(el)) {

        const labelElement = this.labelSelector;
        if (labelElement) {
            this.label_ = labelFactory(labelElement);
        }
        const lineRippleElement = this.lineRippleSelector;
        if (lineRippleElement) {
            this.lineRipple_ = lineRippleFactory(lineRippleElement);
        }
        const outlineElement = this.outlineSelector;
        if (outlineElement) {
            this.outline_ = outlineFactory(outlineElement);
        }
        if (this.inputSelector.hasAttribute(ARIA_CONTROLS)) {
            const helperTextElement = document.getElementById(this.inputSelector.getAttribute(ARIA_CONTROLS) || '');
            if (helperTextElement) {
                this.helperText_ = helperTextFactory(helperTextElement);
            }
        }

        const iconElements = this.iconSelector;
        if (iconElements.length > 0) {
            if (iconElements.length > 1) { // Has both icons.
                this.leadingIcon_ = iconFactory(iconElements[0]);
                this.trailingIcon_ = iconFactory(iconElements[1]);
            } else {
                if (this.mdcRoot.classList.contains(WITH_LEADING_ICON)) {
                    this.leadingIcon_ = iconFactory(iconElements[0]);
                } else {
                    this.trailingIcon_ = iconFactory(iconElements[0]);
                }
            }
        }
    }
}