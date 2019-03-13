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
import {html, FormElement, customElement, property, query, HTMLElementWithRipple, addHasRemoveClass, RippleSurface} from '@material/mwc-base/form-element.js';
import {style} from './mwc-checkbox-css.js';
import {ripple} from '@material/mwc-ripple/ripple-directive.js';
import MDCCheckboxFoundation from '@material/checkbox/foundation.js';
import {MDCCheckboxAdapter} from '@material/checkbox/adapter.js';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-checkbox': Checkbox;
  }
}

@customElement('mwc-checkbox' as any)
export class Checkbox extends FormElement {

  @query('.mdc-checkbox')
  protected mdcRoot!: HTMLElementWithRipple;

  @query('input')
  protected formElement!: HTMLInputElement;

  @property({type: Boolean})
  checked = false;

  @property({type: Boolean})
  indeterminate = false;

  @property({type: Boolean})
  disabled = false;

  @property({type: String})
  value = ''

  protected mdcFoundationClass = MDCCheckboxFoundation;

  protected mdcFoundation!: MDCCheckboxFoundation;

  static styles = style;

  get ripple(): RippleSurface | undefined {
    return this.mdcRoot.ripple;
  }

  protected createAdapter(): MDCCheckboxAdapter {
    return {
      ...addHasRemoveClass(this.mdcRoot),
      forceLayout: () => {
        this.mdcRoot.offsetWidth;
      },
      isAttachedToDOM: () => this.isConnected,
      isIndeterminate: () => this.indeterminate,
      isChecked: () => this.checked,
      hasNativeControl: () => Boolean(this.formElement),
      setNativeControlDisabled: (disabled: boolean) => {
        this.formElement.disabled = disabled;
      },
      setNativeControlAttr: (attr: string, value: string) => {
        this.formElement.setAttribute(attr, value);
      },
      removeNativeControlAttr: (attr: string) => {
        this.formElement.removeAttribute(attr);
      },
    }
  }

  render() {
    return html`
      <div class="mdc-checkbox" @animationend="${this._animationEndHandler}" .ripple="${ripple()}">
        <input type="checkbox"
              class="mdc-checkbox__native-control"
              @change="${this._changeHandler}"
              .indeterminate="${this.indeterminate}"
              .checked="${this.checked}"
              .value="${this.value}">
        <div class="mdc-checkbox__background">
          <svg class="mdc-checkbox__checkmark"
              viewBox="0 0 24 24">
            <path class="mdc-checkbox__checkmark-path"
                  fill="none"
                  d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
          </svg>
          <div class="mdc-checkbox__mixedmark"></div>
        </div>
      </div>`;
  }

  private _changeHandler() {
    this.checked = this.formElement.checked;
    this.indeterminate = this.formElement.indeterminate;
    this.mdcFoundation.handleChange();
  }

  private _animationEndHandler() {
    this.mdcFoundation.handleAnimationEnd();
  }
}