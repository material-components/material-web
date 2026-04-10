/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/icon/icon.js';
import '@material/web/labs/gb/components/fab/md-fab.js';

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
      <md-fab color="${knobs.color || nothing}" size="${knobs.size || nothing}">
        <md-icon>${knobs.icon}</md-icon>
        ${knobs.label}
      </md-fab>
    `;
  },
};

const extendedFab: MaterialStoryInit<StoryKnobs> = {
  name: 'Extended FAB',
  render(knobs) {
    return html`
      <md-fab color="${knobs.color || nothing}" size="${knobs.size || nothing}">
        <md-icon>${knobs.icon || 'add'}</md-icon>
        ${knobs.label || 'Add'}
      </md-fab>
    `;
  },
};

const colors: MaterialStoryInit<StoryKnobs> = {
  name: 'Colors',
  render(knobs) {
    return html`
      <md-fab color="primary-container" size="${knobs.size || nothing}">
        <md-icon>${knobs.icon}</md-icon>
        ${knobs.label}
      </md-fab>
      <md-fab color="secondary-container" size="${knobs.size || nothing}">
        <md-icon>${knobs.icon}</md-icon>
        ${knobs.label}
      </md-fab>
      <md-fab color="tertiary-container" size="${knobs.size || nothing}">
        <md-icon>${knobs.icon}</md-icon>
        ${knobs.label}
      </md-fab>
      <md-fab color="primary" size="${knobs.size || nothing}">
        <md-icon>${knobs.icon}</md-icon>
        ${knobs.label}
      </md-fab>
      <md-fab color="secondary" size="${knobs.size || nothing}">
        <md-icon>${knobs.icon}</md-icon>
        ${knobs.label}
      </md-fab>
      <md-fab color="tertiary" size="${knobs.size || nothing}">
        <md-icon>${knobs.icon}</md-icon>
        ${knobs.label}
      </md-fab>
    `;
  },
};

const sizes: MaterialStoryInit<StoryKnobs> = {
  name: 'Sizes',
  render(knobs) {
    return html`
      <md-fab color="${knobs.color || nothing}">
        <md-icon>${knobs.icon}</md-icon>
        ${knobs.label}
      </md-fab>
      <md-fab color="${knobs.color || nothing}" size="md">
        <md-icon>${knobs.icon}</md-icon>
        ${knobs.label}
      </md-fab>
      <md-fab color="${knobs.color || nothing}" size="lg">
        <md-icon>${knobs.icon}</md-icon>
        ${knobs.label}
      </md-fab>
    `;
  },
};

/** Fab stories. */
export const stories = [playground, extendedFab, colors, sizes];
