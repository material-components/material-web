/**
 * @license
 * Copyright 2026 Google LLC
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
  type ButtonColor,
  type ButtonSize,
} from '@material/web/labs/gb/components/button/button.js';
import {
  boolInput,
  Knob,
  selectDropdown,
  textInput,
} from './index.js';

import {stories, StoryKnobs} from './stories.js';

const collection = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>(
  'Button',
  [
    new Knob('icon', {
      ui: textInput(),
      defaultValue: 'favorite',
    }),
    new Knob('color', {
      ui: selectDropdown<ButtonColor>({
        options: [
          {value: 'filled', label: 'Filled'},
          {value: 'elevated', label: 'Elevated'},
          {value: 'tonal', label: 'Tonal'},
          {value: 'outlined', label: 'Outlined'},
          {value: 'text', label: 'Text'},
        ],
      }),
    }),
    new Knob('size', {
      ui: selectDropdown<ButtonSize>({
        options: [
          {value: 'xs', label: 'X-Small'},
          {value: 'sm', label: 'Small'},
          {value: 'md', label: 'Medium'},
          {value: 'lg', label: 'Large'},
          {value: 'xl', label: 'X-Large'},
        ],
      }),
    }),
    new Knob('square', {ui: boolInput()}),
    new Knob('disabled', {ui: boolInput()}),
    new Knob('softDisabled', {ui: boolInput()}),
    new Knob('toggle', {ui: boolInput()}),
  ],
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {fonts: 'roboto', icons: 'material-symbols'});
