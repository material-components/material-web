/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import './index.js';
import './material-collection.js';

import {KnobTypesToKnobs, MaterialCollection, materialInitsToStoryInits, setUpDemo} from './material-collection.js';
import {boolInput, Knob, selectDropdown, textInput} from './index.js';

import {stories, StoryKnobs} from './stories.js';

const collection =
    new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>('Dialog', [
      new Knob('transition', {
        defaultValue: 'grow-down',
        ui: selectDropdown({
          options: [
            {label: 'grow-down', value: 'grow-down'},
            {label: 'grow-up', value: 'grow-up'},
            {label: 'grow-left', value: 'grow-left'},
            {label: 'grow-right', value: 'grow-right'},
            {label: 'grow', value: 'grow'},
            {label: 'shrink', value: 'shrink'},
            {label: 'none', value: ''},
          ]
        })
      }),
      new Knob('fullscreen', {defaultValue: false, ui: boolInput()}),
      new Knob('modeless', {defaultValue: false, ui: boolInput()}),
      new Knob('footerHidden', {defaultValue: false, ui: boolInput()}),
      new Knob('stacked', {defaultValue: false, ui: boolInput()}),
      new Knob('icon', {defaultValue: '', ui: textInput()}),
      new Knob('headline', {defaultValue: 'Dialog', ui: textInput()}),
      new Knob(
          'supportingText',
          {defaultValue: 'Just a simple dialog.', ui: textInput()}),
    ]);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {icons: 'material-symbols'});
