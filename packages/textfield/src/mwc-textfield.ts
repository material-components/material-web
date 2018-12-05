import {BaseElement, html, property, query, queryAll, customElement, Adapter, Foundation} from '@material/mwc-base/base-element.js';
import {classMap} from 'lit-html/directives/class-map.js';
import '@material/mwc-icon/mwc-icon-font.js';

import MDCTextFieldFoundation from '@material/textfield/foundation.js';
import {MDCLineRipple, MDCLineRippleFoundation} from '@material/line-ripple/index';
import {MDCTextFieldHelperText, MDCTextFieldHelperTextFoundation} from '@material/textfield/helper-text/index';
import {MDCTextFieldIcon, MDCTextFieldIconFoundation} from '@material/textfield/icon/index';
import {MDCFloatingLabel, MDCFloatingLabelFoundation} from '@material/floating-label/index';
import {MDCNotchedOutline, MDCNotchedOutlineFoundation} from '@material/notched-outline/index';
import { style } from './mwc-textfield-css';

//Imports for rippleFactory, was unabale to get it working
// import {MDCRipple, MDCRippleFoundation, RippleCapableSurface} from '@material/ripple/index';
// import {getMatchesProperty} from '@material/ripple/util';

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

export interface TextFieldFoundation extends Foundation {
  handleTextFieldInteraction(): void;
  handleValidationAttributeChange(value: string[]): void;
  notchOutline(value: boolean): void;
  activateFocus(): void;
  setTransformOrigin(value: any): void;
  autoCompleteFocus(): void;
  deactivateFocus(): void;
  getValue(): string;
  setValue(value: string): void;
  isValid(): boolean;
  setValid(value: boolean): void;
  setUseNativeValidation(value: boolean): void;
  isDisabled(): boolean;
  setDisabled(value: boolean): void;
  setHelperTextContent(value: string): void;
  setLeadingIconAriaLabel(value: string): void;
  setLeadingIconContent(value: string): void;
  setTrailingIconAriaLabel(value: string): void;
  setTrailingIconContent(value: string): void;
}

export declare var TextFieldFoundation: {
  prototype: TextFieldFoundation;
  new (adapter: Adapter): TextFieldFoundation;
}

@customElement('mwc-textfield' as any)
export class TextField extends BaseElement {
  protected mdcFoundation!: TextFieldFoundation;

  protected readonly mdcFoundationClass: typeof TextFieldFoundation = MDCTextFieldFoundation;

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

  @property({type: String})
  label = ''

  @property({type: String, reflect: true})
  value = ''

  @property({type: String})
  icon = ''

  @property({type: Boolean})
  iconTrailing = false

  @property({type: Boolean})
  box = false

  @property({type: Boolean})
  outlined = false

  @property({type: Boolean})
  disabled = false

  @property({type: Boolean})
  fullWidth = false

  @property({type: Boolean})
  required = false

  @property({type: String})
  helperText = ''

  @property({type: String})
  placeHolder = ''

  @property({type: String})
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

  render() {
    const classes = {
      'mdc-text-field--with-leading-icon': this.icon && !this.iconTrailing,
      'mdc-text-field--with-trailing-icon': this.icon && this.iconTrailing,
      'mdc-text-field--box': this.box,
      'mdc-text-field--outlined': !this.fullWidth && this.outlined,
      'mdc-text-field--disabled': this.disabled,
      'mdc-text-field--fullwidth': this.fullWidth,
    };
    return html`
      ${this.renderStyle()}
      <div class="mdc-text-field mdc-text-field--upgraded ${classMap(classes)}">
        ${!this.fullWidth && this.icon ? html`<i class="material-icons mdc-text-field__icon" tabindex="0">${this.icon}</i>` : ''}
        ${this._renderInput(this.value, this.required, this.type, this.placeHolder, this.label)}
        ${!this.fullWidth ? html`<label class="mdc-floating-label ${this.value ? 'mdc-floating-label--float-above' : ''}" for="text-field">${this.label}</label>` : ''}
        ${!this.fullWidth && this.outlined ? html`<div class="mdc-notched-outline">
            <svg><path class="mdc-notched-outline__path"/></svg>
          </div>
          <div class="mdc-notched-outline__idle"></div>` :
    html`<div class="mdc-line-ripple"></div>`}
      </div>
      ${this.helperText ? html`<p class="mdc-text-field-helper-text" aria-hidden="true">${this.helperText}</p>` : ''}`;
  }

  renderStyle() {
    return style;
  }
  
  _renderInput(value, required, type, placeHolder, label) {
    return html`<input type="${type}" placeholder="${placeHolder}" ?required="${required}" class="mdc-text-field__input ${value ? 'mdc-text-field--upgraded' : ''}" id="text-field" .value="${value}" aria-label="${label}">`;
  }

  protected createAdapter() {

    //Replaces previous method of hooking into the initialization method of the component-element class
    this.initFactories();
    
    return {
      ...super.createAdapter(),
      registerTextFieldInteractionHandler: (evtType, handler) => this.mdcRoot.addEventListener(evtType, handler),
      deregisterTextFieldInteractionHandler: (evtType, handler) => this.mdcRoot.removeEventListener(evtType, handler),
      registerValidationAttributeChangeHandler: (handler) => {
        const getAttributesList = (mutationsList) => mutationsList.map((mutation) => mutation.attributeName);
        const observer = new MutationObserver((mutationsList) => handler(getAttributesList(mutationsList)));
        const targetNode = this.inputSelector;
        const config = {attributes: true};
        observer.observe(targetNode, config);
        return observer;
      },
      deregisterValidationAttributeChangeHandler: (observer) => observer.disconnect(),
      isFocused: () => document.activeElement === this.inputSelector,
      isRtl: () => window.getComputedStyle(this.mdcRoot).getPropertyValue('direction') === 'rtl',

      shakeLabel: (shouldShake) => this.label_.shake(shouldShake),
      floatLabel: (shouldFloat) => this.label_.float(shouldFloat),
      hasLabel: () => !!this.label_,
      getLabelWidth: () => this.label_.getWidth(),
      
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
    };
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

    //I couldn't get rippleFactory to work. It keeps giving me "unable to access classList of undefined" errors.
    //Simply removing it seems to not have any effects on the results, although I might be wrong.

    // this.ripple = null;
    // if (!this.mdcRoot.classList.contains(TEXTAREA) && !this.mdcRoot.classList.contains(OUTLINED)) {
    //   console.log('initializing ripple:', this)
    //   const MATCHES = getMatchesProperty(HTMLElement.prototype);
    //   const adapter =
    //     Object.assign(MDCRipple.createAdapter(/** @type {!RippleCapableSurface} */ (this)), {
    //       isSurfaceActive: () => this.inputSelector[MATCHES](':active'),
    //       registerInteractionHandler: (type, handler) => this.inputSelector.addEventListener(type, handler),
    //       deregisterInteractionHandler: (type, handler) => this.inputSelector.removeEventListener(type, handler),
    //     });
    //   const foundation = new MDCRippleFoundation(adapter);
    //   this.ripple = rippleFactory(this.mdcRoot, foundation);
    // }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mwc-textfield': TextField;
  }
}
