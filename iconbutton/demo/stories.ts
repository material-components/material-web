/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/icon/icon.js';
import '@material/web/iconbutton/filled-icon-button.js';
import '@material/web/iconbutton/filled-tonal-icon-button.js';
import '@material/web/iconbutton/outlined-icon-button.js';
import '@material/web/iconbutton/icon-button.js';

import {MaterialStoryInit} from './material-collection.js';
import {css, html} from 'lit';

/** Knob types for icon button stories. */
export interface StoryKnobs {
  icon: string;
  selectedIcon: string;
  disabled: boolean;
}

const styles = css`
  .column {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .row {
    display: flex;
    gap: 16px;
  }
`;

const buttons: MaterialStoryInit<StoryKnobs> = {
  name: 'Icon button variants',
  styles,
  render({icon, disabled}) {
    return html`
      <div class="column">
        <div class="row">
          <md-icon-button
            aria-label="Standard icon"
            ?disabled=${disabled}
          >
            <md-icon>${icon}</md-icon>
          </md-icon-button>

          <md-outlined-icon-button
            aria-label="Outlined icon"
            ?disabled=${disabled}>
            <md-icon>${icon}</md-icon>
          </md-outlined-icon-button>

          <md-filled-icon-button
            aria-label="Filled icon"
            ?disabled=${disabled}
          >
            <md-icon>${icon}</md-icon>
          </md-filled-icon-button>

          <md-filled-tonal-icon-button
            aria-label="Filled tonal icon"
            ?disabled=${disabled}>
            <md-icon>${icon}</md-icon>
          </md-filled-tonal-icon-button>
        </div>
      </div>
    `;
  }
};

const toggles: MaterialStoryInit<StoryKnobs> = {
  name: 'Toggle icon buttons',
  styles,
  render({icon, selectedIcon, disabled}) {
    return html`
      <div class="column">
        <div class="row">
          <md-icon-button
            aria-label="Standard icon"
            toggle
            ?disabled=${disabled}
          >
            <md-icon>${icon}</md-icon>
            <md-icon slot="selected">${selectedIcon}</md-icon>
          </md-icon-button>

          <md-outlined-icon-button
            aria-label="Outlined icon"
            toggle
            ?disabled=${disabled}
          >
            <md-icon>${icon}</md-icon>
            <md-icon slot="selected">${selectedIcon}</md-icon>
          </md-outlined-icon-button>

          <md-filled-icon-button
            aria-label="Filled icon"
            toggle
            ?disabled=${disabled}
          >
            <md-icon>${icon}</md-icon>
            <md-icon slot="selected">${selectedIcon}</md-icon>
          </md-filled-icon-button>

          <md-filled-tonal-icon-button
            aria-label="Filled tonal icon"
            toggle
            ?disabled=${disabled}
          >
            <md-icon>${icon}</md-icon>
            <md-icon slot="selected">${selectedIcon}</md-icon>
          </md-filled-tonal-icon-button>
        </div>
      </div>
    `;
  }
};

const links: MaterialStoryInit<StoryKnobs> = {
  name: 'Links',
  styles,
  render({icon}) {
    return html`
      <div class="column">
        <div class="row">
          <md-icon-button
            aria-label="Standard icon"
            href="https://google.com"
            target="_blank"
          >
            <md-icon>${icon}</md-icon>
          </md-icon-button>

          <md-outlined-icon-button
            aria-label="Outlined icon"
            href="https://google.com"
            target="_blank"
          >
            <md-icon>${icon}</md-icon>
          </md-outlined-icon-button>

          <md-filled-icon-button
            aria-label="Filled icon"
            href="https://google.com"
            target="_blank"
          >
            <md-icon>${icon}</md-icon>
          </md-filled-icon-button>

          <md-filled-tonal-icon-button
            aria-label="Filled tonal icon"
            href="https://google.com"
            target="_blank"
          >
            <md-icon>${icon}</md-icon>
          </md-filled-tonal-icon-button>
        </div>
      </div>
    `;
  }
};

/** Icon button stories. */
export const stories = [buttons, toggles, links];
