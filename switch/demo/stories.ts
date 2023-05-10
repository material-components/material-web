/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/switch/switch.js';

import {labelStyles, MaterialStoryInit} from './material-collection.js';
import {html, nothing} from 'lit';

/** Knob types for Switch stories. */
export interface StoryKnobs {
  disabled: boolean;
  selected: boolean;
  icons: boolean;
  showOnlySelectedIcon: boolean;
  value: string;
  name: string;
  'aria-label': string;
  'aria-labelledby': string;
}

const standard: MaterialStoryInit<StoryKnobs> = {
  name: '<md-switch>',
  render(knobs) {
    return html`
      <md-switch
          .disabled=${knobs.disabled}
          .selected=${knobs.selected}
          .icons=${knobs.icons}
          .showOnlySelectedIcon=${knobs.showOnlySelectedIcon}
          .value=${knobs.value}
          aria-label=${knobs['aria-label'] || nothing}
          aria-labelledby=${knobs['aria-labelledby'] || nothing}>
      </md-switch>`;
  }
};

const labeled: MaterialStoryInit<StoryKnobs> = {
  name: 'Labeled',
  styles: labelStyles,
  render(knobs) {
    return html`
      <label>
        Switch
        <md-switch
          .disabled=${knobs.disabled}
          .selected=${knobs.selected}
          .icons=${knobs.icons}
          .showOnlySelectedIcon=${knobs.showOnlySelectedIcon}
          .value=${knobs.value}
          aria-label=${knobs['aria-label'] || nothing}
          aria-labelledby=${knobs['aria-labelledby'] || nothing}>
        </md-switch>
      </label>`;
  }
};

/** Switch stories. */
export const stories = [standard, labeled];
