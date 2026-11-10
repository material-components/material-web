/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import './material-collection.js';
import './index.js';

import {
  type KnobTypesToKnobs,
  MaterialCollection,
  materialInitsToStoryInits,
  setUpDemo,
} from './material-collection.js';
import {Knob, selectDropdown, textInput} from './index.js';

import {
  type FabColor,
  type FabSize,
} from '@material/web/labs/gb/components/fab/fab.js';
import {type FabMenuColor} from '@material/web/labs/gb/components/fabmenu/fab-menu.js';
import {stories, type StoryKnobs} from './stories.js';

const collection = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>(
  'FAB Menu',
  [
    new Knob('icon', {
      ui: textInput(),
      defaultValue: 'edit',
    }),
    new Knob('label', {
      ui: textInput(),
      defaultValue: 'Label',
    }),
    new Knob('color', {
      ui: selectDropdown<FabColor>({
        options: [
          {value: 'primary-container', label: 'Primary Container'},
          {value: 'secondary-container', label: 'Secondary Container'},
          {value: 'tertiary-container', label: 'Tertiary Container'},
          {value: 'primary', label: 'Primary'},
          {value: 'secondary', label: 'Secondary'},
          {value: 'tertiary', label: 'Tertiary'},
        ],
      }),
      defaultValue: 'primary-container' as const,
    }),
    new Knob('menuColor', {
      ui: selectDropdown<FabMenuColor>({
        options: [
          {value: 'standard', label: 'Standard'},
          {value: 'vibrant', label: 'Vibrant'},
        ],
      }),
      defaultValue: 'standard' as const,
    }),
    new Knob('size', {
      ui: selectDropdown<FabSize>({
        options: [
          {value: 'default', label: 'Default'},
          {value: 'md', label: 'Medium'},
          {value: 'lg', label: 'Large'},
        ],
      }),
      defaultValue: 'default' as const,
    }),
  ],
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {fonts: 'roboto', icons: 'material-symbols'});
