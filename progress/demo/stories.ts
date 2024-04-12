/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/button/filled-tonal-button.js';
import '@material/web/icon/icon.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/progress/circular-progress.js';
import '@material/web/progress/linear-progress.js';

import {MaterialStoryInit} from './material-collection.js';
import {MdCircularProgress} from '@material/web/progress/circular-progress.js';
import {css, html} from 'lit';
import {classMap} from 'lit/directives/class-map.js';

/** Knob types for linear progress stories. */
export interface StoryKnobs {
  value: number;
  max: number;
  'buffer (linear)': number;
  indeterminate: boolean;
  fourColor: boolean;
  'track color (linear)': string;
  'track height (linear)': number;
  'indicator height (linear)': number;
  'custom theme (linear)': boolean;
}

const linear: MaterialStoryInit<StoryKnobs> = {
  name: 'Linear progress',
  styles: css`
    md-linear-progress {
      inline-size: 50vw;
    }

    .custom {
      --md-linear-progress-active-indicator-color: linear-gradient(
        steelblue,
        lightblue
      );
      --md-linear-progress-track-color: gainsboro;
      --md-linear-progress-active-indicator-height: 20px;
      --md-linear-progress-track-height: 20px;
      --md-linear-progress-track-shape: 9999px;
    }
  `,
  render(knobs) {
    const {value, max, indeterminate, fourColor} = knobs;
    const buffer = knobs['buffer (linear)'];
    const classes = {'custom': knobs['custom theme (linear)']};

    return html` <md-linear-progress
      aria-label="An example linear progress bar"
      class=${classMap(classes)}
      .value=${value}
      .max=${max}
      .buffer=${buffer}
      .indeterminate=${indeterminate}
      .fourColor=${fourColor}></md-linear-progress>`;
  },
};

const circular: MaterialStoryInit<StoryKnobs> = {
  name: 'Circular progress',
  render({value, max, indeterminate, fourColor}) {
    return html`
      <md-circular-progress
        aria-label="An example circular progress"
        value=${value}
        max=${max}
        ?indeterminate=${indeterminate}
        ?four-color=${fourColor}></md-circular-progress>
    `;
  },
};

const components: MaterialStoryInit<StoryKnobs> = {
  name: 'Indicators in components',
  styles: css`
    .components {
      align-items: center;
      display: flex;
      flex-wrap: wrap;
      gap: 32px;
    }

    md-filled-tonal-button {
      width: 80px;
    }

    md-filled-tonal-button md-circular-progress {
      --md-circular-progress-size: 36px;
      --md-circular-progress-active-indicator-width: ${(4 / 36) * 100};
      --md-filled-tonal-button-with-leading-icon-trailing-space: 8px;
    }

    .around-icon {
      height: 48px;
      position: relative;
      width: 48px;
    }

    .around-icon md-icon-button {
      inset: 0;
      margin: auto;
      position: absolute;
    }
  `,
  render({value, max}) {
    const toggleIndeterminate = ({target}: Event) => {
      const spinner = (target as HTMLElement).parentElement?.querySelector(
        'md-circular-progress',
      );
      if (!spinner) {
        return;
      }
      spinner.indeterminate = !spinner.indeterminate;
    };

    const loadTime = 2500;
    let loadTimeout = -1;
    const toggleLoad = ({target}: {target: HTMLElement}) => {
      const spinner = target.firstElementChild as MdCircularProgress;
      const label = target.lastElementChild as HTMLElement;
      const shouldLoad = spinner.style.display === 'none';
      label.style.display = shouldLoad ? 'none' : '';
      spinner.style.display = shouldLoad ? '' : 'none';
      clearTimeout(loadTimeout);
      if (shouldLoad) {
        loadTimeout = setTimeout(() => {
          toggleLoad({target});
        }, loadTime);
      }
    };

    return html`
      <div class="components">
        <md-filled-tonal-button @click=${toggleLoad}>
          <md-circular-progress
            style="display: none"
            indeterminate
            aria-label="Loading, please wait"></md-circular-progress>
          <span>Load</span>
        </md-filled-tonal-button>

        <div class="around-icon">
          <md-circular-progress
            value=${value}
            max=${max}
            aria-label="Playback progress"></md-circular-progress>
          <md-icon-button
            toggle
            aria-label="Play or pause music"
            @change=${toggleIndeterminate}>
            <md-icon>play_arrow</md-icon>
            <md-icon slot="selected">pause</md-icon>
          </md-icon-button>
        </div>
      </div>
    `;
  },
};

/** Linear Progress stories. */
export const stories = [linear, circular, components];
