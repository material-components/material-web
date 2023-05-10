/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import './index.js';
import './material-collection.js';

import {KnobTypesToKnobs, MaterialCollection, materialInitsToStoryInits, setUpDemo} from './material-collection.js';

import {stories, StoryKnobs} from './stories.js';

const collection = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>(
    'Segmented Button Set', []);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {icons: 'material-symbols'});
