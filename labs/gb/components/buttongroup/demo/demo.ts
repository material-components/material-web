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
  type ButtonGroupSelection,
  type ButtonGroupVariant,
} from '@material/web/labs/gb/components/buttongroup/button-group.js';
import {
  boolInput,
  Knob,
  selectDropdown,
  textInput,
} from './index.js';

import {stories, StoryKnobs} from './stories.js';

const collection = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>(
  'Button Group',
  [
    new Knob<ButtonGroupVariant | undefined, 'variant'>('variant', {
      defaultValue: 'standard',
      ui: selectDropdown<ButtonGroupVariant>({
        options: [
          {value: 'standard', label: 'Standard'},
          {value: 'connected', label: 'Connected'},
        ],
      }),
    }),
    new Knob<ButtonSize | undefined, 'size'>('size', {
      defaultValue: 'sm',
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
    new Knob<ButtonColor | undefined, 'color'>('color', {
      defaultValue: 'filled',
      ui: selectDropdown<ButtonColor>({
        options: [
          {value: 'filled', label: 'Filled'},
          {value: 'tonal', label: 'Tonal'},
          {value: 'outlined', label: 'Outlined'},
          {value: 'elevated', label: 'Elevated'},
        ],
      }),
    }),
    new Knob('square', {
      ui: boolInput(),
    }),
    new Knob<ButtonGroupSelection | undefined, 'selection'>('selection', {
      defaultValue: 'none',
      ui: selectDropdown<ButtonGroupSelection>({
        options: [
          {value: 'none', label: 'None'},
          {value: 'single', label: 'Single'},
          {value: 'multiple', label: 'Multiple'},
        ],
      }),
    }),
    new Knob('disabled', {
      ui: boolInput(),
    }),
    new Knob('icon', {
      ui: textInput(),
      defaultValue: 'favorite',
    }),
    new Knob('showIcon1', {
      ui: boolInput(),
      defaultValue: true,
    }),
    new Knob('showIcon2', {
      ui: boolInput(),
    }),
    new Knob('showIcon3', {
      ui: boolInput(),
    }),
    new Knob('showIcon4', {
      ui: boolInput(),
    }),
  ],
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {fonts: 'roboto', icons: 'material-symbols'});
