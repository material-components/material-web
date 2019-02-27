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
import {html, BaseElement, Foundation, Adapter, property, query, observer, classMap} from '@material/mwc-base/base-element.js';
import {FormElement} from '@material/mwc-base/form-element.js';
import {findAssignedElement} from '@material/mwc-base/utils.js';
import {style} from './mwc-formfield-css.js';
import MDCFormFieldFoundation from '@material/form-field/foundation.js';

export interface FormFieldFoundation extends Foundation {
}

export declare var FormFieldFoundation: {
  prototype: FormFieldFoundation;
  new(adapter: Adapter): FormFieldFoundation;
}

declare global {
  interface HTMLElementTagNameMap {
    'mwc-formfield': Formfield;
  }
}

export class Formfield extends BaseElement {
  @property({type: Boolean})
  alignEnd = false;

  @property({type: String})
  @observer(async function(this: Formfield, label: string) {
    const input = this.input;
    if (input) {
      if (input.localName === 'input') {
        input.setAttribute('aria-label', label);
      } else if (input instanceof FormElement) {
        await input.updateComplete;
        input.setAriaLabel(label);
      }
    }
  })
  label = '';

  @query('.mdc-form-field')
  protected mdcRoot!: HTMLElement;

  protected mdcFoundation!: FormFieldFoundation;

  protected readonly mdcFoundationClass: typeof FormFieldFoundation = MDCFormFieldFoundation;

  protected createAdapter() {
    return {
      ...super.createAdapter(),
      registerInteractionHandler: (type: string, handler: EventListener) => {
        this.labelEl.addEventListener(type, handler);
      },
      deregisterInteractionHandler: (type: string, handler: EventListener) => {
        this.labelEl.removeEventListener(type, handler);
      },
      activateInputRipple: () => {
        const input = this.input;
        if (input instanceof FormElement && input.ripple) {
          input.ripple.activate();
        }
      },
      deactivateInputRipple: () => {
        const input = this.input;
        if (input instanceof FormElement && input.ripple) {
          input.ripple.deactivate();
        }
      }
    }
  }

  @query('slot')
  protected slotEl!: HTMLSlotElement;

  @query('label')
  protected labelEl!: HTMLLabelElement;

  protected get input() {
    return findAssignedElement(this.slotEl, '*');
  }

  static styles = style;

  render() {
    return html`
      <div class="mdc-form-field ${classMap({'mdc-form-field--align-end': this.alignEnd})}">
        <slot></slot>
        <label class="mdc-label" @click="${this._labelClick}">${this.label}</label>
      </div>`;
  }

  private _labelClick() {
    const input = this.input;
    if (input) {
      input.focus();
      input.click();
    }
  }
}

customElements.define('mwc-formfield', Formfield);
