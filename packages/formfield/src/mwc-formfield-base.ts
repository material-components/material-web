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
import {MDCFormFieldAdapter} from '@material/form-field/adapter.js';
import MDCFormFieldFoundation from '@material/form-field/foundation.js';
import {BaseElement, EventType, observer, SpecificEventListener} from '@material/mwc-base/base-element.js';
import {FormElement} from '@material/mwc-base/form-element.js';
import {findAssignedElement} from '@material/mwc-base/utils.js';
import {html, property, query} from 'lit-element';
import {classMap} from 'lit-html/directives/class-map.js';

export class FormfieldBase extends BaseElement {
  @property({type: Boolean}) alignEnd = false;

  @property({type: String})
  @observer(async function(this: FormfieldBase, label: string) {
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

  @query('.mdc-form-field') protected mdcRoot!: HTMLElement;

  protected mdcFoundation!: MDCFormFieldFoundation;

  protected readonly mdcFoundationClass = MDCFormFieldFoundation;

  protected createAdapter(): MDCFormFieldAdapter {
    return {
      registerInteractionHandler:
          <K extends EventType>(type: K, handler: SpecificEventListener<K>) => {
            this.labelEl.addEventListener(type, handler);
          },
      deregisterInteractionHandler:
          <K extends EventType>(type: K, handler: SpecificEventListener<K>) => {
            this.labelEl.removeEventListener(type, handler);
          },
      activateInputRipple: async () => {
        const input = this.input;
        if (input instanceof FormElement) {
          const ripple = await input.ripple;
          if (ripple) {
            ripple.activate();
          }
        }
      },
      deactivateInputRipple: async () => {
        const input = this.input;
        if (input instanceof FormElement) {
          const ripple = await input.ripple;
          if (ripple) {
            ripple.deactivate();
          }
        }
      },
    };
  }

  // slotEl should have type HTMLSlotElement, but when TypeScript's
  // emitDecoratorMetadata is enabled, the HTMLSlotElement constructor will
  // be emitted into the runtime, which will cause an "HTMLSlotElement is
  // undefined" error in browsers that don't define it (e.g. IE11).
  @query('slot') protected slotEl!: HTMLElement;

  @query('label') protected labelEl!: HTMLLabelElement;

  protected get input() {
    return findAssignedElement(this.slotEl as HTMLSlotElement, '*');
  }

  protected render() {
    return html`
      <div class="mdc-form-field ${classMap({
      'mdc-form-field--align-end': this.alignEnd
    })}">
        <slot></slot>
        <label class="mdc-label"
               @click="${this._labelClick}">${this.label}</label>
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
