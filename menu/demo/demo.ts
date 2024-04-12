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
  title,
} from './material-collection.js';
import {Corner, FocusState} from '@material/web/menu/menu.js';
import {
  boolInput,
  Knob,
  numberInput,
  selectDropdown,
  textInput,
} from './index.js';

import {stories, StoryKnobs} from './stories.js';

const collection = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>(
  'Menu',
  [
    new Knob('menu', {ui: title()}),
    new Knob('anchorCorner', {
      defaultValue: Corner.END_START as Corner,
      ui: selectDropdown<Corner>({
        options: [
          {label: Corner.START_START, value: Corner.START_START},
          {label: Corner.START_END, value: Corner.START_END},
          {label: Corner.END_START, value: Corner.END_START},
          {label: Corner.END_END, value: Corner.END_END},
        ],
      }),
    }),
    new Knob('menuCorner', {
      defaultValue: Corner.START_START as Corner,
      ui: selectDropdown<Corner>({
        options: [
          {label: Corner.START_START, value: Corner.START_START},
          {label: Corner.START_END, value: Corner.START_END},
          {label: Corner.END_START, value: Corner.END_START},
          {label: Corner.END_END, value: Corner.END_END},
        ],
      }),
    }),
    new Knob('defaultFocus', {
      defaultValue: FocusState.FIRST_ITEM as FocusState,
      ui: selectDropdown<FocusState>({
        options: [
          {label: FocusState.FIRST_ITEM, value: FocusState.FIRST_ITEM},
          {label: FocusState.LAST_ITEM, value: FocusState.LAST_ITEM},
          {label: FocusState.LIST_ROOT, value: FocusState.LIST_ROOT},
          {label: FocusState.NONE, value: FocusState.NONE},
        ],
      }),
    }),
    new Knob('positioning', {
      defaultValue: 'absolute' as const,
      ui: selectDropdown<'absolute' | 'fixed' | 'document' | 'popover'>({
        options: [
          {label: 'absolute', value: 'absolute'},
          {label: 'fixed', value: 'fixed'},
          {label: 'document', value: 'document'},
          {label: 'popover', value: 'popover'},
        ],
      }),
    }),
    new Knob('open', {
      defaultValue: false,
      ui: boolInput(),
    }),
    new Knob('quick', {
      defaultValue: false,
      ui: boolInput(),
    }),
    new Knob('hasOverflow', {
      defaultValue: false,
      ui: boolInput(),
    }),
    new Knob('stayOpenOnOutsideClick', {
      defaultValue: false,
      ui: boolInput(),
    }),
    new Knob('stayOpenOnFocusout', {
      defaultValue: false,
      ui: boolInput(),
    }),
    new Knob('skipRestoreFocus', {
      defaultValue: false,
      ui: boolInput(),
    }),
    new Knob('xOffset', {
      defaultValue: 0,
      ui: numberInput(),
    }),
    new Knob('yOffset', {
      defaultValue: 0,
      ui: numberInput(),
    }),
    new Knob('typeaheadDelay', {
      defaultValue: 200,
      ui: numberInput(),
    }),
    new Knob('listTabIndex', {
      defaultValue: -1,
      ui: numberInput(),
    }),

    // menu-item knobs
    new Knob('menu-item', {ui: title()}),
    new Knob('keepOpen', {
      defaultValue: false,
      ui: boolInput(),
    }),
    new Knob('disabled', {
      defaultValue: false,
      ui: boolInput(),
    }),
    new Knob('href', {
      defaultValue: 'https://google.com',
      ui: textInput(),
    }),
    new Knob('link icon', {
      defaultValue: 'open_in_new',
      ui: textInput(),
    }),

    // sub-menu knobs
    new Knob('sub-menu', {ui: title()}),
    new Knob('submenu.anchorCorner', {
      defaultValue: Corner.START_END as Corner,
      ui: selectDropdown<Corner>({
        options: [
          {label: Corner.START_START, value: Corner.START_START},
          {label: Corner.START_END, value: Corner.START_END},
          {label: Corner.END_START, value: Corner.END_START},
          {label: Corner.END_END, value: Corner.END_END},
        ],
      }),
    }),
    new Knob('submenu.menuCorner', {
      defaultValue: Corner.START_START as Corner,
      ui: selectDropdown<Corner>({
        options: [
          {label: Corner.START_START, value: Corner.START_START},
          {label: Corner.START_END, value: Corner.START_END},
          {label: Corner.END_START, value: Corner.END_START},
          {label: Corner.END_END, value: Corner.END_END},
        ],
      }),
    }),
    new Knob('hoverOpenDelay', {
      defaultValue: 400,
      ui: numberInput(),
    }),
    new Knob('hoverCloseDelay', {
      defaultValue: 400,
      ui: numberInput(),
    }),
    new Knob('submenu item icon', {
      defaultValue: 'navigate_next',
      ui: textInput(),
    }),
  ],
);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {fonts: 'roboto', icons: 'material-symbols'});
