/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/labs/aria/buttons/md-aria-toggle.js';

import {MaterialStoryInit} from './material-collection.js';
import {css, html} from 'lit';

/** Knob types for ARIA Button stories. */
export interface StoryKnobs {
  disabled: boolean;
  selected: boolean;
}

const styles = [
  css`
    md-aria-toggle {
      padding: 8px 16px;
      font-family: sans-serif;
      border-radius: 8px;
    }
  `,
];

const toggles: MaterialStoryInit<StoryKnobs> = {
  name: 'Toggle buttons',
  styles,
  render(knobs) {
    return html`
      <md-aria-toggle ?selected=${knobs.selected} ?disabled=${knobs.disabled}>
        Bluetooth
      </md-aria-toggle>
      <md-aria-toggle selected ?disabled=${knobs.disabled}>
        Wi-Fi
      </md-aria-toggle>
      <md-aria-toggle disabled>AI</md-aria-toggle>
    `;
  },
};

/** ARIA Button stories. */
export const stories = [toggles];
