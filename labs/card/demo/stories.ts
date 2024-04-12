/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/button/filled-button.js';
import '@material/web/labs/card/elevated-card.js';
import '@material/web/labs/card/filled-card.js';
import '@material/web/labs/card/outlined-card.js';

import {MaterialStoryInit} from './material-collection.js';
import {styles as typescaleStyles} from '@material/web/typography/md-typescale-styles.js';
import {css, html} from 'lit';

/** Knob types for card stories. */
export interface StoryKnobs {}

const MEDIA_IMAGE =
  'data:image/png;base64,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';

const styles = [
  typescaleStyles,
  css`
    .container {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      color: var(--md-sys-color-on-surface);
    }

    .card {
      width: 192px;
    }

    img {
      border-radius: inherit;
      background: #dadce0;
      object-fit: contain;
      height: 128px;
    }

    .content {
      display: flex;
      flex-direction: column;
      flex: 1;
      justify-content: space-between;
      padding: 16px;
      gap: 16px;
    }
  `,
];

const cards: MaterialStoryInit<StoryKnobs> = {
  name: 'Cards',
  styles,
  render() {
    return html`
      <div class="container md-typescale-body-medium">
        <md-elevated-card class="card">
          <img src=${MEDIA_IMAGE} alt="Placeholder image" />
          <div class="content">A static elevated card</div>
        </md-elevated-card>

        <md-filled-card class="card">
          <img src=${MEDIA_IMAGE} alt="Placeholder image" />
          <div class="content">A static filled card</div>
        </md-filled-card>

        <md-outlined-card class="card">
          <img src=${MEDIA_IMAGE} alt="Placeholder image" />
          <div class="content">A static outlined card</div>
        </md-outlined-card>
      </div>
    `;
  },
};

const withActions: MaterialStoryInit<StoryKnobs> = {
  name: 'Cards with actions',
  styles,
  render() {
    return html`
      <div class="container md-typescale-body-medium">
        <md-elevated-card class="card">
          <img src=${MEDIA_IMAGE} alt="Placeholder image" />
          <div class="content">
            An elevated card with actions
            <md-filled-button>Card action</md-filled-button>
          </div>
        </md-elevated-card>

        <md-filled-card class="card">
          <img src=${MEDIA_IMAGE} alt="Placeholder image" />
          <div class="content">
            A filled card with actions
            <md-filled-button>Card action</md-filled-button>
          </div>
        </md-filled-card>

        <md-outlined-card class="card">
          <img src=${MEDIA_IMAGE} alt="Placeholder image" />
          <div class="content">
            An outlined card with actions
            <md-filled-button>Card action</md-filled-button>
          </div>
        </md-outlined-card>
      </div>
    `;
  },
};

/** Card stories. */
export const stories = [cards, withActions];
