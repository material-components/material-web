/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import './material-collection.js';
import './index.js';

import {
  KnobTypesToKnobs,
  MaterialCollection,
  materialInitsToStoryInits,
  setUpDemo,
} from './material-collection.js';
import {boolInput, Knob, selectDropdown} from './index.js';

import {stories, StoryKnobs} from './stories.js';

const collection = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>(
  'Chip',
  [
    new Knob('color', {
      ui: selectDropdown({
        options: [
          {value: 'elevated', label: 'Elevated'},
          {value: 'filled', label: 'Filled'},
          {value: 'tonal', label: 'Tonal'},
          {value: 'outlined', label: 'Outlined'},
        ],
      }),
    }),
    new Knob('type', {
      ui: selectDropdown({
        options: [
          {value: 'action', label: 'Action'},
          {value: 'filter', label: 'Filter'},
          {value: 'toggle', label: 'Toggle'},
        ],
      }),
    }),
    new Knob('selected', {
      ui: boolInput(),
      defaultValue: false,
    }),
    new Knob('removable', {
      ui: boolInput(),
      defaultValue: false,
    }),
    new Knob('disabled', {
      ui: boolInput(),
      defaultValue: false,
    }),
    new Knob('softDisabled', {
      ui: boolInput(),
      defaultValue: false,
    }),
  ],
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {fonts: 'roboto', icons: 'material-symbols'});
