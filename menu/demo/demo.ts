/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import './index.js';
import './material-collection.js';

import {KnobTypesToKnobs, MaterialCollection, materialInitsToStoryInits, setUpDemo, title} from './material-collection.js';
import {Corner, DefaultFocusState} from '@material/web/menu/menu.js';
import {boolInput, Knob, numberInput, selectDropdown, textInput} from './index.js';

import {stories, StoryKnobs} from './stories.js.js';

const collection =
    new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>('Menu', [
      new Knob('menu', {ui: title()}),
      new Knob('anchorCorner', {
        defaultValue: 'END_START' as Corner,
        ui: selectDropdown<Corner>({
          options: [
            {label: 'START_START', value: 'START_START'},
            {label: 'START_END', value: 'START_END'},
            {label: 'END_START', value: 'END_START'},
            {label: 'END_END', value: 'END_END'},
          ]
        }),
      }),
      new Knob('menuCorner', {
        defaultValue: 'START_START' as Corner,
        ui: selectDropdown<Corner>({
          options: [
            {label: 'START_START', value: 'START_START'},
            {label: 'START_END', value: 'START_END'},
            {label: 'END_START', value: 'END_START'},
            {label: 'END_END', value: 'END_END'},
          ]
        }),
      }),
      new Knob('defaultFocus', {
        defaultValue: 'LIST_ROOT' as const,
        ui: selectDropdown<DefaultFocusState>({
          options: [
            {label: 'LIST_ROOT', value: 'LIST_ROOT'},
            {label: 'FIRST_ITEM', value: 'FIRST_ITEM'},
            {label: 'LAST_ITEM', value: 'LAST_ITEM'},
            {label: 'NONE', value: 'NONE'},
          ]
        }),
      }),
      new Knob('open', {
        defaultValue: false,
        ui: boolInput(),
      }),
      new Knob('fixed', {
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
      new Knob('typeaheadBufferTime', {
        defaultValue: 200,
        ui: numberInput(),
      }),
      new Knob('listTabIndex', {
        defaultValue: 0,
        ui: numberInput(),
      }),
      new Knob('ariaLabel', {
        defaultValue: '0',
        ui: textInput(),
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

      // menu-item-link knobs
      new Knob('menu-item-link', {ui: title()}),
      new Knob('href', {
        defaultValue: 'https://google.com',
        ui: textInput(),
      }),
      new Knob('target', {
        defaultValue: '',
        ui: textInput(),
      }),
      new Knob('link icon', {
        defaultValue: 'open_in_new',
        ui: textInput(),
      }),


      // sub-menu-item knobs
      new Knob('sub-menu-item', {ui: title()}),
      new Knob('submenu.anchorCorner', {
        defaultValue: 'START_END' as Corner,
        ui: selectDropdown<Corner>({
          options: [
            {label: 'START_START', value: 'START_START'},
            {label: 'START_END', value: 'START_END'},
            {label: 'END_START', value: 'END_START'},
            {label: 'END_END', value: 'END_END'},
          ]
        }),
      }),
      new Knob('submenu.menuCorner', {
        defaultValue: 'START_START' as Corner,
        ui: selectDropdown<Corner>({
          options: [
            {label: 'START_START', value: 'START_START'},
            {label: 'START_END', value: 'START_END'},
            {label: 'END_START', value: 'END_START'},
            {label: 'END_END', value: 'END_END'},
          ]
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
      new Knob('submenu icon', {
        defaultValue: 'navigate_next',
        ui: textInput(),
      }),
    ]);

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {fonts: 'roboto', icons: 'material-symbols'});
