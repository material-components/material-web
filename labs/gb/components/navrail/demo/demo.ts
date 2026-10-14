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
import {type NavRailAlignment} from '@material/web/labs/gb/components/navrail/nav-rail.js';
import {boolInput, Knob, selectDropdown} from './index.js';

import {stories, type StoryKnobs} from './stories.js';

const collection = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>(
  'Navigation Rail',
  [
    new Knob('expanded', {ui: boolInput()}),
    new Knob('modal', {ui: boolInput()}),
    new Knob('alignment', {
      ui: selectDropdown<NavRailAlignment>({
        options: [
          {value: 'top', label: 'Top'},
          {value: 'center', label: 'Center'},
          {value: 'bottom', label: 'Bottom'},
        ],
      }),
    }),
    new Knob('showHeader', {ui: boolInput(), defaultValue: true}),
    new Knob('showBadges', {ui: boolInput(), defaultValue: true}),
  ],
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {fonts: 'roboto', icons: 'material-symbols'});
