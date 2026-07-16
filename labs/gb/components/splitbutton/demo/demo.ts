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
import {Knob, selectDropdown} from './index.js';

import {stories, StoryKnobs} from './stories.js';

const collection = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>(
  'Split Button',
  [
    new Knob('color', {
      ui: selectDropdown({
        options: [
          {value: 'filled', label: 'Filled'},
          {value: 'elevated', label: 'Elevated'},
          {value: 'tonal', label: 'Tonal'},
          {value: 'outlined', label: 'Outlined'},
        ],
      }),
    }),
    new Knob('size', {
      ui: selectDropdown({
        options: [
          {value: 'xs', label: 'X-Small'},
          {value: 'sm', label: 'Small'},
          {value: 'md', label: 'Medium'},
          {value: 'lg', label: 'Large'},
          {value: 'xl', label: 'X-Large'},
        ],
      }),
    }),
  ],
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {fonts: 'roboto', icons: 'material-symbols'});
