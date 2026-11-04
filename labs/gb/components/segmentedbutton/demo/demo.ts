/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import './material-collection.js';
import './index.js';

import {
  type KnobTypesToKnobs,
  MaterialCollection,
  materialInitsToStoryInits,
  setUpDemo,
} from './material-collection.js';
import {type SegmentedButtonSelection} from '@material/web/labs/gb/components/segmentedbutton/segmented-button.js';
import {
  boolInput,
  Knob,
  selectDropdown,
  textInput,
} from './index.js';

import {stories, type StoryKnobs} from './stories.js';

const collection = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>(
  'Segmented Button',
  [
    new Knob<SegmentedButtonSelection | undefined, 'selection'>('selection', {
      defaultValue: 'single',
      ui: selectDropdown<SegmentedButtonSelection>({
        options: [
          {value: 'single', label: 'Single'},
          {value: 'multiple', label: 'Multiple'},
        ],
      }),
    }),
    new Knob<'2' | '3' | '4' | '5' | undefined, 'segments'>('segments', {
      defaultValue: '3',
      ui: selectDropdown<'2' | '3' | '4' | '5'>({
        options: [
          {value: '2', label: '2'},
          {value: '3', label: '3'},
          {value: '4', label: '4'},
          {value: '5', label: '5'},
        ],
      }),
    }),
    new Knob<'label' | 'icon' | 'both' | undefined, 'content'>('content', {
      defaultValue: 'label',
      ui: selectDropdown<'label' | 'icon' | 'both'>({
        options: [
          {value: 'label', label: 'Label'},
          {value: 'icon', label: 'Icon'},
          {value: 'both', label: 'Both'},
        ],
      }),
    }),
    new Knob<'0' | '-1' | '-2' | '-3' | undefined, 'density'>('density', {
      defaultValue: '0',
      ui: selectDropdown<'0' | '-1' | '-2' | '-3'>({
        options: [
          {value: '0', label: '0 (Default)'},
          {value: '-1', label: '-1'},
          {value: '-2', label: '-2'},
          {value: '-3', label: '-3'},
        ],
      }),
    }),
    new Knob('disabled', {
      ui: boolInput(),
    }),
    new Knob<
      'none' | '0' | '1' | '2' | '3' | '4' | undefined,
      'disabledSegment'
    >('disabledSegment', {
      defaultValue: 'none',
      ui: selectDropdown<'none' | '0' | '1' | '2' | '3' | '4'>({
        options: [
          {value: 'none', label: 'None'},
          {value: '0', label: 'First'},
          {value: '1', label: 'Second'},
          {value: '2', label: 'Third'},
          {value: '3', label: 'Fourth'},
          {value: '4', label: 'Fifth'},
        ],
      }),
    }),
    new Knob('ariaLabel', {
      ui: textInput(),
      defaultValue: 'Select option',
    }),
  ],
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {fonts: 'roboto', icons: 'material-symbols'});
