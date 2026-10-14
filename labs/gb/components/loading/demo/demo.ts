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
  textInput,
} from './index.js';

import {stories, type StoryKnobs} from './stories.js';

const collection = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>(
  'Loading',
  [
    new Knob('contained', {ui: boolInput(), defaultValue: false}),
    new Knob('closed', {ui: boolInput(), defaultValue: false}),
    new Knob('ariaLabel', {ui: textInput(), defaultValue: 'Loading'}),
  ] as unknown as KnobTypesToKnobs<StoryKnobs>,
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection);
