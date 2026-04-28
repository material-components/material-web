/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/labs/gb/components/iconbutton/md-icon-button.js';
import '@material/web/labs/gb/styles/icon/md-icon.js';

import {MaterialStoryInit} from './material-collection.js';
import {
  IconButtonColor,
  IconButtonSize,
  IconButtonWidth,
} from '@material/web/labs/gb/components/iconbutton/icon-button.js';
import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.cssresult.js';
import {css, html, nothing} from 'lit';

/** Knob types for icon button stories. */
export interface StoryKnobs {
  icon: string;
  color?: IconButtonColor;
  size?: IconButtonSize;
  width?: IconButtonWidth;
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
      <md-icon-button
        color=${knobs.color || nothing}
        size=${knobs.size || nothing}
        width=${knobs.width || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        type=${knobs.toggle ? 'toggle' : nothing}>
        <md-icon>${knobs.icon}</md-icon>
      </md-icon-button>
    `;
  },
};

const colors: MaterialStoryInit<StoryKnobs> = {
  name: 'Colors',
  render(knobs) {
    return html`
      <md-icon-button
        color="filled"
        size=${knobs.size || nothing}
        width=${knobs.width || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        type=${knobs.toggle ? 'toggle' : nothing}>
        <md-icon>${knobs.icon}</md-icon>
      </md-icon-button>
      <md-icon-button
        color="tonal"
        size=${knobs.size || nothing}
        width=${knobs.width || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        type=${knobs.toggle ? 'toggle' : nothing}>
        <md-icon>${knobs.icon}</md-icon>
      </md-icon-button>
      <md-icon-button
        color="outlined"
        size=${knobs.size || nothing}
        width=${knobs.width || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        type=${knobs.toggle ? 'toggle' : nothing}>
        <md-icon>${knobs.icon}</md-icon>
      </md-icon-button>
      <md-icon-button
        color="standard"
        size=${knobs.size || nothing}
        width=${knobs.width || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        type=${knobs.toggle ? 'toggle' : nothing}>
        <md-icon>${knobs.icon}</md-icon>
      </md-icon-button>
    `;
  },
};

const sizes: MaterialStoryInit<StoryKnobs> = {
  name: 'Sizes',
  render(knobs) {
    return html`
      <md-icon-button
        size="xs"
        color=${knobs.color || nothing}
        width=${knobs.width || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        type=${knobs.toggle ? 'toggle' : nothing}>
        <md-icon>${knobs.icon}</md-icon>
      </md-icon-button>
      <md-icon-button
        size="sm"
        color=${knobs.color || nothing}
        width=${knobs.width || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        type=${knobs.toggle ? 'toggle' : nothing}>
        <md-icon>${knobs.icon}</md-icon>
      </md-icon-button>
      <md-icon-button
        size="md"
        color=${knobs.color || nothing}
        width=${knobs.width || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        type=${knobs.toggle ? 'toggle' : nothing}>
        <md-icon>${knobs.icon}</md-icon>
      </md-icon-button>
      <md-icon-button
        size="lg"
        color=${knobs.color || nothing}
        width=${knobs.width || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        type=${knobs.toggle ? 'toggle' : nothing}>
        <md-icon>${knobs.icon}</md-icon>
      </md-icon-button>
      <md-icon-button
        size="xl"
        color=${knobs.color || nothing}
        width=${knobs.width || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        type=${knobs.toggle ? 'toggle' : nothing}>
        <md-icon>${knobs.icon}</md-icon>
      </md-icon-button>
    `;
  },
};

const widths: MaterialStoryInit<StoryKnobs> = {
  name: 'Widths',
  render(knobs) {
    return html`
      <md-icon-button
        width="narrow"
        color=${knobs.color || nothing}
        size=${knobs.size || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        type=${knobs.toggle ? 'toggle' : nothing}>
        <md-icon>${knobs.icon}</md-icon>
      </md-icon-button>
      <md-icon-button
        color=${knobs.color || nothing}
        size=${knobs.size || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        type=${knobs.toggle ? 'toggle' : nothing}>
        <md-icon>${knobs.icon}</md-icon>
      </md-icon-button>
      <md-icon-button
        width="wide"
        color=${knobs.color || nothing}
        size=${knobs.size || nothing}
        ?square=${knobs.square}
        ?disabled=${knobs.disabled}
        ?soft-disabled=${knobs.softDisabled}
        type=${knobs.toggle ? 'toggle' : nothing}>
        <md-icon>${knobs.icon}</md-icon>
      </md-icon-button>
    `;
  },
};

/** Icon Button stories. */
export const stories = [playground, colors, sizes, widths];
