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
import {FormElement, query, customElement, Foundation, Adapter, property, html, observer} from '@material/mwc-base/form-element';
import {style} from './mwc-radio-css';
import {SelectionController} from './selection-controller';
// import {ripple} from '@material/mwc-ripple/ripple-directive';
import MDCRadioFoundation from '@material/radio/foundation';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-radio': Radio;
  }
}

export interface RadioFoundation extends Foundation {
  isChecked(): boolean;
  setChecked(checked: boolean): void;
  isDisabled(): boolean;
  setDisabled(disabled: boolean): void;
  getValue(): string;
  setValue(value: string): void;
}

export declare var RadioFoundation: {
  prototype: RadioFoundation;
  new (adapter: Adapter): RadioFoundation;
}

@customElement('mwc-radio' as any)
export class Radio extends FormElement {

  @query('.mdc-radio')
  mdcRoot!: HTMLElement;

  @query('input')
  formElement!: HTMLInputElement

  @property({type: Boolean})
  @observer(function(this: Radio, checked: boolean) {
    this.mdcFoundation.setChecked(checked);
  })
  checked = false;

  @property({type: Boolean})
  @observer(function(this: Radio, disabled: boolean) {
    this.mdcFoundation.setDisabled(disabled);
  })
  disabled = false;

  @property({type: String})
  @observer(function(this: Radio, value: string) {
    this.mdcFoundation.setValue(value);
  })
  value = '';

  @property({type: String})
  name = '';

  protected mdcFoundationClass: typeof RadioFoundation = MDCRadioFoundation;

  protected mdcFoundation!: RadioFoundation;

  private _selectionController = SelectionController.getController(this);

  connectedCallback() {
    super.connectedCallback();
    this._selectionController.register(this);
  }

  disconnectedCallback() {
    this._selectionController.unregister(this);
  }

  renderStyle() {
    return style;
  }

  protected createAdapter(): Adapter {
    return {
      ...super.createAdapter(),
      getNativeControl: () => {
        return this.formElement;
      }
    };
  }

  private _changeHandler = () => {
    this.checked = this.formElement.checked;
    this._selectionController.update(this);
  }

  private _focusHandler = () => {
    this._selectionController.focus(this)
  }

  private _blurHandler = () => {
    // this._selectionController.blur();
  }

  private _clickHandler = () => {
    // Firefox has weird behavior with radios if they are not focused
    this.formElement.focus();
  }

  render() {
    const {checked, name, value, _changeHandler: change, _focusHandler: focus, _blurHandler: blur, _clickHandler: click} = this;
    return html`
      ${this.renderStyle()}
      <div class="mdc-radio">
        <input class="mdc-radio__native-control" type="radio" name="${name}" .checked="${checked}" .value="${value}"
        @change="${change}"
        @focus="${focus}"
        @blur="${blur}"
        @click="${click}"
        >
        <div class="mdc-radio__background">
          <div class="mdc-radio__outer-circle"></div>
          <div class="mdc-radio__inner-circle"></div>
        </div>
      </div>`;
  }

  firstUpdated() {
    super.firstUpdated();
    this._selectionController.update(this);
  }
}