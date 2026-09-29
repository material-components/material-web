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
import {boolInput, Knob, numberInput} from './index.js';

import {stories, StoryKnobs} from './stories.js';

const collection = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>(
  'ARIA Progress',
  [
    new Knob('indeterminate', {ui: boolInput(), defaultValue: false}),
    new Knob('value', {ui: numberInput({step: 1}), defaultValue: 50}),
    new Knob('min', {ui: numberInput(), defaultValue: 0}),
    new Knob('max', {ui: numberInput(), defaultValue: 100}),
  ],
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection);
