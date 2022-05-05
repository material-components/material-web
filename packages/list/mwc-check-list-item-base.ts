/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore


import '@material/mwc-checkbox/mwc-checkbox.js';

import {Checkbox} from '@material/mwc-checkbox/mwc-checkbox.js';
import {html} from 'lit';
import {property, query} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';

import {GraphicType, ListItemBase} from './mwc-list-item-base.js';

export class CheckListItemBase extends ListItemBase {
  @query('slot') protected override slotElement!: HTMLSlotElement|null;
  @query('mwc-checkbox') protected checkboxElement!: Checkbox;

  @property({type: Boolean}) left = false;
  @property({type: String, reflect: true})
  override graphic: GraphicType = 'control';

  override render() {
    const checkboxClasses = {
      'mdc-deprecated-list-item__graphic': this.left,
      'mdc-deprecated-list-item__meta': !this.left,
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
            reducedTouchTarget
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
