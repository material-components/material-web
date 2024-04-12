/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/checkbox/checkbox.js';

import {
  labelStyles,
  MaterialStoryInit,
} from './material-collection.js';
import {css, html} from 'lit';

/** Knob types for checkbox stories. */
export interface StoryKnobs {
  checked: boolean;
  disabled: boolean;
  indeterminate: boolean;
}

const checkbox: MaterialStoryInit<StoryKnobs> = {
  name: 'Checkbox',
  render({checked, disabled, indeterminate}) {
    return html`
      <md-checkbox
        aria-label="An example checkbox"
        ?checked=${checked}
        ?disabled=${disabled}
        ?indeterminate=${indeterminate}
        touch-target="wrapper"></md-checkbox>
    `;
  },
};

const withLabels: MaterialStoryInit<StoryKnobs> = {
  name: 'With labels',
  styles: [
    labelStyles,
    css`
      ol {
        all: unset;
        display: flex;
        flex-direction: column;
      }

      li {
        all: unset;
      }

      label {
        gap: 0;
      }
    `,
  ],
  render({disabled}) {
    return html`
      <ol aria-label="Animals">
        <li>
          <label>
            <md-checkbox
              ?disabled=${disabled}
              aria-label="Cats"
              touch-target="wrapper"></md-checkbox>
            Cats
          </label>
        </li>
        <li>
          <label>
            <md-checkbox
              checked
              ?disabled=${disabled}
              aria-label="dogs"
              touch-target="wrapper"></md-checkbox>
            Dogs
          </label>
        </li>
        <li>
          <label>
            <md-checkbox
              indeterminate
              ?disabled=${disabled}
              aria-label="Birds"
              touch-target="wrapper"></md-checkbox>
            Birds
          </label>
        </li>
      </ol>
    `;
  },
};

/** Checkbox stories. */
export const stories = [checkbox, withLabels];
