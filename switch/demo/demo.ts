/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import './index.js';
import './material-collection.js';

import {KnobTypesToKnobs, MaterialCollection, materialInitsToStoryInits, setUpDemo} from './material-collection.js';
import {boolInput, Knob, textInput} from './index.js';

import {stories, StoryKnobs} from './stories.js.js';

const collection =
    new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>('Switch', [
      new Knob('disabled', {defaultValue: false, ui: boolInput()}),
      new Knob('selected', {defaultValue: false, ui: boolInput()}),
      new Knob('icons', {defaultValue: false, ui: boolInput()}),
      new Knob('showOnlySelectedIcon', {defaultValue: false, ui: boolInput()}),
      new Knob('value', {defaultValue: 'on', ui: textInput()}),
      new Knob('name', {defaultValue: '', ui: textInput()}),
      new Knob('aria-label', {defaultValue: '', ui: textInput()}),
      new Knob('aria-labelledby', {defaultValue: '', ui: textInput()}),
    ]);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection);
