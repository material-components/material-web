/**
@license
Copyright 2019 Google Inc. All Rights Reserved.

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
import {addHasRemoveClass, BaseElement} from '@material/mwc-base/base-element.js';
import {observer} from '@material/mwc-base/observer.js';
import {ripple} from '@material/mwc-ripple/ripple-directive.js';
import {html, property, query} from 'lit-element';

export class IconButtonToggleBase extends BaseElement {
  protected mdcFoundationClass = MDCIconButtonToggleFoundation;

  protected mdcFoundation!: MDCIconButtonToggleFoundation;

  @query('.mdc-icon-button') protected mdcRoot!: HTMLElement;

  @property({type: String}) label = '';

  @property({type: Boolean, reflect: true}) disabled = false;

  @property({type: String}) onIcon = '';

  @property({type: String}) offIcon = '';

  @property({type: Boolean, reflect: true})
  @observer(function(this: IconButtonToggleBase, state: boolean) {
    this.mdcFoundation.toggle(state);
  })
  on = false;

  protected createAdapter(): MDCIconButtonToggleAdapter {
    return {
      ...addHasRemoveClass(this.mdcRoot),
      getAttr: (name: string) => {
        return this.mdcRoot.getAttribute(name);
      },
      setAttr: (name: string, value: string) => {
        this.mdcRoot.setAttribute(name, value);
      },
      notifyChange: (evtData: {isOn: boolean}) => {
        this.dispatchEvent(new CustomEvent(
            'MDCIconButtonToggle:change', {detail: evtData, bubbles: true}));
      },
    };
  }

  protected handleClick() {
    this.on = !this.on;
    this.mdcFoundation.handleClick();
  }

  focus() {
    this.mdcRoot.focus();
  }

  protected render() {
    return html`
      <button
        .ripple="${ripple()}"
        class="mdc-icon-button"
        @click="${this.handleClick}"
        aria-hidden="true"
        aria-label="${this.label}"
        ?disabled="${this.disabled}">
        <span class="mdc-icon-button__icon">
          <slot name="offIcon">
            <i class="material-icons">${this.offIcon}</i>
          </slot>
        </span>
        <span class="mdc-icon-button__icon mdc-icon-button__icon--on">
          <slot name="onIcon">
            <i class="material-icons">${this.onIcon}</i>
          </slot>
        </span>
      </button>`;
  }
}
