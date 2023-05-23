/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import './index.js';
import './material-collection.js';

import {KnobTypesToKnobs, MaterialCollection, materialInitsToStoryInits, setUpDemo} from './material-collection.js';
import {boolInput, cssCustomProperty, Knob, textInput} from './index.js';

import {stories, StoryKnobs} from './stories.js';

const collection =
    new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>('Focus', [
      new Knob('inward', {ui: boolInput(), defaultValue: false}),
      new Knob(
          '--md-focus-ring-width',
          {ui: textInput(), wiring: cssCustomProperty, defaultValue: '3px'}),
      new Knob(
          '--md-focus-ring-active-width',
          {ui: textInput(), wiring: cssCustomProperty, defaultValue: '8px'}),
      new Knob(
          '--md-focus-ring-outward-offset',
          {ui: textInput(), wiring: cssCustomProperty, defaultValue: '2px'}),
      new Knob(
          '--md-focus-ring-inward-offset',
          {ui: textInput(), wiring: cssCustomProperty, defaultValue: '0px'}),
    ]);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection);
