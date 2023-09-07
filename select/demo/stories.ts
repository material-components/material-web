/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/select/select-option.js';
import '@material/web/select/outlined-select.js';
import '@material/web/select/filled-select.js';
import '@material/web/icon/icon.js';

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
  menuFixed: boolean;

  'md-select Slots': void;
  'slot=leading-icon': string;
  'slot=trailing-icon': string;
}

const outlined: MaterialStoryInit<StoryKnobs> = {
  name: '<md-outlined-select> <md-select-option>',
  render(knobs) {
    return html`
      <md-outlined-select
          .label=${knobs.label}
          .quick=${knobs.quick}
          .required=${knobs.required}
          .disabled=${knobs.disabled}
          .errorText=${knobs.errorText}
          .supportingText=${knobs.supportingText}
          .menuFixed=${knobs.menuFixed}
          .typeaheadDelay=${knobs.typeaheadDelay}
          .error=${knobs.error}>
        ${renderIcon(knobs['slot=leading-icon'], 'leading-icon')}
        ${renderIcon(knobs['slot=trailing-icon'], 'trailing-icon')}
        ${renderItems()}
      </md-outlined-select>
    `;
  }
};

const filled: MaterialStoryInit<StoryKnobs> = {
  name: '<md-filled-select> <md-select-option>',
  render(knobs) {
    return html`
      <md-filled-select
          .label=${knobs.label}
          .quick=${knobs.quick}
          .required=${knobs.required}
          .disabled=${knobs.disabled}
          .errorText=${knobs.errorText}
          .supportingText=${knobs.supportingText}
          .menuFixed=${knobs.menuFixed}
          .typeaheadDelay=${knobs.typeaheadDelay}
          .error=${knobs.error}>
        ${renderIcon(knobs['slot=leading-icon'], 'leading-icon')}
        ${renderIcon(knobs['slot=trailing-icon'], 'trailing-icon')}
        ${renderItems()}
      </md-filled-select>
    `;
  }
};

function renderIcon(iconName: string, slot: 'leading-icon'|'trailing-icon') {
  return iconName ?
      html`<md-icon slot=${slot}><span>${iconName}</span></md-icon>` :
      nothing;
}

function renderItems() {
  return html`
    <md-select-option headline=""></md-select-option>
    <md-select-option selected value="apple" headline="Apple"></md-select-option>
    <md-select-option value="apricot" headline="Apricot"></md-select-option>
    <md-select-option value="apricot" headline="Apricots"></md-select-option>
    <md-select-option value="avocado" headline="Avocado"></md-select-option>
    <md-select-option value="green_apple" headline="Green Apple"></md-select-option>
    <md-select-option value="green_grapes" headline="Green Grapes"></md-select-option>
    <md-select-option value="olive" headline="Olive"></md-select-option>
    <md-select-option value="orange" headline="Orange"></md-select-option>`;
}

/** Select stories. */
export const stories = [outlined, filled];
