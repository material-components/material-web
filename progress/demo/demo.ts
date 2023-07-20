/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import './index.js';
import './material-collection.js';

import {KnobTypesToKnobs, MaterialCollection, materialInitsToStoryInits, setUpDemo} from './material-collection.js';
import {boolInput, colorPicker, Knob, numberInput} from './index.js';

import {stories, StoryKnobs} from './stories.js';

function cssWire<T = string>(prop: string, unit = '') {
  return (knob: Knob<T>) => {
    const value =
        knob.latestValue === undefined ? knob.defaultValue : knob.latestValue;
    document.body.style.setProperty(prop, `${value}${unit}`);
  };
}

const collection = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>(
    'Progress indicators', [
      new Knob('value', {ui: numberInput({step: 0.1}), defaultValue: 0.5}),
      new Knob('indeterminate', {ui: boolInput(), defaultValue: false}),
      new Knob('fourColor', {ui: boolInput(), defaultValue: false}),
      new Knob(
          'buffer (linear)', {ui: numberInput({step: 0.1}), defaultValue: 0.8}),
      new Knob('track color (linear)', {
        ui: colorPicker(),
        defaultValue: '',
        wiring: cssWire('--md-linear-progress-track-color')
      }),
      new Knob('track height (linear)', {
        ui: numberInput(),
        defaultValue: 4,
        wiring: cssWire<number>('--md-linear-progress-track-height', 'px')
      }),
      new Knob('indicator height (linear)', {
        ui: numberInput(),
        defaultValue: 4,
        wiring: cssWire<number>(
            '--md-linear-progress-active-indicator-height', 'px')
      }),
      new Knob('custom theme (linear)', {ui: boolInput()}),
      new Knob('size (circular)', {
        ui: numberInput(),
        defaultValue: 48,
        wiring: cssWire<number>('--md-circular-progress-size', 'px')
      }),
      new Knob('trackWidth (circular)', {
        ui: numberInput(),
        defaultValue: 8.33,
        wiring: cssWire<number>('--md-circular-progress-active-indicator-width')
      }),
    ]);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection);
