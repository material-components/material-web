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

import '@material/mwc-radio';

import {observer} from '@material/mwc-base/observer';
import {Radio} from '@material/mwc-radio';
import {html, property, query} from 'lit-element';
import {classMap} from 'lit-html/directives/class-map';

import {GraphicType, ListItemBase, RequestSelectedDetail} from './mwc-list-item-base';

export class RadioListItemBase extends ListItemBase {
  @query('slot') protected slotElement!: HTMLSlotElement|null;
  @query('mwc-radio') protected radioElement!: Radio;

  @property({type: Boolean, reflect: true}) disabled = false;
  @property({type: Boolean}) left = false;
  @property({type: String, reflect: true}) graphic: GraphicType = 'control';
  @property({type: Boolean, reflect: false})
  @observer(function(this: ListItemBase, value: boolean) {
    if (value) {
      this.setAttribute('aria-checked', 'true');
    } else {
      this.setAttribute('aria-checked', 'false');
    }
  })
  selected = false;

  @property({type: String}) group = '';

  render() {
    const radioClasses = {
      'mdc-list-item__graphic': this.left,
      'mdc-list-item__meta': !this.left,
    };

    const text = this.renderText();
    const graphic = this.graphic && this.graphic !== 'control' && !this.left ?
        this.renderGraphic() :
        html``;
    const meta = this.hasMeta && this.left ? this.renderMeta() : html``;

    return html`
      ${graphic}
      ${this.left ? '' : text}
      <mwc-radio
          class=${classMap(radioClasses)}
          tabindex=${this.tabindex}
          name=${this.group}
          .checked=${this.selected}
          ?disabled=${this.disabled}
          @checked=${this.onChecked}>
      </mwc-radio>
      ${this.left ? text : ''}
      ${meta}`;
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

  protected onChecked(evt: Event) {
    const radio = evt.target as Radio;

    // needed to reconcile radio unchecking itself. List doesn't seem to care
    this.selected = radio.checked;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this.boundOnClick);

    this.toggleAttribute('mwc-list-item', true);
    this.toggleAttribute('mwc-radio-list-item', true);
  }
}
