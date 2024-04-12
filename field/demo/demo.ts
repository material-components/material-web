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
import {
  boolInput,
  Knob,
  numberInput,
  textInput,
} from './index.js';

import {stories, StoryKnobs} from './stories.js';

const collection = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>(
  'Field',
  [
    new Knob('label', {ui: textInput(), defaultValue: 'Label'}),
    new Knob('Supporting text', {
      ui: textInput(),
      defaultValue: 'Supporting text',
    }),
    new Knob('Error text', {ui: textInput(), defaultValue: 'Error text'}),
    new Knob('count', {ui: numberInput(), defaultValue: 0}),
    new Knob('max', {ui: numberInput(), defaultValue: 0}),
    new Knob('disabled', {ui: boolInput(), defaultValue: false}),
    new Knob('error', {ui: boolInput(), defaultValue: false}),
    new Knob('focused', {ui: boolInput(), defaultValue: false}),
    new Knob('populated', {ui: boolInput(), defaultValue: false}),
    new Knob('required', {ui: boolInput(), defaultValue: false}),
    new Knob('Leading icon', {ui: boolInput(), defaultValue: false}),
    new Knob('Trailing icon', {ui: boolInput(), defaultValue: false}),
    new Knob('resizable', {ui: boolInput(), defaultValue: false}),
  ],
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {fonts: 'roboto', icons: 'material-symbols'});
