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

  protected _changeFromClick = false;

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
    const ripple = this.renderRipple();

    return html`
      ${ripple}
      ${graphic}
      ${this.left ? '' : text}
      <mwc-radio
          global
          class=${classMap(radioClasses)}
          tabindex=${this.tabindex}
          name=${ifDefined(this.group === null ? undefined : this.group)}
          .checked=${this.selected}
          ?disabled=${this.disabled}
          @checked=${this.onChange}>
      </mwc-radio>
      ${this.left ? text : ''}
      ${meta}`;
  }

  protected onClick() {
    this._changeFromClick = true;
    super.onClick();
  }

  protected async onChange(evt: Event) {
    const checkbox = evt.target as Radio;
    const changeFromProp = this.selected === checkbox.checked;

    if (!changeFromProp) {
      this._skipPropRequest = true;
      this.selected = checkbox.checked;
      await this.updateComplete;
      this._skipPropRequest = false;

      if (!this._changeFromClick) {
        this.fireRequestSelected(this.selected, 'interaction');
      }
    }

    this._changeFromClick = false;
  }
}
