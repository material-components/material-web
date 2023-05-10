/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/elevation/elevation.js';

import {MaterialStoryInit} from './material-collection.js';
import {css, html} from 'lit';

/** Knob types for elevation stories. */
export interface StoryKnobs {
  level: number;
}

const styles = css`
  .row {
    display: flex;
    gap: 16px;
  }

  .box {
    align-items: center;
    background: var(--md-sys-color-primary-container);
    border: 1px solid;
    border-radius: 16px;
    color: var(--md-sys-color-on-primary-container);
    display: flex;
    font-family: sans-serif;
    height: 64px;
    justify-content: center;
    position: relative;
    transition-duration: 250ms;
    transition-timing-function: ease-in-out;
    width: 64px;
  }

  .level0 {
    --md-elevation-level: 0;
  }

  .level1 {
    --md-elevation-level: 1;
  }

  .level2 {
    --md-elevation-level: 2;
  }

  .level3 {
    --md-elevation-level: 3;
  }

  .level4 {
    --md-elevation-level: 4;
  }

  .level5 {
    --md-elevation-level: 5;
  }
`;

const standard: MaterialStoryInit<StoryKnobs> = {
  name: 'Elevation',
  styles,
  render({level}) {
    const clampedLevel = Math.min(Math.max(level, 0), 5);
    return html`
      <div class="box level${clampedLevel}">
        ${clampedLevel}
        <md-elevation></md-elevation>
      </div>
    `;
  },
};

const all: MaterialStoryInit<StoryKnobs> = {
  name: 'Levels',
  styles,
  render() {
    return html`
      <div class="row">
        <div class="box level0">
          0
          <md-elevation></md-elevation>
        </div>
        <div class="box level1">
          1
          <md-elevation></md-elevation>
        </div>
        <div class="box level2">
          2
          <md-elevation></md-elevation>
        </div>
        <div class="box level3">
          3
          <md-elevation></md-elevation>
        </div>
        <div class="box level4">
          4
          <md-elevation></md-elevation>
        </div>
        <div class="box level5">
          5
          <md-elevation></md-elevation>
        </div>
      </div>
    `;
  },
};

/** Elevation stories. */
export const stories = [standard, all];
