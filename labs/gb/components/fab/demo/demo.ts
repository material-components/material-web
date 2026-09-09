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
import {Knob, selectDropdown, textInput} from './index.js';

import {type FabColor, type FabSize} from '../fab.js';
import {stories, StoryKnobs} from './stories.js';

const collection = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>('Fab', [
  new Knob('icon', {
    ui: textInput(),
    defaultValue: 'add',
  }),
  new Knob('label', {
    ui: textInput(),
  }),
  new Knob('color', {
    ui: selectDropdown<FabColor>({
      options: [
        {value: 'primary', label: 'Primary'},
        {value: 'primary-container', label: 'Primary Container'},
        {value: 'secondary', label: 'Secondary'},
        {value: 'secondary-container', label: 'Secondary Container'},
        {value: 'tertiary', label: 'Tertiary'},
        {value: 'tertiary-container', label: 'Tertiary Container'},
      ],
    }),
  }),
  new Knob('size', {
    ui: selectDropdown<FabSize>({
      options: [
        {value: 'default', label: 'Default'},
        {value: 'md', label: 'Medium'},
        {value: 'lg', label: 'Large'},
      ],
    }),
  }),
]);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {fonts: 'roboto', icons: 'material-symbols'});
