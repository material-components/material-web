/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/switch/switch.js';

import {
  labelStyles,
  MaterialStoryInit,
} from './material-collection.js';
import {css, html} from 'lit';

/** Knob types for Switch stories. */
export interface StoryKnobs {
  disabled: boolean;
  selected: boolean;
  icons: boolean;
  showOnlySelectedIcon: boolean;
}

const standard: MaterialStoryInit<StoryKnobs> = {
  name: 'Switch',
  render(knobs) {
    return html` <md-switch
      aria-label="An example switch"
      .disabled=${knobs.disabled}
      .selected=${knobs.selected}
      .icons=${knobs.icons}
      .showOnlySelectedIcon=${knobs.showOnlySelectedIcon}></md-switch>`;
  },
};

const labeled: MaterialStoryInit<StoryKnobs> = {
  name: 'With labels',
  styles: [
    labelStyles,
    css`
      .column {
        display: flex;
        flex-direction: column;
        gap: 16px;
        width: 200px;
      }

      label {
        justify-content: space-between;
      }
    `,
  ],
  render(knobs) {
    return html`
      <div class="column" role="group" aria-label="Settings">
        <label>
          Wi-Fi
          <md-switch
            aria-label="Wi-Fi"
            .disabled=${knobs.disabled}
            .icons=${knobs.icons}
            .showOnlySelectedIcon=${knobs.showOnlySelectedIcon}></md-switch>
        </label>
        <label>
          Bluetooth
          <md-switch
            aria-label="Bluetooth"
            selected
            .disabled=${knobs.disabled}
            .icons=${knobs.icons}
            .showOnlySelectedIcon=${knobs.showOnlySelectedIcon}></md-switch>
        </label>
      </div>
    `;
  },
};

/** Switch stories. */
export const stories = [standard, labeled];
