/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import './index.js';
import './material-collection.js';

import {KnobTypesToKnobs, MaterialCollection, materialInitsToStoryInits, setUpDemo} from './material-collection.js';
import {boolInput, Knob, radioSelector, textInput} from './index.js';

import {stories, StoryKnobs} from './stories.js';

const collection =
    new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>('Icon Button', [
      new Knob('icon', {ui: textInput(), defaultValue: 'check'}),
      new Knob('ariaLabel', {ui: textInput(), defaultValue: ''}),
      new Knob(
          'href', {ui: textInput(), defaultValue: 'https://www.google.com'}),
      new Knob<'_blank'|'_self', 'target'>('target', {
        ui: radioSelector({
          options: [
            {value: '_blank', label: '_blank'}, {value: '_self', label: '_self'}
          ],
          name: 'target'
        }),
        defaultValue: '_blank'
      }),
      new Knob('selectedIcon', {ui: textInput(), defaultValue: 'star'}),
      new Knob('ariaLabelSelected', {ui: textInput(), defaultValue: ''}),
      new Knob('selected', {ui: boolInput(), defaultValue: false}),
      new Knob('disabled', {ui: boolInput(), defaultValue: false}),
      new Knob('flipIconInRtl', {ui: boolInput(), defaultValue: false}),
    ]);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {icons: 'material-symbols'});
