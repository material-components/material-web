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
    new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>('Dialog', [
      new Knob('footerHidden', {defaultValue: false, ui: boolInput()}),
      new Knob('icon', {defaultValue: '', ui: textInput()}),
      new Knob('headline', {defaultValue: 'Dialog', ui: textInput()}),
      new Knob(
          'supportingText',
          {defaultValue: 'Just a simple dialog.', ui: textInput()}),
    ]);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {icons: 'material-symbols'});
