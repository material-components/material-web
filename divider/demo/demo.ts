/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import './index.js';
import './material-collection.js';

import {KnobTypesToKnobs, MaterialCollection, materialInitsToStoryInits, setUpDemo} from './material-collection.js';
import {boolInput, Knob} from './index.js';

import {stories, StoryKnobs} from './stories.js.js';

const collection =
    new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>('Divider', [
      new Knob('inset', {defaultValue: false, ui: boolInput()}),
      new Knob('inset (start)', {defaultValue: false, ui: boolInput()}),
      new Knob('inset (end)', {defaultValue: false, ui: boolInput()}),
    ]);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection);
