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
  title,
} from './material-collection.js';
import {
  boolInput,
  Knob,
  numberInput,
  selectDropdown,
  textInput,
} from './index.js';

import {stories, StoryKnobs} from './stories.js';

const collection = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>(
  'Select',
  [
    new Knob('md-select', {ui: title()}),
    new Knob('label', {ui: textInput(), defaultValue: 'Fruit'}),
    new Knob('typeaheadDelay', {ui: numberInput(), defaultValue: 200}),
    new Knob('quick', {ui: boolInput(), defaultValue: false}),
    new Knob('required', {ui: boolInput(), defaultValue: false}),
    new Knob('disabled', {ui: boolInput(), defaultValue: false}),
    new Knob('errorText', {ui: textInput(), defaultValue: ''}),
    new Knob('supportingText', {ui: textInput(), defaultValue: ''}),
    new Knob('menuAlign', {
      defaultValue: 'start' as const,
      ui: selectDropdown<'start' | 'end'>({
        options: [
          {label: 'start', value: 'start'},
          {label: 'end', value: 'end'},
        ],
      }),
    }),
    new Knob('menuPositioning', {
      defaultValue: 'popover' as const,
      ui: selectDropdown<'absolute' | 'fixed' | 'popover'>({
        options: [
          {label: 'popover', value: 'popover'},
          {label: 'absolute', value: 'absolute'},
          {label: 'fixed', value: 'fixed'},
        ],
      }),
    }),
    new Knob('clampMenuWidth', {ui: boolInput(), defaultValue: false}),
    new Knob('error', {ui: boolInput(), defaultValue: false}),

    new Knob('md-select Slots', {ui: title()}),
    new Knob('slot=leading-icon', {ui: textInput(), defaultValue: ''}),
    new Knob('slot=trailing-icon', {ui: textInput(), defaultValue: ''}),
  ],
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection);
