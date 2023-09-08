/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/icon/icon.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/textfield/filled-text-field.js';
import '@material/web/textfield/outlined-text-field.js';

import {MaterialStoryInit} from './material-collection.js';
import {MdFilledTextField} from '@material/web/textfield/filled-text-field.js';
import {css, html, nothing} from 'lit';

/** Knob types for Textfield stories. */
export interface StoryKnobs {
  label: string;
  textarea: boolean;
  disabled: boolean;
  required: boolean;
  prefixText: string;
  suffixText: string;
  supportingText: string;
  minLength: number;
  maxLength: number;
  min: string;
  max: string;
  step: string;
  pattern: string;
  'leading icon': boolean;
  'trailing icon': boolean;
}

// Set min-height for resizable textareas
const styles = css`
  [type=textarea] {
    min-height: 56px;
  }

  [type=textarea][supporting-text] {
    min-height: 76px;
  }
`;

const filled: MaterialStoryInit<StoryKnobs> = {
  name: '<md-filled-text-field>',
  styles,
  render(knobs) {
    return html`
      <md-filled-text-field
        label=${knobs.label || nothing}
        ?disabled=${knobs.disabled}
        prefix-text=${knobs.prefixText || nothing}
        max=${knobs.max || nothing}
        maxlength=${knobs.maxLength || nothing}
        min=${knobs.min || nothing}
        minlength=${knobs.minLength || nothing}
        pattern=${knobs.pattern || nothing}
        ?required=${knobs.required}
        step=${knobs.step || nothing}
        suffix-text=${knobs.suffixText || nothing}
        supporting-text=${knobs.supportingText || nothing}
        type=${knobs.textarea ? 'textarea' : 'text'}
        @change=${reportValidity}
      >
        ${knobs['leading icon'] ? LEADING_ICON : nothing}
        ${knobs['trailing icon'] ? TRAILING_ICON : nothing}
      </md-filled-text-field>
    `;
  }
};

const outlined: MaterialStoryInit<StoryKnobs> = {
  name: '<md-outlined-text-field>',
  styles,
  render(knobs) {
    return html`
      <md-outlined-text-field
        label=${knobs.label || nothing}
        ?disabled=${knobs.disabled}
        prefix-text=${knobs.prefixText || nothing}
        max=${knobs.max || nothing}
        maxlength=${knobs.maxLength || nothing}
        min=${knobs.min || nothing}
        minlength=${knobs.minLength || nothing}
        pattern=${knobs.pattern || nothing}
        ?required=${knobs.required}
        step=${knobs.step || nothing}
        suffix-text=${knobs.suffixText || nothing}
        supporting-text=${knobs.supportingText || nothing}
        type=${knobs.textarea ? 'textarea' : 'text'}
        @change=${reportValidity}
      >
        ${knobs['leading icon'] ? LEADING_ICON : nothing}
        ${knobs['trailing icon'] ? TRAILING_ICON : nothing}
      </md-outlined-text-field>
    `;
  }
};

const LEADING_ICON = html`<md-icon slot="leading-icon">search</md-icon>`;
const TRAILING_ICON =
    html`<md-icon-button slot="trailing-icon"><md-icon>event</md-icon></md-icon-button>`;
function reportValidity(event: Event) {
  (event.target as MdFilledTextField).reportValidity();
}

/** Textfield stories. */
export const stories = [filled, outlined];
