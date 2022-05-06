/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore


import '@material/mwc-radio/mwc-radio.js';

import {Radio} from '@material/mwc-radio/mwc-radio.js';
import {html} from 'lit';
import {property, query} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {ifDefined} from 'lit/directives/if-defined.js';

import {GraphicType, ListItemBase} from './mwc-list-item-base.js';

export class RadioListItemBase extends ListItemBase {
  @query('slot') protected override slotElement!: HTMLSlotElement|null;
  @query('mwc-radio') protected radioElement!: Radio;

  @property({type: Boolean}) left = false;
  @property({type: String, reflect: true})
  override graphic: GraphicType = 'control';

  protected _changeFromClick = false;

  override render() {
    const radioClasses = {
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

  protected override onClick() {
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
