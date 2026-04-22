/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/labs/gb/components/button/md-button.js';

import {MaterialStoryInit} from './material-collection.js';
import {
  ButtonColor,
  ButtonSize,
} from '@material/web/labs/gb/components/button/button.js';
import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.cssresult.js';
import {html, nothing} from 'lit';

/** Knob types for button stories. */
export interface StoryKnobs {
  color?: ButtonColor;
  size?: ButtonSize;
  square: boolean;
  disabled: boolean;
  softDisabled: boolean;
  toggle: boolean;
}

adoptStyles(document, [m3Styles]);

const playground: MaterialStoryInit<StoryKnobs> = {
  name: 'Playground',
  render(knobs) {
    return html`
      <md-button
        color=${knobs.color || nothing}
        size=${knobs.size || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        type=${knobs.toggle ? 'toggle' : nothing}>
        Label
      </md-button>
    `;
  },
};

const colors: MaterialStoryInit<StoryKnobs> = {
  name: 'Colors',
  render(knobs) {
    return html`
      <md-button
        color="filled"
        size=${knobs.size || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        type=${knobs.toggle ? 'toggle' : nothing}>
        Filled
      </md-button>
      <md-button
        color="elevated"
        size=${knobs.size || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        type=${knobs.toggle ? 'toggle' : nothing}>
        Elevated
      </md-button>
      <md-button
        color="outlined"
        size=${knobs.size || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        type=${knobs.toggle ? 'toggle' : nothing}>
        Outlined
      </md-button>
      <md-button
        color="tonal"
        size=${knobs.size || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        type=${knobs.toggle ? 'toggle' : nothing}>
        Tonal
      </md-button>
      <md-button
        color="text"
        size=${knobs.size || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        type=${knobs.toggle ? 'toggle' : nothing}>
        Text
      </md-button>
    `;
  },
};

const sizes: MaterialStoryInit<StoryKnobs> = {
  name: 'Sizes',
  render(knobs) {
    return html`
      <md-button
        size="xs"
        color=${knobs.color || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        type=${knobs.toggle ? 'toggle' : nothing}>
        XS
      </md-button>
      <md-button
        size="sm"
        color=${knobs.color || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        type=${knobs.toggle ? 'toggle' : nothing}>
        SM
      </md-button>
      <md-button
        size="md"
        color=${knobs.color || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        type=${knobs.toggle ? 'toggle' : nothing}>
        MD
      </md-button>
      <md-button
        size="lg"
        color=${knobs.color || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        type=${knobs.toggle ? 'toggle' : nothing}>
        LG
      </md-button>
      <md-button
        size="xl"
        color=${knobs.color || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        type=${knobs.toggle ? 'toggle' : nothing}>
        XL
      </md-button>
    `;
  },
};

/** Button stories. */
export const stories = [playground, colors, sizes];
