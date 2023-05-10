/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */


import '@material/web/linearprogress/linear-progress.js';

import {MaterialStoryInit} from './material-collection.js';
import {css, html} from 'lit';
import {classMap} from 'lit/directives/class-map.js';

/** Knob types for linear progress stories. */
export interface StoryKnobs {
  progress: number;
  buffer: number;
  indeterminate: boolean;
  fourColor: boolean;
  'track color': string;
  'track height': number;
  'indicator height': number;
  'custom theme': boolean;
}

const standard: MaterialStoryInit<StoryKnobs> = {
  name: 'Linear progress',
  styles: css`
    md-linear-progress {
      inline-size: 50vw;
    }

    .custom {
      --md-linear-progress-active-indicator-color: linear-gradient(steelblue, lightblue);
      --md-linear-progress-track-color: gainsboro;
      --md-linear-progress-active-indicator-height: 20px;
      --md-linear-progress-track-height: 20px;
      --md-linear-progress-track-shape: 9999px;
    }
  `,
  render(knobs) {
    const {progress, buffer, indeterminate, fourColor} = knobs;
    const classes = {'custom': knobs['custom theme']};

    return html`
      <md-linear-progress
          class=${classMap(classes)}
          .progress=${progress}
          .buffer=${buffer}
          .indeterminate=${indeterminate}
          .fourColor=${fourColor}
      ></md-linear-progress>`;
  }
};

/** Linear Progress stories. */
export const stories = [standard];
