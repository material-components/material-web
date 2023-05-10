/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import './index.js';
import './material-collection.js';

import {KnobTypesToKnobs, MaterialCollection, materialInitsToStoryInits, setUpDemo, title} from './material-collection.js';
import {boolInput, Knob, numberInput, textInput} from './index.js';

import {stories, StoryKnobs} from './stories.js';

const collection =
    new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>('Select', [
      new Knob('md-select', {ui: title()}),
      new Knob('label', {ui: textInput(), defaultValue: ''}),
      new Knob('typeaheadBufferTime', {ui: numberInput(), defaultValue: 200}),
      new Knob('quick', {ui: boolInput(), defaultValue: false}),
      new Knob('required', {ui: boolInput(), defaultValue: false}),
      new Knob('disabled', {ui: boolInput(), defaultValue: false}),
      new Knob('errorText', {ui: textInput(), defaultValue: ''}),
      new Knob('supportingText', {ui: textInput(), defaultValue: ''}),
      new Knob('error', {ui: boolInput(), defaultValue: false}),
      new Knob('menuFixed', {ui: boolInput(), defaultValue: false}),

      new Knob('md-select Slots', {ui: title()}),
      new Knob('slot=leadingicon', {ui: textInput(), defaultValue: ''}),
      new Knob('slot=trailingicon', {ui: textInput(), defaultValue: ''}),
    ]);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection);
