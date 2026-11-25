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
import {
  boolInput,
  Knob,
  numberInput,
  selectDropdown,
} from './index.js';

import {stories, type StoryKnobs} from './stories.js';

const collection = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>(
  'Progress indicators',
  [
    new Knob<'both' | 'circular' | 'linear' | undefined, 'progressType'>(
      'progressType',
      {
        ui: selectDropdown<'both' | 'circular' | 'linear'>({
          options: [
            {value: 'both', label: 'Both'},
            {value: 'circular', label: 'Circular'},
            {value: 'linear', label: 'Linear'},
          ],
        }),
        defaultValue: 'both',
      },
    ),
    new Knob('value', {
      ui: numberInput({step: 0.05}),
      defaultValue: 0.65,
    }),
    new Knob('wavy', {ui: boolInput(), defaultValue: true}),
    new Knob('thick', {ui: boolInput(), defaultValue: false}),
    new Knob('indeterminate', {ui: boolInput(), defaultValue: false}),
    new Knob('fourColor', {ui: boolInput(), defaultValue: false}),
  ],
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {fonts: 'roboto', icons: 'material-symbols'});
