/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/checkbox/checkbox.js';

import {labelStyles, MaterialStoryInit} from './material-collection.js';
import {html} from 'lit';

/** Knob types for checkbox stories. */
export interface StoryKnobs {
  checked: boolean;
  disabled: boolean;
  error: boolean;
  indeterminate: boolean;
}

const standard: MaterialStoryInit<StoryKnobs> = {
  name: 'Checkbox',
  render({checked, disabled, error, indeterminate}) {
    return html`
      <md-checkbox
        .checked=${checked}
        ?disabled=${disabled}
        .error=${error}
        .indeterminate=${indeterminate}
      ></md-checkbox>
    `;
  },
};

const labeled: MaterialStoryInit<StoryKnobs> = {
  name: 'Labeled',
  styles: labelStyles,
  render({checked, disabled, error, indeterminate}) {
    return html`
      <label>
        Checkbox
        <md-checkbox
          .checked=${checked}
          ?disabled=${disabled}
          .error=${error}
          .indeterminate=${indeterminate}
        ></md-checkbox>
      </label>
    `;
  },
};

/** Checkbox stories. */
export const stories = [standard, labeled];
