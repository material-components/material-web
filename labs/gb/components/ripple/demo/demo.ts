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

import {stories, StoryKnobs} from './stories.js';

const collection = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>(
  'Ripple',
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection);
