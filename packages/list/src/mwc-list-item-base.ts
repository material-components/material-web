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

import {observer} from '@material/mwc-base/observer';
import {html, LitElement, property, query} from 'lit-element';

interface HasChecked extends Element {
  checked: boolean;
}
export class ListItemBase extends LitElement {
  @query('slot') protected slotElement!: HTMLSlotElement|null;
  @query('label') protected labelElement!: HTMLLabelElement|null;

  @property({type: String}) value = '';
  @property({type: Boolean}) hasCheckbox = false;
  @property({type: Boolean}) hasRadio = false;
  @property({type: Boolean, reflect: true, attribute: 'disabled'})
  disabled = false;

  @property({type: Boolean, reflect: true, attribute: 'selected'})
  @observer(function(this: ListItemBase, value: boolean) {
    if (value) {
      this.setAttribute('aria-selected', 'true');
    } else {
      this.setAttribute('aria-selected', 'false');
    }
  })
  selected = false;

  get text() {
    const textContent = this.textContent;

    return textContent ? textContent.trim() : '';
  }

  protected createRenderRoot() {
    return this.attachShadow({mode: 'open', delegatesFocus: true});
  }

  render() {
    return html`
      <label>
        <slot></slot>
      </label>`;
  }

  protected getControl(): HasChecked|null {
    const label = this.labelElement;

    if (!label) {
      return null;
    }

    const control = label.control as HTMLElement | HasChecked | null;

    return control && 'checked' in control ? control : null;
  }

  setControlTabIndex(tabIndex: string) {
    const control = this.getControl();
    if (control) {
      control.setAttribute('tabindex', tabIndex);
    }
  }

  isControlChecked() {
    const control = this.getControl();
    return control ? control.checked : false;
  }

  setControlChecked(isChecked: boolean) {
    const control = this.getControl();

    if (control) {
      control.checked = isChecked;
    }
  }

  firstUpdated() {
    this.setAttribute('role', 'option');

    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '-1');
    }

    this.setControlTabIndex('-1');

    this.toggleAttribute('mwc-list-item', true);
  }
}
