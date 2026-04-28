/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/labs/gb/components/button/md-button.js';
import '@material/web/labs/gb/components/card/md-card.js';

import {MaterialStoryInit} from './material-collection.js';
import {CardColor} from '@material/web/labs/gb/components/card/card.js';
import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
import {css, html, nothing} from 'lit';

import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.css' with {type: 'css'}; // github-only
// import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.cssresult.js'; // google3-only

/** Knob types for card stories. */
export interface StoryKnobs {
  color?: CardColor;
  disabled: boolean;
  interactive: boolean;
}

adoptStyles(document, [m3Styles]);

const styles = css`
  .row {
    display: flex;
    gap: 16px;
  }

  .content {
    padding: 16px;
    font: var(--md-sys-typescale-body-md);
    letter-spacing: var(--md-sys-typescale-body-md-tracking);
  }

  .layout-card {
    width: 320px;

    .content {
      display: flex;
      flex-direction: column;
      flex: 1;
      height: 100%;

      h2 {
        font: var(--md-sys-typescale-headline-sm);
        letter-spacing: var(--md-sys-typescale-headline-sm-tracking);
        margin-block: 0 4px;
      }
      h3 {
        font: var(--md-sys-typescale-body-lg);
        letter-spacing: var(--md-sys-typescale-body-lg-tracking);
        margin-block: 0 16px;
      }
      p {
        margin-block: 0 24px;
      }
      .actions {
        margin-top: 16px;
        display: flex;
        justify-content: end;
        gap: 8px;
      }
    }
  }
`;

const playground: MaterialStoryInit<StoryKnobs> = {
  name: 'Playground',
  styles,
  render(knobs) {
    return html`
      <md-card
        color=${knobs.color || nothing}
        ?disabled=${knobs.disabled}
        ?interactive=${knobs.interactive}>
        <div class="content">Card content</div>
      </md-card>
    `;
  },
};

const colors: MaterialStoryInit<StoryKnobs> = {
  name: 'Colors',
  styles,
  render(knobs) {
    return html`
      <div class="row">
        <md-card
          color="elevated"
          ?disabled=${knobs.disabled}
          ?interactive=${knobs.interactive}>
          <div class="content">Card content</div>
        </md-card>
        <md-card
          color="filled"
          ?disabled=${knobs.disabled}
          ?interactive=${knobs.interactive}>
          <div class="content">Card content</div>
        </md-card>
        <md-card
          color="outlined"
          ?disabled=${knobs.disabled}
          ?interactive=${knobs.interactive}>
          <div class="content">Card content</div>
        </md-card>
      </div>
    `;
  },
};

const layouts: MaterialStoryInit<StoryKnobs> = {
  name: 'Layouts',
  styles,
  render(knobs) {
    return html`
      <md-card
        class="layout-card"
        color=${knobs.color || 'elevated'}
        ?disabled=${knobs.disabled}
        ?interactive=${knobs.interactive}>
        <div class="content">
          <h2>Headline</h2>
          <h3>Subhead</h3>
          <p>
            Explain more about the topic shown in the medium display and subhead
            through supporting text here.
          </p>
          <div class="actions">
            <md-button color="outlined">Action</md-button>
            <md-button color="filled">Action</md-button>
          </div>
        </div>
      </md-card>
    `;
  },
};

/** Card stories. */
export const stories = [playground, colors, layouts];
