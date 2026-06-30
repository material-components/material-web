/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import './material-collection.js';
import './index.js';

import {
  MaterialCollection,
  materialInitsToStoryInits,
  setUpDemo,
} from './material-collection.js';

import {stories} from './stories.js';

const collection = new MaterialCollection('Badge', []);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {fonts: 'roboto', icons: 'material-symbols'});
