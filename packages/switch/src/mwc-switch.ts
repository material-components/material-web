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
import {FormElement, html, property, observer, query, customElement} from '@material/mwc-base/form-element.js';
import {style} from './mwc-switch-css.js';
import MDCSwitchFoundation from '@material/switch/foundation.js';

@customElement('mwc-switch' as any)
export class Switch extends FormElement {
  @property({type: Boolean})
  @observer(function(this: Switch, value: boolean) {
    this.mdcFoundation.setChecked(value);
  })
  checked = false;

  @property({type: Boolean})
  @observer(function(this: Switch, value: boolean) {
    this.mdcFoundation.setDisabled(value);
  })
  disabled = false;

  renderStyle() {
    return style;
  }

  @query('.mdc-switch')
  protected mdcRoot!: HTMLElement;

  @query('input')
  protected formElement!: HTMLInputElement;

  protected mdcFoundation!: MDCSwitchFoundation;

  protected _boundHandler = (e: Event) => {
    this.mdcFoundation.handleChange(e);
    // catch "click" event and sync properties
    this.checked = this.formElement.checked;
  }

  protected get mdcFoundationClass() {
    return MDCSwitchFoundation;
  }

  protected createAdapter() {
    return {
      ...super.createAdapter(),
      setNativeControlChecked: (checked: boolean) => {
        this.formElement.checked = checked;
      },
      setNativeControlDisabled: (disabled: boolean) => {
        this.formElement.disabled = disabled;
      }
    };
  }

  render() {
    return html`
      ${this.renderStyle()}
      <div class="mdc-switch">
        <div class="mdc-switch__track"></div>
        <div class="mdc-switch__thumb-underlay">
          <div class="mdc-switch__thumb">
            <input type="checkbox" id="basic-switch" class="mdc-switch__native-control" role="switch" @change="${this._boundHandler}">
          </div>
        </div>
      </div>
      <slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mwc-switch': Switch;
  }
}