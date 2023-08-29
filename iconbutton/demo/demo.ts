/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import './index.js';
import './material-collection.js';

import {KnobTypesToKnobs, MaterialCollection, materialInitsToStoryInits, setUpDemo} from './material-collection.js';
import {boolInput, Knob, textInput} from './index.js';

import {stories, StoryKnobs} from './stories.js';

const collection =
    new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>('Icon Button', [
      new Knob('icon', {ui: textInput(), defaultValue: 'check'}),
      new Knob('selectedIcon', {ui: textInput(), defaultValue: 'close'}),
      new Knob('disabled', {ui: boolInput(), defaultValue: false}),
    ]);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {icons: 'material-symbols'});
