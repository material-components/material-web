/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import './index.js';
import './material-collection.js';

import {KnobTypesToKnobs, MaterialCollection, materialInitsToStoryInits, setUpDemo} from './material-collection.js';
import {boolInput, Knob, selectDropdown} from './index.js';

import {stories, StoryKnobs} from './stories.js.js';

const collection =
    new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>('Radio', [
      new Knob('checked', {
        ui: selectDropdown({
          options: [
            {value: '0', label: 'First'},
            {value: '1', label: 'Second'},
            {value: '2', label: 'Third'},
          ],
        }),
        defaultValue: '1'
      }),
      new Knob('disabled', {ui: boolInput(), defaultValue: false}),
    ]);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection);
