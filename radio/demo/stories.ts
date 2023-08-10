/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/radio/radio.js';

import {labelStyles, MaterialStoryInit} from './material-collection.js';
import {html} from 'lit';

/** Knob types for radio stories. */
export interface StoryKnobs {
  checked: '0'|'1'|'2'|undefined;
  disabled: boolean;
}

const standard: MaterialStoryInit<StoryKnobs> = {
  name: '<md-radio>',
  render({checked, disabled}) {
    return html`
      <md-radio
        name="story1"
        value="radioA"
        touch-target="wrapper"
        .checked=${checked === '0'}
        .disabled="${disabled || false}">
      </md-radio>
      <md-radio
        name="story1"
        value="radioB"
        touch-target="wrapper"
        .checked=${checked === '1'}
        .disabled="${disabled || false}">
      </md-radio>
      <md-radio
        name="story1"
        value="radioC"
        touch-target="wrapper"
        .checked=${checked === '2'}
        .disabled="${disabled || false}">
      </md-radio>
      `;
  },
};

const labeled: MaterialStoryInit<StoryKnobs> = {
  name: 'Labeled',
  styles: labelStyles,
  render({checked, disabled}) {
    return html`
      <label>
        First Radio
        <md-radio
          name="story2"
          value="radioA"
          touch-target="wrapper"
          .checked=${checked === '0'}
          .disabled="${disabled || false}">
        </md-radio>
      </label>
      <label>
        Second Radio
        <md-radio
          name="story2"
          value="radioB"
          touch-target="wrapper"
          .checked=${checked === '1'}
          .disabled="${disabled || false}">
        </md-radio>
      </label>
      <label>
        Third Radio
        <md-radio
          name="story2"
          value="radioC"
          touch-target="wrapper"
          .checked=${checked === '2'}
          .disabled="${disabled || false}">
        </md-radio>
      </label>
      `;
  },
};

/** Radio stories. */
export const stories = [standard, labeled];
