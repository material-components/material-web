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
import {boolInput, Knob, selectDropdown} from './index.js';

import {SliderSize} from '../slider.js';
import {stories, StoryKnobs} from './stories.js';

const collection = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>(
  'Slider',
  [
    new Knob('disabled', {ui: boolInput()}),
    new Knob('size', {
      ui: selectDropdown<SliderSize>({
        options: [
          {value: 'xsmall', label: 'X-Small'},
          {value: 'small', label: 'Small'},
          {value: 'medium', label: 'Medium'},
          {value: 'large', label: 'Large'},
          {value: 'xlarge', label: 'X-Large'},
        ],
      }),
    }),
  ],
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {fonts: 'roboto', icons: 'material-symbols'});
