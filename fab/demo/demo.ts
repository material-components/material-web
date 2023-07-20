/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import './index.js';
import './material-collection.js';

import {FabSize, FabVariant} from '@material/web/fab/fab.js';
import {KnobTypesToKnobs, MaterialCollection, materialInitsToStoryInits, setUpDemo} from './material-collection.js';
import {boolInput, Knob, selectDropdown, textInput} from './index.js';

import {stories, StoryKnobs} from './stories.js';

const collection = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>('Fab', [
  new Knob('icon', {defaultValue: 'edit', ui: textInput()}),
  new Knob('label', {defaultValue: '', ui: textInput()}),
  new Knob('lowered', {defaultValue: false, ui: boolInput()}),
  new Knob('size', {
    defaultValue: 'medium' as FabSize,
    ui: selectDropdown<FabSize>({
      options: [
        {label: 'medium', value: 'medium'},
        {label: 'small', value: 'small'},
        {label: 'large', value: 'large'},
      ]
    })
  }),
  new Knob('variant', {
    defaultValue: 'surface' as FabVariant,
    ui: selectDropdown<FabVariant>({
      options: [
        {label: 'surface', value: 'surface'},
        {label: 'primary', value: 'primary'},
        {label: 'secondary', value: 'secondary'},
        {label: 'tertiary', value: 'tertiary'},
      ]
    })
  }),
  new Knob('reducedTouchTarget', {defaultValue: false, ui: boolInput()}),
  new Knob('hasIcon', {defaultValue: true, ui: boolInput()}),
]);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {icons: 'material-symbols'});
