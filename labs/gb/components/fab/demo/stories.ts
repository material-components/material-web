/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/labs/gb/components/fab/md-gb-fab.js';
import '@material/web/labs/gb/styles/icon/md-gb-icon.js';

import {MaterialStoryInit} from './material-collection.js';
import {FabColor, FabSize} from '@material/web/labs/gb/components/fab/fab.js';
import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.cssresult.js';
import {css, html, nothing} from 'lit';

/** Knob types for fab stories. */
export interface StoryKnobs {
  icon: string;
  label: string;
  color?: FabColor;
  size?: FabSize;
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
      <md-gb-fab
        color="${knobs.color || nothing}"
        size="${knobs.size || nothing}">
        <md-gb-icon>${knobs.icon}</md-gb-icon>
        ${knobs.label}
      </md-gb-fab>
    `;
  },
};

const extendedFab: MaterialStoryInit<StoryKnobs> = {
  name: 'Extended FAB',
  render(knobs) {
    return html`
      <md-gb-fab
        color="${knobs.color || nothing}"
        size="${knobs.size || nothing}">
        <md-gb-icon>${knobs.icon || 'add'}</md-gb-icon>
        ${knobs.label || 'Add'}
      </md-gb-fab>
    `;
  },
};

const colors: MaterialStoryInit<StoryKnobs> = {
  name: 'Colors',
  render(knobs) {
    return html`
      <md-gb-fab color="primary-container" size="${knobs.size || nothing}">
        <md-gb-icon>${knobs.icon}</md-gb-icon>
        ${knobs.label}
      </md-gb-fab>
      <md-gb-fab color="secondary-container" size="${knobs.size || nothing}">
        <md-gb-icon>${knobs.icon}</md-gb-icon>
        ${knobs.label}
      </md-gb-fab>
      <md-gb-fab color="tertiary-container" size="${knobs.size || nothing}">
        <md-gb-icon>${knobs.icon}</md-gb-icon>
        ${knobs.label}
      </md-gb-fab>
      <md-gb-fab color="primary" size="${knobs.size || nothing}">
        <md-gb-icon>${knobs.icon}</md-gb-icon>
        ${knobs.label}
      </md-gb-fab>
      <md-gb-fab color="secondary" size="${knobs.size || nothing}">
        <md-gb-icon>${knobs.icon}</md-gb-icon>
        ${knobs.label}
      </md-gb-fab>
      <md-gb-fab color="tertiary" size="${knobs.size || nothing}">
        <md-gb-icon>${knobs.icon}</md-gb-icon>
        ${knobs.label}
      </md-gb-fab>
    `;
  },
};

const sizes: MaterialStoryInit<StoryKnobs> = {
  name: 'Sizes',
  render(knobs) {
    return html`
      <md-gb-fab color="${knobs.color || nothing}">
        <md-gb-icon>${knobs.icon}</md-gb-icon>
        ${knobs.label}
      </md-gb-fab>
      <md-gb-fab color="${knobs.color || nothing}" size="md">
        <md-gb-icon>${knobs.icon}</md-gb-icon>
        ${knobs.label}
      </md-gb-fab>
      <md-gb-fab color="${knobs.color || nothing}" size="lg">
        <md-gb-icon>${knobs.icon}</md-gb-icon>
        ${knobs.label}
      </md-gb-fab>
    `;
  },
};

/** Fab stories. */
export const stories = [playground, extendedFab, colors, sizes];
