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
  'Navigation Bar',
  [
    new Knob('hideInactiveLabels', {ui: boolInput(), defaultValue: false}),
    new Knob('label', {ui: textInput(), defaultValue: 'Label'}),
    new Knob('showBadge', {ui: boolInput(), defaultValue: false}),
    new Knob('badgeValue', {ui: textInput(), defaultValue: ''}),
    new Knob('active icon', {ui: textInput(), defaultValue: 'star'}),
    new Knob('inactive icon', {ui: textInput(), defaultValue: 'star_border'}),
  ],
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {icons: 'material-icons'});
