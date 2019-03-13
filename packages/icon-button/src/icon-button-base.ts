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

import {BaseElement, html, property, query, observer, addHasRemoveClass} from '@material/mwc-base/base-element.js';
import MDCIconButtonToggleFoundation from '@material/icon-button/foundation.js';
import {MDCIconButtonToggleAdapter} from '@material/icon-button/adapter.js';
import {ripple} from '@material/mwc-ripple/ripple-directive.js';

export abstract class IconButtonBase extends BaseElement {

  protected mdcFoundationClass = MDCIconButtonToggleFoundation;

  protected mdcFoundation!: MDCIconButtonToggleFoundation;

  @query('.mdc-icon-button')
  protected mdcRoot!: HTMLElement;

  @property({type: String})
  label = '';

  @property({type: Boolean, reflect: true})
  disabled = false;

  @property({type: String})
  icon = '';

  @property({type: String})
  offIcon = '';

  @property({type: Boolean, reflect: true})
  @observer(function(this: IconButtonBase, state: boolean) {
    this.mdcFoundation.toggle(state);
  })
  on = false;

  protected createAdapter(): MDCIconButtonToggleAdapter {
    return {
      ...addHasRemoveClass(this.mdcRoot),
      setAttr: (name: string, value: string) => {
        this.mdcRoot.setAttribute(name, value);
      },
      notifyChange: (evtData: {isOn: boolean}) => {
        if (this.offIcon === '') {
          return;
        }
        this.dispatchEvent(new CustomEvent('MDCIconButtonToggle:change', {detail: evtData, bubbles: true}));
      }
    }
  }

  protected handleClick() {
    if (this.offIcon !== '') {
      this.on = !this.on;
      this.mdcFoundation.handleClick();
    }
  }

  focus() {
    this.mdcRoot.focus();
  }

  updated() {
    if (this.offIcon === '') {
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
        <i class="material-icons mdc-icon-button__icon">${this.offIcon}</i>
        <i class="material-icons mdc-icon-button__icon mdc-icon-button__icon--on">${this.icon}</i>
      </button>`;
  }
}