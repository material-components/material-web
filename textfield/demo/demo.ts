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
    new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>('Textfield', [
      new Knob('label', {ui: textInput(), defaultValue: 'Label'}),
      new Knob('textarea', {ui: boolInput(), defaultValue: false}),
      new Knob('disabled', {ui: boolInput(), defaultValue: false}),
      new Knob('required', {ui: boolInput(), defaultValue: false}),
      new Knob('prefixText', {ui: textInput(), defaultValue: ''}),
      new Knob('suffixText', {ui: textInput(), defaultValue: ''}),
      new Knob(
          'supportingText', {ui: textInput(), defaultValue: 'Supporting text'}),
      new Knob('minLength', {ui: numberInput(), defaultValue: -1}),
      new Knob('maxLength', {ui: numberInput(), defaultValue: -1}),
      new Knob('min', {ui: textInput(), defaultValue: ''}),
      new Knob('max', {ui: textInput(), defaultValue: ''}),
      new Knob('step', {ui: textInput(), defaultValue: ''}),
      new Knob('pattern', {ui: textInput(), defaultValue: ''}),
      new Knob('leading icon', {ui: boolInput(), defaultValue: false}),
      new Knob('trailing icon', {ui: boolInput(), defaultValue: false}),
    ]);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection);
