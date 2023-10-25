/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import './material-collection.js';
import './index.js';

import {FabSize} from '@material/web/fab/fab.js';
import {
  KnobTypesToKnobs,
  MaterialCollection,
  materialInitsToStoryInits,
  setUpDemo,
} from './material-collection.js';
import {
  boolInput,
  Knob,
  selectDropdown,
  textInput,
} from './index.js';

import {stories, StoryKnobs} from './stories.js';

const collection = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>('FAB', [
  new Knob('icon', {defaultValue: 'edit', ui: textInput()}),
  new Knob('label', {defaultValue: '', ui: textInput()}),
  new Knob('lowered', {defaultValue: false, ui: boolInput()}),
  new Knob('size', {
    defaultValue: 'medium' as FabSize,
    ui: selectDropdown<FabSize>({
      options: [
        {label: 'medium', value: 'medium'},
        {label: 'small', value: 'small'},
        {label: 'large', value: 'large'},
      ],
    }),
  }),
]);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {icons: 'material-symbols'});
