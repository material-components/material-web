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
  'App Bar',
  [
    new Knob('size', {
      ui: selectDropdown({
        options: [
          {value: 'sm', label: 'Small (sm)'},
          {value: 'md', label: 'Medium (md)'},
          {value: 'lg', label: 'Large (lg)'},
        ],
      }),
    }),
    new Knob('variant', {
      ui: selectDropdown({
        options: [
          {value: 'standard', label: 'Standard'},
          {value: 'search', label: 'Search'},
        ],
      }),
    }),
    new Knob('scrolled', {ui: boolInput()}),
  ],
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {fonts: 'roboto', icons: 'material-symbols'});
