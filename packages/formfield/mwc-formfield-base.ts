/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// tslint:disable:no-new-decorators

import {MDCFormFieldAdapter} from '@material/form-field/adapter';
import MDCFormFieldFoundation from '@material/form-field/foundation';
import {BaseElement, EventType, SpecificEventListener} from '@material/mwc-base/base-element';
import {FormElement} from '@material/mwc-base/form-element';
import {observer} from '@material/mwc-base/observer';
import {findAssignedElement} from '@material/mwc-base/utils';
import {html, property, query} from 'lit-element';
import {classMap} from 'lit-html/directives/class-map';


export class FormfieldBase extends BaseElement {
  @property({type: Boolean}) alignEnd = false;
  @property({type: Boolean}) spaceBetween = false;
  @property({type: Boolean}) nowrap = false;

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
            ripple.startPress();
          }
        }
      },
      deactivateInputRipple: async () => {
        const input = this.input;
        if (input instanceof FormElement) {
          const ripple = await input.ripple;
          if (ripple) {
            ripple.endPress();
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
    const classes = {
      'mdc-form-field--align-end': this.alignEnd,
      'mdc-form-field--space-between': this.spaceBetween,
      'mdc-form-field--nowrap': this.nowrap
    };

    return html`
      <div class="mdc-form-field ${classMap(classes)}">
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
