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
  IconButtonColor,
  IconButtonSize,
  IconButtonWidth,
} from '@material/web/labs/gb/components/iconbutton/icon-button.js';
import {
  boolInput,
  Knob,
  selectDropdown,
  textInput,
} from './index.js';

import {stories, StoryKnobs} from './stories.js';

const collection = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>(
  'Icon Button',
  [
    new Knob('icon', {
      ui: textInput(),
      defaultValue: 'add',
    }),
    new Knob('color', {
      ui: selectDropdown<IconButtonColor>({
        options: [
          {value: 'standard', label: 'Standard'},
          {value: 'filled', label: 'Filled'},
          {value: 'tonal', label: 'Tonal'},
          {value: 'outlined', label: 'Outlined'},
        ],
      }),
      defaultValue: 'filled' as const,
    }),
    new Knob('size', {
      ui: selectDropdown<IconButtonSize>({
        options: [
          {value: 'xs', label: 'X-Small'},
          {value: 'sm', label: 'Small'},
          {value: 'md', label: 'Medium'},
          {value: 'lg', label: 'Large'},
          {value: 'xl', label: 'X-Large'},
        ],
      }),
      defaultValue: 'sm' as const,
    }),
    new Knob('width', {
      ui: selectDropdown<IconButtonWidth>({
        options: [
          {value: '', label: 'Default'},
          {value: 'narrow', label: 'Narrow'},
          {value: 'wide', label: 'Wide'},
        ],
      }),
      defaultValue: '' as const,
    }),
    new Knob('square', {ui: boolInput()}),
    new Knob('disabled', {ui: boolInput()}),
    new Knob('softDisabled', {ui: boolInput()}),
    new Knob('toggle', {ui: boolInput()}),
  ],
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {fonts: 'roboto', icons: 'material-symbols'});
