/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import './index.js';
import './material-collection.js';

import {KnobTypesToKnobs, MaterialCollection, materialInitsToStoryInits, setUpDemo} from './material-collection.js';
import {boolInput, Knob, numberInput} from './index.js';

import {stories, StoryKnobs} from './stories.js';

const collection =
    new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>('Slider', [
      new Knob('value', {ui: numberInput(), defaultValue: 50}),
      new Knob('range', {ui: boolInput(), defaultValue: false}),
      new Knob('valueStart', {ui: numberInput(), defaultValue: 30}),
      new Knob('valueEnd', {ui: numberInput(), defaultValue: 70}),
      new Knob('min', {ui: numberInput(), defaultValue: 0}),
      new Knob('max', {ui: numberInput(), defaultValue: 100}),
      new Knob('step', {ui: numberInput(), defaultValue: 1}),
      new Knob('withTickMarks', {ui: boolInput(), defaultValue: false}),
      new Knob('withLabel', {ui: boolInput(), defaultValue: false}),
      new Knob('disabled', {ui: boolInput(), defaultValue: false}),
    ]);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection);
