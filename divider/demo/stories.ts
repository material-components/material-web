/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/divider/divider.js';

import {MaterialStoryInit} from './material-collection.js';
import {css, html} from 'lit';

/** Knob types for divider stories. */
export interface StoryKnobs {
  inset: boolean;
  'inset (start)': boolean;
  'inset (end)': boolean;
}

const standard: MaterialStoryInit<StoryKnobs> = {
  name: 'Divider',
  styles: css`
    section {
      border: 1px solid var(--md-sys-color-on-background);
      width: 256px;
    }

    p {
      color: var(--md-sys-color-on-background);
      font-family: system-ui;
      margin: 16px;
    }
  `,
  render(knobs) {
    return html`
      <section>
        <p>Material 2</p>
        <md-divider
          ?inset=${knobs.inset}
          ?inset-start=${knobs['inset (start)']}
          ?inset-end=${knobs['inset (end)']}
        ></md-divider>
        <p>Material 3</p>
      </section>
    `;
  }
};

/** Divider stories. */
export const stories = [standard];
