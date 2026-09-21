/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/labs/gb/components/button/md-gb-button.js';
import '@material/web/labs/gb/components/iconbutton/md-gb-icon-button.js';
import '@material/web/labs/gb/components/toolbar/md-gb-toolbar.js';
import '@material/web/labs/gb/styles/icon/md-gb-icon.js';

import {MaterialStoryInit} from './material-collection.js';
import {
  type ToolbarColor,
  type ToolbarOrientation,
} from '@material/web/labs/gb/components/toolbar/toolbar.js';
import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
import {css, html} from 'lit';

import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.css' with {type: 'css'}; // github-only
// import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.cssresult.js'; // google3-only

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

const styles = css`
  .demo-container {
    align-items: center;
    background-color: var(--md-sys-color-surface);
    border: 1px solid var(--md-sys-color-outline-variant);
    border-radius: 16px;
    box-shadow: var(--md-sys-elevation-shadow-1);
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
    min-height: 140px;
    overflow: hidden;
    padding: 24px;
  }

  .demo-stack {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
`;

const playground: MaterialStoryInit<StoryKnobs> = {
  name: 'Playground',
  styles,
  render(knobs) {
    const color = knobs.color || 'standard';
    const orientation = knobs.orientation || 'horizontal';
    const docked = Boolean(knobs.docked);

    return html`
      <div class="demo-container">
        <md-gb-toolbar
          color=${color}
          orientation=${orientation}
          ?docked=${docked}
          aria-label="Formatting toolbar">
          <md-gb-button square type="toggle" selected>
            <md-gb-icon>edit</md-gb-icon>
            Edit
          </md-gb-button>
          <md-gb-button square type="toggle">
            <md-gb-icon>palette</md-gb-icon>
            Style
          </md-gb-button>
          <md-gb-icon-button square aria-label="Favorite" type="toggle">
            <md-gb-icon>favorite</md-gb-icon>
          </md-gb-icon-button>
          <md-gb-icon-button square aria-label="Settings" type="toggle">
            <md-gb-icon>settings</md-gb-icon>
          </md-gb-icon-button>
        </md-gb-toolbar>
      </div>
    `;
  },
};

const allVariants: MaterialStoryInit<StoryKnobs> = {
  name: 'Expressive Variants',
  styles,
  render() {
    return html`
      <div class="demo-stack">
        <div class="demo-container">
          <md-gb-toolbar color="standard" aria-label="Standard floating">
            <md-gb-button square type="toggle" selected>
              <md-gb-icon>star</md-gb-icon>
              Starred
            </md-gb-button>
            <md-gb-button square type="toggle">
              <md-gb-icon>visibility</md-gb-icon>
              Preview
            </md-gb-button>
            <md-gb-icon-button square aria-label="Favorite" type="toggle">
              <md-gb-icon>favorite</md-gb-icon>
            </md-gb-icon-button>
          </md-gb-toolbar>
        </div>

        <div class="demo-container">
          <md-gb-toolbar color="vibrant" aria-label="Vibrant floating">
            <md-gb-button square type="toggle" selected>
              <md-gb-icon>auto_awesome</md-gb-icon>
              Generate
            </md-gb-button>
            <md-gb-button square type="toggle">
              <md-gb-icon>palette</md-gb-icon>
              Theme
            </md-gb-button>
            <md-gb-icon-button
              square
              aria-label="Bookmark"
              type="toggle"
              selected>
              <md-gb-icon>bookmark</md-gb-icon>
            </md-gb-icon-button>
          </md-gb-toolbar>
        </div>

        <div class="demo-container">
          <md-gb-toolbar color="standard" docked aria-label="Standard docked">
            <md-gb-icon-button square aria-label="Home" type="toggle">
              <md-gb-icon>home</md-gb-icon>
            </md-gb-icon-button>
            <md-gb-button square type="toggle" selected>
              <md-gb-icon>folder</md-gb-icon>
              Files
            </md-gb-button>
            <md-gb-icon-button square aria-label="Image" type="toggle">
              <md-gb-icon>image</md-gb-icon>
            </md-gb-icon-button>
          </md-gb-toolbar>
        </div>
      </div>
    `;
  },
};

/** Toolbar stories. */
export const stories = [playground, allVariants];
