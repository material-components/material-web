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
import {boolInput, Knob, textInput} from './index.js';

import {stories, StoryKnobs} from './stories.js';

const collection = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>(
  'Chat Bubble',
  [
    new Knob('text', {
      ui: textInput(),
      defaultValue:
        'Analyze user feedback on our marketing and sales strategy.',
    }),
    new Knob('editing', {ui: boolInput(), defaultValue: false}),
    new Knob('expanded', {ui: boolInput(), defaultValue: false}),
    new Knob('showEditButton', {ui: boolInput(), defaultValue: true}),
    new Knob('showCopyButton', {ui: boolInput(), defaultValue: true}),
  ],
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {fonts: 'roboto', icons: 'material-symbols'});
