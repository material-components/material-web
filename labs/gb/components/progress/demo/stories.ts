/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/labs/gb/components/progress/md-gb-circular-progress.js';
import '@material/web/labs/gb/components/progress/md-gb-linear-progress.js';

import {MaterialStoryInit} from './material-collection.js';
import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.cssresult.js';
import {html} from 'lit';

adoptStyles(document, [m3Styles]);

/** Knob types for progress stories. */
export interface StoryKnobs {
  value: number;
  max: number;
  buffer: number;
  indeterminate: boolean;
}

const circular: MaterialStoryInit<StoryKnobs> = {
  name: 'Circular progress',
  render(knobs) {
    return html`
      <div style="display: flex; gap: 48px; align-items: flex-start;">
        <div
          style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <span>Standard</span>
          <md-gb-circular-progress
            aria-label="A standard circular progress indicator"
            .value=${knobs.value}
            .max=${knobs.max}
            ?indeterminate=${knobs.indeterminate}></md-gb-circular-progress>
        </div>
        <div
          style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <span>Wavy</span>
          <md-gb-circular-progress
            wavy
            aria-label="A wavy circular progress indicator"
            .value=${knobs.value}
            .max=${knobs.max}
            ?indeterminate=${knobs.indeterminate}></md-gb-circular-progress>
        </div>
      </div>
    `;
  },
};

const linear: MaterialStoryInit<StoryKnobs> = {
  name: 'Linear progress',
  render(knobs) {
    return html`
      <div
        style="display: flex; flex-direction: column; gap: 24px; width: 100%; max-width: 400px;">
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <span>Standard</span>
          <md-gb-linear-progress
            aria-label="A standard linear progress indicator"
            .value=${knobs.value}
            .max=${knobs.max}
            .buffer=${knobs.buffer}
            ?indeterminate=${knobs.indeterminate}></md-gb-linear-progress>
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <span>Wavy</span>
          <md-gb-linear-progress
            wavy
            aria-label="A wavy linear progress indicator"
            .value=${knobs.value}
            .max=${knobs.max}
            .buffer=${knobs.buffer}
            ?indeterminate=${knobs.indeterminate}></md-gb-linear-progress>
        </div>
      </div>
    `;
  },
};

/** Progress stories. */
export const stories = [circular, linear];
