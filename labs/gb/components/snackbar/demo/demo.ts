/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import './material-collection.js';
import './index.js';

import {
  type KnobTypesToKnobs,
  MaterialCollection,
  materialInitsToStoryInits,
  setUpDemo,
} from './material-collection.js';
import {
  boolInput,
  Knob,
  selectDropdown,
  textInput,
} from './index.js';

import {stories, type StoryKnobs} from './stories.js';

const collection = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>(
  'Snackbar',
  [
    new Knob('timeoutMs', {
      ui: selectDropdown({
        options: [
          {value: '-1', label: '-1 (Indeterminate)'},
          {value: '5000', label: '5000 ms'},
          {value: '3000', label: '3000 ms'},
          {value: '10000', label: '10000 ms'},
        ],
      }),
      defaultValue: '-1',
    }),
    new Knob('message', {
      ui: textInput(),
      defaultValue: 'Your message has been sent.',
    }),
    new Knob('action', {
      ui: textInput(),
      defaultValue: 'Undo',
    }),
    new Knob('hasCloseButton', {
      ui: boolInput(),
      defaultValue: true,
    }),
  ],
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {fonts: 'roboto', icons: 'material-symbols'});
