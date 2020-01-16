/**
 @license
 Copyright 2020 Google Inc. All Rights Reserved.

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

import '@material/mwc-checkbox';

import {observer} from '@material/mwc-base/observer';
import {Checkbox} from '@material/mwc-checkbox';
import {html, property, query} from 'lit-element';
import {classMap} from 'lit-html/directives/class-map';

import {ListItemBase, RequestSelectedDetail} from './mwc-list-item-base';

export class CheckListItemBase extends ListItemBase {
  @query('slot') protected slotElement!: HTMLSlotElement|null;
  @query('mwc-checkbox') protected checkboxElement!: Checkbox;

  @property({type: Boolean, reflect: true}) disabled = false;

  @property({type: Boolean}) left = false;

  @property({type: Boolean, reflect: false})
  @observer(function(this: ListItemBase, value: boolean) {
    if (value) {
      this.setAttribute('aria-selected', 'true');
    } else {
      this.setAttribute('aria-selected', 'false');
    }
  })
  selected = false;

  render() {
    const checkboxClasses = {
      'mdc-list-item__graphic': this.left,
      'mdc-list-item__meta': !this.left,
    };

    const text = this.renderText();

    return html`
      ${this.left ? '' : text}
      <mwc-checkbox
          class=${classMap(checkboxClasses)}
          tabindex=${this.tabindex}
          .checked=${this.selected}
          ?disabled=${this.disabled}>
      </mwc-checkbox>
      ${this.left ? text : ''}`;
  }

  protected onClick() {
    const customEv =
        new CustomEvent<RequestSelectedDetail>('request-selected', {
          bubbles: true,
          composed: true,
          detail: {hasCheckboxOrRadio: true, selected: !this.selected}
        });

    this.dispatchEvent(customEv);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this.boundOnClick);

    this.toggleAttribute('mwc-list-item', true);
    this.toggleAttribute('mwc-check-list-item', true);
  }
}
