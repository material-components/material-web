/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/labs/gb/components/toolbar/md-gb-toolbar.js';
import '@material/web/labs/gb/styles/icon/md-gb-icon.js';

import {MaterialStoryInit} from './material-collection.js';
import {
  type ToolbarColor,
  type ToolbarOrientation,
} from '@material/web/labs/gb/components/toolbar/toolbar.js';
import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.css' with {type: 'css'}; // github-only
// import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.cssresult.js'; // google3-only
import {css, html, nothing} from 'lit';

/** Knob types for toolbar stories. */
export interface StoryKnobs {
  color?: ToolbarColor;
  orientation?: ToolbarOrientation;
  docked: boolean;
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
      <md-gb-toolbar
        color=${knobs.color || nothing}
        orientation=${knobs.orientation || nothing}
        ?docked=${knobs.docked}>
        <md-gb-toolbar-icon-button
          icon="format_align_left"
          aria-label="Align Left"></md-gb-toolbar-icon-button>
        <md-gb-toolbar-icon-button
          icon="format_align_center"
          aria-label="Align Center"></md-gb-toolbar-icon-button>
        <md-gb-toolbar-icon-button
          icon="format_align_right"
          aria-label="Align Right"></md-gb-toolbar-icon-button>
        <md-gb-toolbar-separator></md-gb-toolbar-separator>
        <md-gb-toolbar-icon-button
          icon="format_bold"
          aria-label="Bold"></md-gb-toolbar-icon-button>
        <md-gb-toolbar-button
          icon="palette"
          label="Color"></md-gb-toolbar-button>
      </md-gb-toolbar>
    `;
  },
};

const vibrant: MaterialStoryInit<StoryKnobs> = {
  name: 'Vibrant',
  render(knobs) {
    return html`
      <md-gb-toolbar
        color="vibrant"
        orientation=${knobs.orientation || nothing}
        ?docked=${knobs.docked}>
        <md-gb-toolbar-icon-button
          icon="undo"
          aria-label="Undo"></md-gb-toolbar-icon-button>
        <md-gb-toolbar-icon-button
          icon="redo"
          aria-label="Redo"></md-gb-toolbar-icon-button>
        <md-gb-toolbar-separator></md-gb-toolbar-separator>
        <md-gb-toolbar-icon-button
          icon="share"
          aria-label="Share"></md-gb-toolbar-icon-button>
      </md-gb-toolbar>
    `;
  },
};

const docked: MaterialStoryInit<StoryKnobs> = {
  name: 'Docked',
  render(knobs) {
    return html`
      <md-gb-toolbar
        color=${knobs.color || nothing}
        orientation=${knobs.orientation || nothing}
        docked>
        <md-gb-toolbar-icon-button
          icon="home"
          aria-label="Home"></md-gb-toolbar-icon-button>
        <md-gb-toolbar-icon-button
          icon="search"
          aria-label="Search"></md-gb-toolbar-icon-button>
        <md-gb-toolbar-icon-button
          icon="notifications"
          aria-label="Notifications"></md-gb-toolbar-icon-button>
        <md-gb-toolbar-icon-button
          icon="settings"
          aria-label="Settings"></md-gb-toolbar-icon-button>
      </md-gb-toolbar>
    `;
  },
};

/** Toolbar stories. */
export const stories = [playground, vibrant, docked];
