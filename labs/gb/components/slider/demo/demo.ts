/**
 * @license
 * Copyright 2026 Google LLC
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
  boolInput,
  Knob,
  numberInput,
  selectDropdown,
  textInput,
} from './index.js';

import {
  stories,
  StoryKnobs,
  type SliderOrientation,
  type SliderSize,
} from './stories.js';

const collection = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>(
  'Slider',
  [
    new Knob('value', {ui: numberInput(), defaultValue: 50}),
    new Knob('min', {ui: numberInput(), defaultValue: 0}),
    new Knob('max', {ui: numberInput(), defaultValue: 100}),
    new Knob('step', {ui: numberInput(), defaultValue: 10}),

    new Knob('valueStart', {ui: numberInput(), defaultValue: 20}),
    new Knob('valueEnd', {ui: numberInput(), defaultValue: 80}),

    new Knob<SliderSize | undefined, 'size'>('size', {
      ui: selectDropdown<SliderSize>({
        options: [
          {label: 'xs', value: 'xs'},
          {label: 'sm', value: 'sm'},
          {label: 'md', value: 'md'},
          {label: 'lg', value: 'lg'},
          {label: 'xl', value: 'xl'},
        ],
      }),
      defaultValue: 'xs',
    }),
    new Knob<SliderOrientation | undefined, 'orientation'>('orientation', {
      ui: selectDropdown<SliderOrientation>({
        options: [
          {label: 'horizontal', value: 'horizontal'},
          {label: 'vertical', value: 'vertical'},
        ],
      }),
      defaultValue: 'horizontal',
    }),
    new Knob('range', {ui: boolInput(), defaultValue: false}),
    new Knob('centered', {ui: boolInput(), defaultValue: false}),
    new Knob('stops', {ui: boolInput(), defaultValue: false}),
    new Knob('value indicator', {ui: boolInput(), defaultValue: false}),
    new Knob('disabled', {ui: boolInput(), defaultValue: false}),
    new Knob('valueLabel', {ui: textInput(), defaultValue: ''}),
  ] as unknown as KnobTypesToKnobs<StoryKnobs>,
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {fonts: 'roboto', icons: 'material-symbols'});
