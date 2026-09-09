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
import {boolInput, Knob, radioSelector} from './index.js';

import {stories, StoryKnobs} from './stories.js';

const collection = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>(
  'ARIA Tabs',
  [
    new Knob('autoSelect', {ui: boolInput(), defaultValue: false}),
    new Knob('orientation', {
      ui: radioSelector<'horizontal' | 'vertical'>({
        name: 'orientation',
        options: [
          {value: 'horizontal', label: 'horizontal'},
          {value: 'vertical', label: 'vertical'},
        ],
      }),
      defaultValue: 'horizontal' as const,
    }),
  ],
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection);
