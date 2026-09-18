/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/labs/gb/components/button/md-gb-button.js';
import '@material/web/labs/gb/styles/icon/md-gb-icon.js';

import {MaterialStoryInit} from './material-collection.js';
import {
  ButtonColor,
  ButtonSize,
} from '@material/web/labs/gb/components/button/button.js';
import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.cssresult.js';
import {css, html, nothing} from 'lit';

/** Knob types for button stories. */
export interface StoryKnobs {
  icon: string;
  color?: ButtonColor;
  size?: ButtonSize;
  square: boolean;
  disabled: boolean;
  softDisabled: boolean;
  toggle: boolean;
}

adoptStyles(document, [
  m3Styles,
  css`
    :root {
      --md-icon-font: 'Material Symbols Outlined';
    }
  `,
]);

const playground: MaterialStoryInit<StoryKnobs> = {
  name: 'Playground',
  render(knobs) {
    return html`
      <md-gb-button
        color=${knobs.color || nothing}
        size=${knobs.size || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        type=${knobs.toggle ? 'toggle' : nothing}>
        ${knobs.icon ? html`<md-gb-icon>${knobs.icon}</md-gb-icon>` : nothing}
        Label
      </md-gb-button>
    `;
  },
};

const colors: MaterialStoryInit<StoryKnobs> = {
  name: 'Colors',
  render(knobs) {
    return html`
      <md-gb-button
        color="filled"
        size=${knobs.size || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        type=${knobs.toggle ? 'toggle' : nothing}>
        ${knobs.icon ? html`<md-gb-icon>${knobs.icon}</md-gb-icon>` : nothing}
        Filled
      </md-gb-button>
      <md-gb-button
        color="elevated"
        size=${knobs.size || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        type=${knobs.toggle ? 'toggle' : nothing}>
        ${knobs.icon ? html`<md-gb-icon>${knobs.icon}</md-gb-icon>` : nothing}
        Elevated
      </md-gb-button>
      <md-gb-button
        color="outlined"
        size=${knobs.size || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        type=${knobs.toggle ? 'toggle' : nothing}>
        ${knobs.icon ? html`<md-gb-icon>${knobs.icon}</md-gb-icon>` : nothing}
        Outlined
      </md-gb-button>
      <md-gb-button
        color="tonal"
        size=${knobs.size || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        type=${knobs.toggle ? 'toggle' : nothing}>
        ${knobs.icon ? html`<md-gb-icon>${knobs.icon}</md-gb-icon>` : nothing}
        Tonal
      </md-gb-button>
      <md-gb-button
        color="text"
        size=${knobs.size || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        type=${knobs.toggle ? 'toggle' : nothing}>
        ${knobs.icon ? html`<md-gb-icon>${knobs.icon}</md-gb-icon>` : nothing}
        Text
      </md-gb-button>
    `;
  },
};

const sizes: MaterialStoryInit<StoryKnobs> = {
  name: 'Sizes',
  render(knobs) {
    return html`
      <md-gb-button
        size="xs"
        color=${knobs.color || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        type=${knobs.toggle ? 'toggle' : nothing}>
        ${knobs.icon ? html`<md-gb-icon>${knobs.icon}</md-gb-icon>` : nothing}
        XS
      </md-gb-button>
      <md-gb-button
        size="sm"
        color=${knobs.color || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        type=${knobs.toggle ? 'toggle' : nothing}>
        ${knobs.icon ? html`<md-gb-icon>${knobs.icon}</md-gb-icon>` : nothing}
        SM
      </md-gb-button>
      <md-gb-button
        size="md"
        color=${knobs.color || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        type=${knobs.toggle ? 'toggle' : nothing}>
        ${knobs.icon ? html`<md-gb-icon>${knobs.icon}</md-gb-icon>` : nothing}
        MD
      </md-gb-button>
      <md-gb-button
        size="lg"
        color=${knobs.color || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        type=${knobs.toggle ? 'toggle' : nothing}>
        ${knobs.icon ? html`<md-gb-icon>${knobs.icon}</md-gb-icon>` : nothing}
        LG
      </md-gb-button>
      <md-gb-button
        size="xl"
        color=${knobs.color || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        type=${knobs.toggle ? 'toggle' : nothing}>
        ${knobs.icon ? html`<md-gb-icon>${knobs.icon}</md-gb-icon>` : nothing}
        XL
      </md-gb-button>
    `;
  },
};

/** Button stories. */
export const stories = [playground, colors, sizes];
