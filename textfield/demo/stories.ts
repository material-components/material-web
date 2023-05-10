/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/icon/icon.js';
import '@material/web/textfield/filled-text-field.js';
import '@material/web/textfield/outlined-text-field.js';

import {MaterialStoryInit} from './material-collection.js';
import {MdFilledTextField} from '@material/web/textfield/filled-text-field.js';
import {html, nothing} from 'lit';

/** Knob types for Textfield stories. */
export interface StoryKnobs {
  label: string;
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

const filled: MaterialStoryInit<StoryKnobs> = {
  name: '<md-filled-text-field>',
  render(knobs) {
    return html`
      <md-filled-text-field
        .label=${knobs.label}
        ?disabled=${knobs.disabled}
        .prefixText=${knobs.prefixText}
        .max=${knobs.max}
        .maxLength=${knobs.maxLength}
        .min=${knobs.min}
        .minLength=${knobs.minLength}
        .pattern=${knobs.pattern}
        .required=${knobs.required}
        .step=${knobs.step}
        .suffixText=${knobs.suffixText}
        .supportingText=${knobs.supportingText}
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
  render(knobs) {
    return html`
      <md-outlined-text-field
        .label=${knobs.label}
        ?disabled=${knobs.disabled}
        .prefixText=${knobs.prefixText}
        .max=${knobs.max}
        .maxLength=${knobs.maxLength}
        .min=${knobs.min}
        .minLength=${knobs.minLength}
        .pattern=${knobs.pattern}
        .required=${knobs.required}
        .step=${knobs.step}
        .suffixText=${knobs.suffixText}
        .supportingText=${knobs.supportingText}
        @change=${reportValidity}
      >
        ${knobs['leading icon'] ? LEADING_ICON : nothing}
        ${knobs['trailing icon'] ? TRAILING_ICON : nothing}
      </md-outlined-text-field>
    `;
  }
};

const LEADING_ICON = html`<md-icon slot="leadingicon">search</md-icon>`;
const TRAILING_ICON = html`<md-icon slot="trailingicon">event</md-icon>`;
function reportValidity(e: Event) {
  (e.target as MdFilledTextField).reportValidity();
}

/** Textfield stories. */
export const stories = [filled, outlined];
