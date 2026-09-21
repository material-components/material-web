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
  type ToolbarColor,
  type ToolbarOrientation,
} from '@material/web/labs/gb/components/toolbar/toolbar.js';
import {boolInput, Knob, selectDropdown} from './index.js';

import {stories, StoryKnobs} from './stories.js';

const collection = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>(
  'Toolbar',
  [
    new Knob('color', {
      ui: selectDropdown<ToolbarColor>({
        options: [
          {value: 'standard', label: 'Standard'},
          {value: 'vibrant', label: 'Vibrant'},
        ],
      }),
    }),
    new Knob('orientation', {
      ui: selectDropdown<ToolbarOrientation>({
        options: [
          {value: 'horizontal', label: 'Horizontal'},
          {value: 'vertical', label: 'Vertical'},
        ],
      }),
    }),
    new Knob('docked', {ui: boolInput()}),
  ],
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {fonts: 'roboto', icons: 'material-symbols'});
