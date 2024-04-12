/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/icon/icon.js';
import '@material/web/select/filled-select.js';
import '@material/web/select/outlined-select.js';
import '@material/web/select/select-option.js';

import {MaterialStoryInit} from './material-collection.js';
import {html, nothing} from 'lit';

/** Knob types for select stories. */
export interface StoryKnobs {
  'md-select': void;
  label: string;
  typeaheadDelay: number;
  quick: boolean;
  required: boolean;
  disabled: boolean;
  errorText: string;
  supportingText: string;
  error: boolean;
  clampMenuWidth: boolean;
  menuAlign: 'start' | 'end' | undefined;
  menuPositioning: 'absolute' | 'fixed' | 'popover' | undefined;

  'md-select Slots': void;
  'slot=leading-icon': string;
  'slot=trailing-icon': string;
}

const selects: MaterialStoryInit<StoryKnobs> = {
  name: 'Selects',
  render(knobs) {
    return html`
      <div style="display: flex; gap: 16px;">
        <md-filled-select
          .label=${knobs.label}
          .quick=${knobs.quick}
          .required=${knobs.required}
          .disabled=${knobs.disabled}
          .errorText=${knobs.errorText}
          .supportingText=${knobs.supportingText}
          .clampMenuWidth=${knobs.clampMenuWidth}
          .menuAlign=${knobs.menuAlign!}
          .menuPositioning=${knobs.menuPositioning!}
          .typeaheadDelay=${knobs.typeaheadDelay}
          .error=${knobs.error}>
          ${renderIcon(knobs['slot=leading-icon'], 'leading-icon')}
          ${renderIcon(knobs['slot=trailing-icon'], 'trailing-icon')}
          ${renderItems()}
        </md-filled-select>

        <md-outlined-select
          .label=${knobs.label}
          .quick=${knobs.quick}
          .required=${knobs.required}
          .disabled=${knobs.disabled}
          .errorText=${knobs.errorText}
          .supportingText=${knobs.supportingText}
          .clampMenuWidth=${knobs.clampMenuWidth}
          .menuAlign=${knobs.menuAlign!}
          .menuPositioning=${knobs.menuPositioning!}
          .typeaheadDelay=${knobs.typeaheadDelay}
          .error=${knobs.error}>
          ${renderIcon(knobs['slot=leading-icon'], 'leading-icon')}
          ${renderIcon(knobs['slot=trailing-icon'], 'trailing-icon')}
          ${renderItems()}
        </md-outlined-select>
      </div>
    `;
  },
};

function renderIcon(iconName: string, slot: 'leading-icon' | 'trailing-icon') {
  return iconName
    ? html`<md-icon slot=${slot}><span>${iconName}</span></md-icon>`
    : nothing;
}

function renderItems() {
  return html` <md-select-option aria-label="blank" value=""></md-select-option>
    <md-select-option selected value="apple">
      <div slot="headline">Apple</div>
    </md-select-option>
    <md-select-option value="apricot">
      <div slot="headline">Apricot</div>
    </md-select-option>
    <md-select-option value="apricot">
      <div slot="headline">Apricots</div>
    </md-select-option>
    <md-select-option value="avocado">
      <div slot="headline">Avocado</div>
    </md-select-option>
    <md-select-option value="green_apple">
      <div slot="headline">Green Apple</div>
    </md-select-option>
    <md-select-option value="green_grapes">
      <div slot="headline">Green Grapes</div>
    </md-select-option>
    <md-select-option value="olive">
      <div slot="headline">Olive</div>
    </md-select-option>
    <md-select-option value="orange">
      <div slot="headline">Orange</div>
    </md-select-option>`;
}

/** Select stories. */
export const stories = [selects];
