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
import {type SheetPosition} from '@material/web/labs/gb/components/sheet/sheet.js';
import {
  boolInput,
  Knob,
  type RenderKnobPanelParams,
  selectDropdown,
  textInput,
} from './index.js';
import {html} from 'lit';

import {stories, type StoryKnobs} from './stories.js';

const collection = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>(
  'Sheet',
  [
    new Knob('headline', {
      ui: textInput(),
      defaultValue: 'Sheet title',
    }),
    new Knob<SheetPosition | undefined, 'position'>('position', {
      ui: selectDropdown<SheetPosition>({
        options: [
          {value: 'side', label: 'Side'},
          {value: 'bottom', label: 'Bottom'},
          {value: 'floating', label: 'Floating'},
        ],
      }),
      defaultValue: 'side',
    }),
    new Knob('open', {ui: boolInput(), defaultValue: true}),
    new Knob('modal', {ui: boolInput(), defaultValue: true}),
    new Knob('detached', {ui: boolInput(), defaultValue: false}),
    new Knob('hasDragHandle', {ui: boolInput(), defaultValue: false}),
    new Knob('hasBackButton', {ui: boolInput(), defaultValue: false}),
    new Knob('hasCloseButton', {ui: boolInput(), defaultValue: true}),
    new Knob('hasActionButtons', {ui: boolInput(), defaultValue: true}),
    new Knob('divideActionButtons', {ui: boolInput(), defaultValue: false}),
  ],
);

collection.renderUi = () => ({
  knobPanel: (props: RenderKnobPanelParams) => html`
    <style>
      story-knob-panel {
        color-scheme: light;
      }
      story-knob-panel input,
      story-knob-panel textarea {
        background-color: white;
        color: black;
        border: 1px solid #767676;
      }
    </style>
    <story-knob-panel
      .showCloseIcon=${props.showCloseIcon}
      .open=${props.open}
      .type=${props.type}
      @open-changed=${props.onOpenChanged}>
      ${props.knobsUi}
    </story-knob-panel>
  `,
});

collection.addStories(...materialInitsToStoryInits(stories));

setUpDemo(collection, {fonts: 'roboto', icons: 'material-symbols'});
