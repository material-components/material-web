/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import './material-collection.js';
import './index.js';

import {
  KnobTypesToKnobs,
  MaterialCollection,
  materialInitsToStoryInits,
  setUpDemo,
} from './material-collection.js';
import {
  colorPicker,
  cssCustomProperty,
  Knob,
  numberInput,
} from './index.js';

import {stories, StoryKnobs} from './stories.js';

function cssCustomPropertyAsNumber(
  knob: Knob<number>,
  val: number,
  container: HTMLElement,
) {
  const value = knob.isUnset ? knob.defaultValue : val;
  if (value) {
    container.style.setProperty(knob.name, String(value));
  } else {
    container.style.removeProperty(knob.name);
  }
}

const collection = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>(
  'Ripple',
  [
    new Knob('--md-ripple-pressed-color', {
      ui: colorPicker(),
      wiring: cssCustomProperty,
    }),
    new Knob('--md-ripple-pressed-opacity', {
      ui: numberInput({step: 0.01}),
      defaultValue: 0.12,
      wiring: cssCustomPropertyAsNumber,
    }),
    new Knob('--md-ripple-hover-color', {
      ui: colorPicker(),
      wiring: cssCustomProperty,
    }),
    new Knob('--md-ripple-hover-opacity', {
      ui: numberInput({step: 0.01}),
      defaultValue: 0.08,
      wiring: cssCustomPropertyAsNumber,
    }),
  ],
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection);
