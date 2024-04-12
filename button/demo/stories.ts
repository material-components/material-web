/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/button/elevated-button.js';
import '@material/web/button/filled-button.js';
import '@material/web/button/filled-tonal-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/button/text-button.js';
import '@material/web/icon/icon.js';

import {MaterialStoryInit} from './material-collection.js';
import {css, html} from 'lit';

/** Knob types for button stories. */
export interface StoryKnobs {
  label: string;
  disabled: boolean;
}

const styles = css`
  .column {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 600px;
  }

  .row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }
`;

const buttons: MaterialStoryInit<StoryKnobs> = {
  name: 'Button variants',
  styles,
  render({label, disabled}) {
    return html`
      <div class="column">
        <div class="row">
          <md-filled-button ?disabled=${disabled}>
            ${label || 'Filled'}
          </md-filled-button>

          <md-outlined-button ?disabled=${disabled}>
            ${label || 'Outlined'}
          </md-outlined-button>

          <md-elevated-button ?disabled=${disabled}>
            ${label || 'Elevated'}
          </md-elevated-button>

          <md-filled-tonal-button ?disabled=${disabled}>
            ${label || 'Tonal'}
          </md-filled-tonal-button>

          <md-text-button ?disabled=${disabled}>
            ${label || 'Text'}
          </md-text-button>
        </div>
        <div class="row">
          <md-filled-button
            ?disabled=${disabled}
            aria-label="${label || 'Filled'} button with icon">
            <md-icon slot="icon">upload</md-icon>
            ${label || 'Filled'}
          </md-filled-button>

          <md-outlined-button
            ?disabled=${disabled}
            aria-label="${label || 'Outlined'} button with icon">
            <md-icon slot="icon">upload</md-icon>
            ${label || 'Outlined'}
          </md-outlined-button>

          <md-elevated-button
            ?disabled=${disabled}
            aria-label="${label || 'Elevated'} button with icon">
            <md-icon slot="icon">upload</md-icon>
            ${label || 'Elevated'}
          </md-elevated-button>

          <md-filled-tonal-button
            ?disabled=${disabled}
            aria-label="${label || 'Tonal'} button with icon">
            <md-icon slot="icon">upload</md-icon>
            ${label || 'Tonal'}
          </md-filled-tonal-button>

          <md-text-button
            ?disabled=${disabled}
            aria-label="${label || 'Text'} button with icon">
            <md-icon slot="icon">upload</md-icon>
            ${label || 'Text'}
          </md-text-button>
        </div>
      </div>
    `;
  },
};

const links: MaterialStoryInit<StoryKnobs> = {
  name: 'Links',
  styles,
  render({label}) {
    return html`
      <div class="column">
        <div class="row">
          <md-filled-button
            href="https://google.com"
            target="_blank"
            trailing-icon>
            ${label || 'Filled'}
          </md-filled-button>

          <md-outlined-button
            href="https://google.com"
            target="_blank"
            trailing-icon>
            ${label || 'Outlined'}
          </md-outlined-button>

          <md-elevated-button
            href="https://google.com"
            target="_blank"
            trailing-icon>
            ${label || 'Elevated'}
          </md-elevated-button>

          <md-filled-tonal-button
            href="https://google.com"
            target="_blank"
            trailing-icon>
            ${label || 'Tonal'}
          </md-filled-tonal-button>

          <md-text-button
            href="https://google.com"
            target="_blank"
            trailing-icon>
            ${label || 'Text'}
          </md-text-button>
        </div>
        <div class="row">
          <md-filled-button
            aria-label="${label || 'Filled'} link with trailing icon"
            href="https://google.com"
            target="_blank"
            trailing-icon>
            <md-icon slot="icon">open_in_new</md-icon>
            ${label || 'Filled'}
          </md-filled-button>

          <md-outlined-button
            aria-label="${label || 'Outlined'} link with trailing icon"
            href="https://google.com"
            target="_blank"
            trailing-icon>
            <md-icon slot="icon">open_in_new</md-icon>
            ${label || 'Outlined'}
          </md-outlined-button>

          <md-elevated-button
            aria-label="${label || 'Elevated'} link with trailing icon"
            href="https://google.com"
            target="_blank"
            trailing-icon>
            <md-icon slot="icon">open_in_new</md-icon>
            ${label || 'Elevated'}
          </md-elevated-button>

          <md-filled-tonal-button
            aria-label="${label || 'Tonal'} link with trailing icon"
            href="https://google.com"
            target="_blank"
            trailing-icon>
            <md-icon slot="icon">open_in_new</md-icon>
            ${label || 'Tonal'}
          </md-filled-tonal-button>

          <md-text-button
            aria-label="${label || 'Text'} link with trailing icon"
            href="https://google.com"
            target="_blank"
            trailing-icon>
            <md-icon slot="icon">open_in_new</md-icon>
            ${label || 'Text'}
          </md-text-button>
        </div>
      </div>
    `;
  },
};

/** Button stories. */
export const stories = [buttons, links];
