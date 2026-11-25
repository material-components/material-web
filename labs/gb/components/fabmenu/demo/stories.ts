/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/labs/gb/components/fabmenu/md-gb-fab-menu.js';
import '@material/web/labs/gb/components/fabmenu/md-gb-fab-menu-item.js';
import '@material/web/labs/gb/styles/icon/md-gb-icon.js';

import {type MaterialStoryInit} from './material-collection.js';
import {
  type FabColor,
  type FabSize,
} from '@material/web/labs/gb/components/fab/fab.js';
import {type FabMenuColor} from '@material/web/labs/gb/components/fabmenu/fab-menu.js';
import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
import {css, html, nothing} from 'lit';

import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.css' with {type: 'css'}; // github-only
// import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.cssresult.js'; // google3-only

/** Knob types for FAB menu stories. */
export interface StoryKnobs {
  icon: string;
  label: string;
  color?: FabColor;
  size?: FabSize;
  menuColor?: FabMenuColor;
}

adoptStyles(document, [
  m3Styles,
  css`
    :root {
      --md-icon-font: 'Material Symbols Outlined';
    }
    body {
      margin-top: 0;
      margin-bottom: 0;
      margin-right: 0;
      min-height: 100vh;
    }
    stories-renderer {
      min-height: 100vh;
    }
    .story-row {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      align-items: center;
    }
  `,
]);

const playground: MaterialStoryInit<StoryKnobs> = {
  name: 'Playground',
  render(knobs) {
    return html`
      <div class="story-row">
        <md-gb-fab-menu
          icon="${knobs.icon || 'edit'}"
          label="${knobs.label || nothing}"
          color="${knobs.color || 'primary-container'}"
          size="${knobs.size || 'default'}"
          menu-color="${knobs.menuColor || 'standard'}">
          <md-gb-fab-menu-item>
            <md-gb-icon slot="leading">edit</md-gb-icon>
            Edit document
            <span slot="trailing-text">⌘E</span>
          </md-gb-fab-menu-item>
          <md-gb-fab-menu-item>
            <md-gb-icon slot="leading">add</md-gb-icon>
            Add section
            <span slot="trailing-text">⌘N</span>
          </md-gb-fab-menu-item>
          <md-gb-fab-menu-item>
            <md-gb-icon slot="leading">share</md-gb-icon>
            Share
            <span slot="trailing-text">⌘S</span>
          </md-gb-fab-menu-item>
          <md-gb-fab-menu-item disabled>
            <md-gb-icon slot="leading">lock</md-gb-icon>
            Permissions
            <span slot="trailing-text">⌘P</span>
          </md-gb-fab-menu-item>
        </md-gb-fab-menu>
      </div>
    `;
  },
};

const colors: MaterialStoryInit<StoryKnobs> = {
  name: 'Colors',
  render(knobs) {
    return html`
      <div class="story-row">
        <md-gb-fab-menu
          color="primary-container"
          icon="edit"
          size="${knobs.size || nothing}">
          <md-gb-fab-menu-item>
            <md-gb-icon slot="leading">edit</md-gb-icon>
            Primary Container
          </md-gb-fab-menu-item>
          <md-gb-fab-menu-item>
            <md-gb-icon slot="leading">add</md-gb-icon>
            Action
          </md-gb-fab-menu-item>
        </md-gb-fab-menu>

        <md-gb-fab-menu
          color="secondary-container"
          icon="edit"
          size="${knobs.size || nothing}">
          <md-gb-fab-menu-item>
            <md-gb-icon slot="leading">edit</md-gb-icon>
            Secondary Container
          </md-gb-fab-menu-item>
          <md-gb-fab-menu-item>
            <md-gb-icon slot="leading">add</md-gb-icon>
            Action
          </md-gb-fab-menu-item>
        </md-gb-fab-menu>

        <md-gb-fab-menu
          color="tertiary-container"
          icon="edit"
          size="${knobs.size || nothing}">
          <md-gb-fab-menu-item>
            <md-gb-icon slot="leading">edit</md-gb-icon>
            Tertiary Container
          </md-gb-fab-menu-item>
          <md-gb-fab-menu-item>
            <md-gb-icon slot="leading">add</md-gb-icon>
            Action
          </md-gb-fab-menu-item>
        </md-gb-fab-menu>

        <md-gb-fab-menu
          color="primary"
          icon="edit"
          size="${knobs.size || nothing}">
          <md-gb-fab-menu-item>
            <md-gb-icon slot="leading">edit</md-gb-icon>
            Primary
          </md-gb-fab-menu-item>
          <md-gb-fab-menu-item>
            <md-gb-icon slot="leading">add</md-gb-icon>
            Action
          </md-gb-fab-menu-item>
        </md-gb-fab-menu>

        <md-gb-fab-menu
          color="secondary"
          icon="edit"
          size="${knobs.size || nothing}">
          <md-gb-fab-menu-item>
            <md-gb-icon slot="leading">edit</md-gb-icon>
            Secondary
          </md-gb-fab-menu-item>
          <md-gb-fab-menu-item>
            <md-gb-icon slot="leading">add</md-gb-icon>
            Action
          </md-gb-fab-menu-item>
        </md-gb-fab-menu>

        <md-gb-fab-menu
          color="tertiary"
          icon="edit"
          size="${knobs.size || nothing}">
          <md-gb-fab-menu-item>
            <md-gb-icon slot="leading">edit</md-gb-icon>
            Tertiary
          </md-gb-fab-menu-item>
          <md-gb-fab-menu-item>
            <md-gb-icon slot="leading">add</md-gb-icon>
            Action
          </md-gb-fab-menu-item>
        </md-gb-fab-menu>

        <md-gb-fab-menu
          color="primary-container"
          menu-color="vibrant"
          icon="palette"
          size="${knobs.size || nothing}">
          <md-gb-fab-menu-item>
            <md-gb-icon slot="leading">palette</md-gb-icon>
            Vibrant Menu
          </md-gb-fab-menu-item>
          <md-gb-fab-menu-item>
            <md-gb-icon slot="leading">brush</md-gb-icon>
            Accent
          </md-gb-fab-menu-item>
        </md-gb-fab-menu>
      </div>
    `;
  },
};

const sizes: MaterialStoryInit<StoryKnobs> = {
  name: 'Sizes',
  render(knobs) {
    return html`
      <div class="story-row">
        <md-gb-fab-menu
          icon="add"
          color="${knobs.color || 'primary-container'}">
          <md-gb-fab-menu-item>Default Size</md-gb-fab-menu-item>
          <md-gb-fab-menu-item>Item 2</md-gb-fab-menu-item>
        </md-gb-fab-menu>

        <md-gb-fab-menu
          icon="add"
          size="md"
          color="${knobs.color || 'primary-container'}">
          <md-gb-fab-menu-item>Medium Size</md-gb-fab-menu-item>
          <md-gb-fab-menu-item>Item 2</md-gb-fab-menu-item>
        </md-gb-fab-menu>

        <md-gb-fab-menu
          icon="add"
          size="lg"
          color="${knobs.color || 'primary-container'}">
          <md-gb-fab-menu-item>Large Size</md-gb-fab-menu-item>
          <md-gb-fab-menu-item>Item 2</md-gb-fab-menu-item>
        </md-gb-fab-menu>
      </div>
    `;
  },
};

const checkable: MaterialStoryInit<StoryKnobs> = {
  name: 'Checkable',
  render(knobs) {
    return html`
      <div class="story-row">
        <md-gb-fab-menu
          icon="radio_button_checked"
          label="Single Selection"
          color="${knobs.color || 'primary-container'}"
          size="${knobs.size || 'default'}">
          <md-gb-fab-menu-item checkable="single" checked>
            Option A
          </md-gb-fab-menu-item>
          <md-gb-fab-menu-item checkable="single">
            Option B
          </md-gb-fab-menu-item>
          <md-gb-fab-menu-item checkable="single">
            Option C
          </md-gb-fab-menu-item>
        </md-gb-fab-menu>

        <md-gb-fab-menu
          icon="checklist"
          label="Multiple Selection"
          color="${knobs.color || 'primary-container'}"
          size="${knobs.size || 'default'}">
          <md-gb-fab-menu-item checkable="multiple" checked>
            Notifications
          </md-gb-fab-menu-item>
          <md-gb-fab-menu-item checkable="multiple" checked>
            Sound effects
          </md-gb-fab-menu-item>
          <md-gb-fab-menu-item checkable="multiple">
            Auto-save
          </md-gb-fab-menu-item>
        </md-gb-fab-menu>
      </div>
    `;
  },
};

/** FAB menu stories. */
export const stories = [playground, colors, sizes, checkable];
