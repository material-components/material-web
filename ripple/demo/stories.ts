/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/ripple/ripple.js';

import {MaterialStoryInit} from './material-collection.js';
import {css, html} from 'lit';

/** Knob types for ripple stories. */
export interface StoryKnobs {
  '--md-ripple-pressed-color': string;
  '--md-ripple-pressed-opacity': number;
  '--md-ripple-hover-color': string;
  '--md-ripple-hover-opacity': number;
}

const ripples: MaterialStoryInit<StoryKnobs> = {
  name: 'Ripples',
  styles: css`
    .row {
      align-items: center;
      display: flex;
      gap: 32px;
    }

    .container {
      align-items: center;
      border-radius: 24px;
      display: flex;
      height: 64px;
      justify-content: center;
      outline: 1px solid var(--md-sys-color-outline);
      padding: 16px;
      position: relative;
      width: 64px;
    }

    .container:has(.unbounded) {
      border-radius: 50%;
      outline-style: dashed;
    }

    .anchor {
      background: var(--md-sys-color-primary-container);
      border: 1px solid var(--md-sys-color-outline);
      border-radius: 50%;
      height: 24px;
      width: 24px;

      /* Recommended styles for an unbounded ripple's anchor. */
      display: flex;
      place-content: center;
      place-items: center;
      position: relative;
    }

    md-ripple.unbounded {
      height: 64px;
      width: 64px;

      /* Recommended styles for an unbounded ripple. */
      border-radius: 50%;
      inset: unset;
    }
  `,
  render() {
    return html`
      <div class="row">
        <div class="container">
          <md-ripple></md-ripple>
        </div>

        <div class="container" id="touch">
          <div class="anchor">
            <md-ripple for="touch" class="unbounded"></md-ripple>
          </div>
        </div>
      </div>
    `;
  },
};

/** Ripple stories. */
export const stories = [ripples];
