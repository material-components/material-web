/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import './index.js';
import './material-collection.js';

import {KnobTypesToKnobs, MaterialCollection, materialInitsToStoryInits, setUpDemo} from './material-collection.js';
import {boolInput, Knob, numberInput, textInput} from './index.js';

import {stories, StoryKnobs} from './stories.js';

const collection =
    new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>('Slider', [
      new Knob('value', {ui: numberInput(), defaultValue: 5}),
      new Knob('multivalue.value', {ui: textInput(), defaultValue: '5, 10'}),
      new Knob('min', {ui: numberInput(), defaultValue: 0}),
      new Knob('max', {ui: numberInput(), defaultValue: 25}),
      new Knob('step', {ui: numberInput(), defaultValue: 1}),
      new Knob('withTickMarks', {ui: boolInput(), defaultValue: false}),
      new Knob('withLabel', {ui: boolInput(), defaultValue: false}),
      new Knob('disabled', {ui: boolInput(), defaultValue: false}),
    ]);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection);
