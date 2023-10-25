/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/icon/icon.js';
import '@material/web/labs/segmentedbutton/outlined-segmented-button.js';
import '@material/web/labs/segmentedbuttonset/outlined-segmented-button-set.js';

import {MaterialStoryInit} from './material-collection.js';
import {html} from 'lit';

/** Knob types for Segmented Button Set stories. */
export interface StoryKnobs {}

const standard: MaterialStoryInit<StoryKnobs> = {
  name: '<md-outlined-segmented-button-set> labels and icons',
  render() {
    return html` <div style="width:325px">
      <md-outlined-segmented-button-set>
        <md-outlined-segmented-button label="Enabled">
          <md-icon slot="icon">grade</md-icon>
        </md-outlined-segmented-button>

        <md-outlined-segmented-button selected label="Selected">
          <md-icon slot="icon">favorite</md-icon>
        </md-outlined-segmented-button>

        <md-outlined-segmented-button label="Enabled">
          <md-icon slot="icon">change_history</md-icon>
        </md-outlined-segmented-button>
      </md-outlined-segmented-button-set>
    </div>`;
  },
};

const withoutIcons: MaterialStoryInit<StoryKnobs> = {
  name: '<md-outlined-segmented-button-set> without icons',
  render() {
    return html` <div style="width:325px">
      <md-outlined-segmented-button-set>
        <md-outlined-segmented-button selected label="Selected">
        </md-outlined-segmented-button>

        <md-outlined-segmented-button label="Enabled">
        </md-outlined-segmented-button>

        <md-outlined-segmented-button label="Enabled">
        </md-outlined-segmented-button>
      </md-outlined-segmented-button-set>
    </div>`;
  },
};

const multiselect: MaterialStoryInit<StoryKnobs> = {
  name: '<md-outlined-segmented-button-set> Multiselect',
  render() {
    return html` <div style="width:325px">
      <md-outlined-segmented-button-set multiselect>
        <md-outlined-segmented-button selected label="$">
        </md-outlined-segmented-button>

        <md-outlined-segmented-button selected label="$$">
        </md-outlined-segmented-button>

        <md-outlined-segmented-button label="$$$">
        </md-outlined-segmented-button>

        <md-outlined-segmented-button label="$$$">
        </md-outlined-segmented-button>
      </md-outlined-segmented-button-set>
    </div>`;
  },
};

const transportationModes: MaterialStoryInit<StoryKnobs> = {
  name: 'Transportaton modes',
  render() {
    return html` <div style="width:202px">
      <md-outlined-segmented-button-set>
        <md-outlined-segmented-button>
          <md-icon slot="icon">directions_walk</md-icon>
        </md-outlined-segmented-button>

        <md-outlined-segmented-button>
          <md-icon slot="icon">directions_subway</md-icon>
        </md-outlined-segmented-button>

        <md-outlined-segmented-button selected>
          <md-icon slot="icon">directions_car</md-icon>
        </md-outlined-segmented-button>
      </md-outlined-segmented-button-set>
    </div>`;
  },
};

const iconOnly: MaterialStoryInit<StoryKnobs> = {
  name: 'Icon only (no checkmark)',
  render() {
    return html` <div style="width:202px;">
      <md-outlined-segmented-button-set>
        <md-outlined-segmented-button noCheckmark selected>
          <md-icon slot="icon">format_align_left</md-icon>
        </md-outlined-segmented-button>

        <md-outlined-segmented-button noCheckmark>
          <md-icon slot="icon">format_align_center</md-icon>
        </md-outlined-segmented-button>

        <md-outlined-segmented-button noCheckmark>
          <md-icon slot="icon">format_align_right</md-icon>
        </md-outlined-segmented-button>
      </md-outlined-segmented-button-set>
    </div>`;
  },
};

const singleSelect: MaterialStoryInit<StoryKnobs> = {
  name: 'Single select',
  render() {
    return html` <div style="width:400px">
      <md-outlined-segmented-button-set>
        <md-outlined-segmented-button label="Label">
          <md-icon slot="icon">star</md-icon>
        </md-outlined-segmented-button>

        <md-outlined-segmented-button disabled label="Label">
        </md-outlined-segmented-button>

        <md-outlined-segmented-button>
          <md-icon slot="icon">directions_bus</md-icon>
        </md-outlined-segmented-button>

        <md-outlined-segmented-button label="Label">
        </md-outlined-segmented-button>
      </md-outlined-segmented-button-set>
    </div>`;
  },
};

const multiSelect2: MaterialStoryInit<StoryKnobs> = {
  name: 'Multi select',
  render() {
    return html` <div style="width:400px">
      <md-outlined-segmented-button-set multiselect>
        <md-outlined-segmented-button label="Label">
        </md-outlined-segmented-button>

        <md-outlined-segmented-button disabled selected label="Label">
        </md-outlined-segmented-button>

        <md-outlined-segmented-button label="Label">
        </md-outlined-segmented-button>

        <md-outlined-segmented-button label="Label">
        </md-outlined-segmented-button>
      </md-outlined-segmented-button-set>
    </div>`;
  },
};

/** Segmented Button Set stories. */
export const stories = [
  standard,
  withoutIcons,
  multiselect,
  transportationModes,
  iconOnly,
  singleSelect,
  multiSelect2,
];
