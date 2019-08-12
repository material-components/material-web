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

import {MDCIconButtonToggleAdapter} from '@material/icon-button/adapter.js';
import MDCIconButtonToggleFoundation from '@material/icon-button/foundation.js';
import {addHasRemoveClass, BaseElement, html, observer, property, query} from '@material/mwc-base/base-element.js';
import {ripple} from '@material/mwc-ripple/ripple-directive.js';

export class IconButtonBase extends BaseElement {
  protected mdcFoundationClass = MDCIconButtonToggleFoundation;

  protected mdcFoundation!: MDCIconButtonToggleFoundation;

  @query('.mdc-icon-button') protected mdcRoot!: HTMLElement;

  // offIconSlot should have type HTMLSlotElement, but when TypeScript's
  // emitDecoratorMetadata is enabled, the HTMLSlotElement constructor will
  // be emitted into the runtime, which will cause an "HTMLSlotElement is
  // undefined" error in browsers that don't define it (e.g. Edge and IE11).
  @query('slot[name="offIcon"]') protected offIconSlot!: HTMLElement;

  @property({type: String}) label = '';

  @property({type: Boolean, reflect: true}) disabled = false;

  @property({type: String}) icon = '';

  @property({type: String})
  @observer(function(this: IconButtonBase) {
    this.calculateShouldToggle();
  })
  offIcon = '';

  @property({type: Boolean, reflect: true})
  @observer(function(this: IconButtonBase, state: boolean) {
    this.mdcFoundation.toggle(state);
  })
  on = false;

  protected shouldToggle = true;

  protected createAdapter(): MDCIconButtonToggleAdapter {
    return {
      ...addHasRemoveClass(this.mdcRoot),
      setAttr: (name: string, value: string) => {
        this.mdcRoot.setAttribute(name, value);
      },
      notifyChange: (evtData: {isOn: boolean}) => {
        if (!this.shouldToggle) {
          return;
        }
        this.dispatchEvent(new CustomEvent(
            'MDCIconButtonToggle:change', {detail: evtData, bubbles: true}));
      },
    };
  }

  protected handleClick() {
    if (this.shouldToggle) {
      this.on = !this.on;
      this.mdcFoundation.handleClick();
    }
  }

  protected calculateShouldToggle() {
    this.shouldToggle = this.offIcon !== '' ||
        (this.offIconSlot as HTMLSlotElement).assignedNodes().length > 0;
  }

  focus() {
    this.mdcRoot.focus();
  }

  // override firstUpdated to calculate if this button should be toggle-able
  firstUpdated() {
    super.firstUpdated();
    this.calculateShouldToggle();
    if (!this.shouldToggle) {
      // if this shouldn't toggle, set to `on` to have correct styling
      this.on = true;
    }
  }

  render() {
    return html`
      <button
        .ripple="${ripple()}"
        class="mdc-icon-button"
        @click="${this.handleClick}"
        aria-hidden="true"
        aria-label="${this.label}"
        ?disabled="${this.disabled}">
        <span class="mdc-icon-button__icon">
          <slot name="offIcon" @slotchange="${this.calculateShouldToggle}">
            <i class="material-icons">${this.offIcon}</i>
          </slot>
        </span>
        <span class="mdc-icon-button__icon mdc-icon-button__icon--on">
          <slot name="icon">
            <i class="material-icons">${this.icon}</i>
          </slot>
        </span>
      </button>`;
  }
}
