/**
 * @license
 * Copyright 2023 Google LLC
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
import {boolInput, Knob} from './index.js';

import {stories, StoryKnobs} from './stories.js';

const collection = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>(
  'Switch',
  [
    new Knob('disabled', {defaultValue: false, ui: boolInput()}),
    new Knob('selected', {defaultValue: false, ui: boolInput()}),
    new Knob('icons', {defaultValue: false, ui: boolInput()}),
    new Knob('showOnlySelectedIcon', {defaultValue: false, ui: boolInput()}),
  ],
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection);
