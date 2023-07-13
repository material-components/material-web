/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */


import '@material/web/progress/linear-progress.js';
import '@material/web/button/tonal-button.js';
import '@material/web/icon/icon.js';
import '@material/web/iconbutton/standard-icon-button.js';
import '@material/web/progress/circular-progress.js';

import {MdTonalButton} from '@material/web/button/tonal-button.js';
import {MaterialStoryInit} from './material-collection.js';
import {MdCircularProgress} from '@material/web/progress/circular-progress.js';
import {css, html} from 'lit';
import {classMap} from 'lit/directives/class-map.js';

/** Knob types for linear progress stories. */
export interface StoryKnobs {
  progress: number;
  'buffer (linear)': number;
  indeterminate: boolean;
  fourColor: boolean;
  'track color (linear)': string;
  'track height (linear)': number;
  'indicator height (linear)': number;
  'custom theme (linear)': boolean;
  'size (circular)': number;
  'trackWidth (circular)': number;
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
    const {progress, indeterminate, fourColor} = knobs;
    const buffer = knobs['buffer (linear)'];
    const classes = {'custom': knobs['custom theme (linear)']};

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


const standardCircular: MaterialStoryInit<StoryKnobs> = {
  name: 'Circular progress',
  render({progress, indeterminate, fourColor}) {
    return html`
      <md-circular-progress
          .progress=${progress}
          .indeterminate=${indeterminate}
          .fourColor=${fourColor}
      ></md-circular-progress>`;
  },
};
const iconButton: MaterialStoryInit<StoryKnobs> = {
  name: 'Containing an icon-button',
  styles: css`.aroundIcon {
        --md-circular-progress-size: 48px;
      }`,
  render({progress, indeterminate, fourColor}) {
    const toggle = ({target}: Event) => {
      const spinner =
          ((target as HTMLElement).parentElement as MdCircularProgress);
      spinner.indeterminate = !spinner.indeterminate;
    };

    return html`
      <md-circular-progress class="aroundIcon"
          .progress=${progress}
          .indeterminate=${indeterminate}
          .fourColor=${fourColor}
      >
        <md-standard-icon-button toggle @change=${toggle}>
          <md-icon>play_arrow</md-icon>
          <md-icon slot="selectedIcon">pause</md-icon>
        </md-standard-icon-button>
      </md-circular-progress>`;
  }
};
const insideButton: MaterialStoryInit<StoryKnobs> = {
  name: 'Inside a button',
  styles: css`.withSpinner {
        --md-circular-progress-size: 36px;
        --md-tonal-button-with-icon-spacing-trailing: 8px;
        width: 80px;
      }`,
  render({progress, indeterminate, fourColor}) {
    const loadTime = 2500;
    let loadTimeout = -1;
    const toggleLoad = (target: MdTonalButton) => {
      const spinner = target.firstElementChild as MdCircularProgress;
      const label = target.lastElementChild!;
      const shouldLoad = spinner.slot !== 'icon';
      spinner.indeterminate = true;
      label.slot = shouldLoad ? 'nothing' : '';
      spinner.slot = shouldLoad ? 'icon' : 'nothing';
      clearTimeout(loadTimeout);
      if (shouldLoad) {
        loadTimeout = setTimeout(() => {
          toggleLoad(target);
        }, loadTime);
      }
    };

    return html`
      <md-tonal-button class="withSpinner" @click=${
        ({currentTarget}: Event) => {
          toggleLoad(currentTarget as MdTonalButton);
        }}>
        <md-circular-progress slot="nothing"
            .progress=${progress}
            .indeterminate=${indeterminate}
            .fourColor=${fourColor}
        ></md-circular-progress>
        <span>Load</span>
      </md-tonal-button>`;
  }
};

/** Linear Progress stories. */
export const stories = [standard, standardCircular, iconButton, insideButton];
