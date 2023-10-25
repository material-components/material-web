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
import {boolInput, Knob, textInput} from './index.js';

import {stories, StoryKnobs} from './stories.js';

const collection = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>(
  'Textfield',
  [
    new Knob('label', {ui: textInput(), defaultValue: 'Label'}),
    new Knob('placeholder', {ui: textInput(), defaultValue: ''}),
    new Knob('disabled', {ui: boolInput(), defaultValue: false}),
    new Knob('prefixText', {ui: textInput(), defaultValue: ''}),
    new Knob('suffixText', {ui: textInput(), defaultValue: ''}),
    new Knob('supportingText', {
      ui: textInput(),
      defaultValue: 'Supporting text',
    }),
  ],
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection);
