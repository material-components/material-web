/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/labs/card/elevated-card.js';
import '@material/web/labs/card/filled-card.js';
import '@material/web/labs/card/outlined-card.js';

import {MaterialStoryInit} from './material-collection.js';
import {css, html} from 'lit';

/** Knob types for card stories. */
export interface StoryKnobs {}

const cards: MaterialStoryInit<StoryKnobs> = {
  name: 'Cards',
  styles: css`
    .container {
      color: var(--md-sys-color-on-surface);
      display: flex;
      font: var(--md-sys-typescale-body-medium-weight, 400)
        var(--md-sys-typescale-body-medium-size, 0.875rem) /
        var(--md-sys-typescale-body-medium-line-height, 1.25rem)
        var(--md-sys-typescale-body-medium-font, 'Roboto');
      gap: 8px;
    }
  `,
  render() {
    return html`
      <div class="container">
        <md-elevated-card>An elevated card</md-elevated-card>

        <md-filled-card>A filled card</md-filled-card>

        <md-outlined-card>An outlined card</md-outlined-card>
      </div>
    `;
  },
};

/** Card stories. */
export const stories = [cards];
