/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/divider/divider.js';

import {MaterialStoryInit} from './material-collection.js';
import {styles as typescaleStyles} from '@material/web/typography/md-typescale-styles.js';
import {css, html} from 'lit';

/** Knob types for divider stories. */
export interface StoryKnobs {
  inset: boolean;
  'inset (start)': boolean;
  'inset (end)': boolean;
}

const standard: MaterialStoryInit<StoryKnobs> = {
  name: 'Divider',
  styles: [
    typescaleStyles,
    css`
      ul {
        border: 1px solid var(--md-sys-color-outline);
        margin: 0;
        padding: 0;
        width: 256px;
      }

      li {
        color: var(--md-sys-color-on-background);
        list-style: none;
        margin: 16px;
      }
    `,
  ],
  render(knobs) {
    return html`
      <ul
        aria-label="A list of items with decorative and non-decorative separators"
        class="md-typescale-body-medium">
        <li>List item one</li>
        <md-divider
          ?inset=${knobs.inset}
          ?inset-start=${knobs['inset (start)']}
          ?inset-end=${knobs['inset (end)']}></md-divider>
        <li>List item two</li>
        <md-divider role="separator"></md-divider>
        <li>List item three</li>
        <md-divider
          ?inset=${knobs.inset}
          ?inset-start=${knobs['inset (start)']}
          ?inset-end=${knobs['inset (end)']}></md-divider>
        <li>List item four</li>
      </ul>
    `;
  },
};

/** Divider stories. */
export const stories = [standard];
