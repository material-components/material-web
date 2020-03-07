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

import {Radio} from '@material/mwc-radio';
import {html, property, query} from 'lit-element';
import {classMap} from 'lit-html/directives/class-map.js';
import {ifDefined} from 'lit-html/directives/if-defined.js';

import {GraphicType, ListItemBase} from './mwc-list-item-base.js';

export class RadioListItemBase extends ListItemBase {
  @query('slot') protected slotElement!: HTMLSlotElement|null;
  @query('mwc-radio') protected radioElement!: Radio;

  @property({type: Boolean}) left = false;
  @property({type: String, reflect: true}) graphic: GraphicType = 'control';

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
          global
          class=${classMap(radioClasses)}
          tabindex=${this.tabindex}
          name=${ifDefined(this.group === null ? undefined : this.group)}
          .checked=${this.selected}
          ?disabled=${this.disabled}
          @checked=${this.onChecked}>
      </mwc-radio>
      ${this.left ? text : ''}
      ${meta}`;
  }


  protected onClick() {
    this.fireRequestSelected(!this.selected, 'interaction');
  }

  protected onChecked(evt: Event) {
    const radio = evt.target as Radio;

    if (this.selected !== radio.checked) {
      // needed to reconcile radio unchecking itself. List doesn't seem to care
      this.selected = radio.checked;

      this.fireRequestSelected(this.selected, 'interaction');
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this.boundOnClick);

    this.setAttribute('mwc-list-item', '');
  }
}
