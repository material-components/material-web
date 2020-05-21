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

import {Checkbox} from '@material/mwc-checkbox';
import {html, property, query} from 'lit-element';
import {classMap} from 'lit-html/directives/class-map.js';

import {GraphicType, ListItemBase} from './mwc-list-item-base.js';

export class CheckListItemBase extends ListItemBase {
  @query('slot') protected slotElement!: HTMLSlotElement|null;
  @query('mwc-checkbox') protected checkboxElement!: Checkbox;

  @property({type: Boolean}) left = false;
  @property({type: String, reflect: true}) graphic: GraphicType = 'control';

  render() {
    const checkboxClasses = {
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
      <span class=${classMap(checkboxClasses)}>
        <mwc-checkbox
            tabindex=${this.tabindex}
            .checked=${this.selected}
            ?disabled=${this.disabled}
            @change=${this.onChange}>
        </mwc-checkbox>
      </span>
      ${this.left ? text : ''}
      ${meta}`;
  }

  protected async onChange(evt: Event) {
    const checkbox = evt.target as Checkbox;
    const changeFromProp = this.selected === checkbox.checked;

    if (!changeFromProp) {
      this._skipPropRequest = true;
      this.selected = checkbox.checked;
      await this.updateComplete;
      this._skipPropRequest = false;
    }
  }
}
