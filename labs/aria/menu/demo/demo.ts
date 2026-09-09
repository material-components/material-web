/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  MaterialCollection,
  materialInitsToStoryInits,
  setUpDemo,
} from './material-collection.js';

import {stories} from './stories.js';

const collection = new MaterialCollection('ARIA menu elements', []);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection);
