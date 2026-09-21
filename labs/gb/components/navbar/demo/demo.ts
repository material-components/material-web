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
import {type NavBarItemLayout} from '@material/web/labs/gb/components/navbar/nav-bar.js';
import {boolInput, Knob, selectDropdown} from './index.js';

import {stories, type StoryKnobs} from './stories.js';

const collection = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>(
  'Navigation Bar',
  [
    new Knob('itemLayout', {
      ui: selectDropdown<NavBarItemLayout>({
        options: [
          {value: 'vertical', label: 'Vertical (Stacked)'},
          {value: 'horizontal', label: 'Horizontal (Inline)'},
        ],
      }),
    }),
    new Knob('showBadges', {ui: boolInput()}),
  ],
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {fonts: 'roboto', icons: 'material-symbols'});
