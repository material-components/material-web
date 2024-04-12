/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/icon/icon.js';
import '@material/web/iconbutton/filled-icon-button.js';
import '@material/web/iconbutton/filled-tonal-icon-button.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/iconbutton/outlined-icon-button.js';

import {MaterialStoryInit} from './material-collection.js';
import {styles as typescaleStyles} from '@material/web/typography/md-typescale-styles.js';
import {css, html} from 'lit';

/** Knob types for icon button stories. */
export interface StoryKnobs {
  icon: string;
  selectedIcon: string;
  disabled: boolean;
}

const styles = [
  typescaleStyles,
  css`
    .column {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .row {
      display: flex;
      gap: 32px;
    }

    p {
      color: var(--md-sys-color-on-surface);
    }
  `,
];

const buttons: MaterialStoryInit<StoryKnobs> = {
  name: 'Icon button variants',
  styles,
  render({icon, disabled}) {
    return html`
      <div class="row md-typescale-body-medium">
        <div class="column">
          <p>Standard</p>
          <md-icon-button aria-label="Open settings" ?disabled=${disabled}>
            <md-icon>${icon || 'settings'}</md-icon>
          </md-icon-button>
        </div>

        <div class="column">
          <p>Outlined</p>
          <md-outlined-icon-button aria-label="Search" ?disabled=${disabled}>
            <md-icon>${icon || 'search'}</md-icon>
          </md-outlined-icon-button>
        </div>

        <div class="column">
          <p>Filled</p>
          <md-filled-icon-button aria-label="Complete" ?disabled=${disabled}>
            <md-icon>${icon || 'done'}</md-icon>
          </md-filled-icon-button>
        </div>

        <div class="column">
          <p>Filled tonal</p>
          <md-filled-tonal-icon-button
            aria-label="Add new"
            ?disabled=${disabled}>
            <md-icon>${icon || 'add'}</md-icon>
          </md-filled-tonal-icon-button>
        </div>
      </div>
    `;
  },
};

const toggles: MaterialStoryInit<StoryKnobs> = {
  name: 'Toggle icon buttons',
  styles,
  render({icon, selectedIcon, disabled}) {
    return html`
      <div class="row">
        <div class="column">
          <p>Standard</p>
          <md-icon-button
            aria-label="Show password"
            aria-label-selected="Hide password"
            toggle
            ?disabled=${disabled}>
            <md-icon>${icon || 'visibility'}</md-icon>
            <md-icon slot="selected">
              ${selectedIcon || 'visibility_off'}
            </md-icon>
          </md-icon-button>
        </div>

        <div class="column">
          <p>Outlined</p>
          <md-outlined-icon-button
            aria-label="Play"
            aria-label-selected="Pause"
            toggle
            ?disabled=${disabled}>
            <md-icon>${icon || 'play_arrow'}</md-icon>
            <md-icon slot="selected">${selectedIcon || 'pause'}</md-icon>
          </md-outlined-icon-button>
        </div>

        <div class="column">
          <p>Filled</p>
          <md-filled-icon-button
            aria-label="Show more"
            aria-label-selected="Show less"
            toggle
            ?disabled=${disabled}>
            <md-icon>${icon || 'expand_more'}</md-icon>
            <md-icon slot="selected">${selectedIcon || 'expand_less'}</md-icon>
          </md-filled-icon-button>
        </div>

        <div class="column">
          <p>Filled tonal</p>
          <md-filled-tonal-icon-button
            aria-label="Open menu"
            aria-label-selected="Close menu"
            toggle
            ?disabled=${disabled}>
            <md-icon>${icon || 'menu'}</md-icon>
            <md-icon slot="selected">${selectedIcon || 'close'}</md-icon>
          </md-filled-tonal-icon-button>
        </div>
      </div>
    `;
  },
};

const links: MaterialStoryInit<StoryKnobs> = {
  name: 'Links',
  styles,
  render({icon}) {
    return html`
      <div class="row">
        <div class="column">
          <p>Standard</p>
          <md-icon-button
            aria-label="Go home"
            href="https://google.com"
            target="_blank">
            <md-icon>${icon || 'home'}</md-icon>
          </md-icon-button>
        </div>

        <div class="column">
          <p>Outlined</p>
          <md-outlined-icon-button
            aria-label="Open new tab"
            href="https://google.com"
            target="_blank">
            <md-icon>${icon || 'open_in_new'}</md-icon>
          </md-outlined-icon-button>
        </div>

        <div class="column">
          <p>Filled</p>
          <md-filled-icon-button
            aria-label="Download Google"
            href="https://google.com"
            target="_blank">
            <md-icon>${icon || 'download'}</md-icon>
          </md-filled-icon-button>
        </div>

        <div class="column">
          <p>Filled tonal</p>
          <md-filled-tonal-icon-button
            aria-label="Logout"
            href="https://google.com"
            target="_blank">
            <md-icon>${icon || 'logout'}</md-icon>
          </md-filled-tonal-icon-button>
        </div>
      </div>
    `;
  },
};

/** Icon button stories. */
export const stories = [buttons, toggles, links];
