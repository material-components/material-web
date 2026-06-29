/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/labs/gb/components/checkbox/md-checkbox.js';

import {MaterialStoryInit} from './material-collection.js';
import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
import {css, html} from 'lit';

import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.css' with {type: 'css'}; // github-only
// import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.cssresult.js'; // google3-only

/** Knob types for checkbox stories. */
export interface StoryKnobs {
  checked: boolean;
  indeterminate: boolean;
  error: boolean;
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
      <md-gb-checkbox></md-gb-checkbox>
      <md-gb-checkbox checked></md-gb-checkbox>
      <md-gb-checkbox
        .checked=${knobs.checked}
        .indeterminate=${knobs.indeterminate}
        .error=${knobs.error}></md-gb-checkbox>
    `;
  },
};

/** Checkbox stories. */
export const stories = [playground];
