/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/checkbox/checkbox.js';

import {labelStyles, MaterialStoryInit} from './material-collection.js';
import {css, html} from 'lit';

/** Knob types for checkbox stories. */
export interface StoryKnobs {
  checked: boolean;
  disabled: boolean;
  error: boolean;
  indeterminate: boolean;
}

const checkbox: MaterialStoryInit<StoryKnobs> = {
  name: 'Checkbox',
  render({checked, disabled, error, indeterminate}) {
    return html`
      <md-checkbox
        aria-label="An example checkbox"
        ?checked=${checked}
        ?disabled=${disabled}
        ?error=${error}
        ?indeterminate=${indeterminate}
      ></md-checkbox>
    `;
  },
};

const withLabels: MaterialStoryInit<StoryKnobs> = {
  name: 'With labels',
  styles: [
    labelStyles,
    css`
      .column {
        display: flex;
        flex-direction: column;
      }

      label {
        gap: 0;
      }
    `,
  ],
  render({disabled, error}) {
    return html`
      <div class="column" role="group" aria-label="Animals">
        <label role="presentation">
          <md-checkbox
            ?disabled=${disabled}
            ?error=${error}
            aria-label="Cats"
          ></md-checkbox>
          <span aria-hidden="true">Cats</span>
        </label>
        <label role="presentation">
          <md-checkbox
            checked
            ?disabled=${disabled}
            ?error=${error}
            aria-label="dogs"
          ></md-checkbox>
          <span aria-hidden="true">Dogs</span>
        </label>
        <label role="presentation">
          <md-checkbox
            indeterminate
            ?disabled=${disabled}
            ?error=${error}
            aria-label="Birds"
          ></md-checkbox>
          <span aria-hidden="true">Birds</span>
        </label>
      </div>
    `;
  },
};

/** Checkbox stories. */
export const stories = [checkbox, withLabels];
