/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/labs/gb/components/loading/md-gb-loading.js';

import {type MaterialStoryInit} from './material-collection.js';
import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.cssresult.js';
import {css, html} from 'lit';

adoptStyles(document, [m3Styles]);

/** Knob types for loading stories. */
export interface StoryKnobs {
  contained: boolean;
  closed: boolean;
  ariaLabel: string;
}

const demoStyles = css`
  .demo-row {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 32px;
    padding: 24px;
    transition: all;
  }

  .demo-card {
    align-items: center;
    background-color: var(--md-sys-color-surface-container);
    border-radius: var(--md-sys-shape-corner-large);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 16px;
    inline-size: 280px;
    justify-content: center;
    min-block-size: 160px;
    padding: 24px;
    transition: all;
  }

  .demo-card-label {
    color: var(--md-sys-color-on-surface);
    font: var(--md-sys-typescale-title-small);
    margin: 0;
    transition: all;
  }
`;

const playground: MaterialStoryInit<StoryKnobs> = {
  name: 'Playground',
  styles: [demoStyles],
  render({contained, closed, ariaLabel}) {
    return html`
      <div class="demo-row">
        <md-gb-loading
          ?contained=${contained}
          ?closed=${closed}
          aria-label=${ariaLabel}></md-gb-loading>
      </div>
    `;
  },
};

const configurations: MaterialStoryInit<StoryKnobs> = {
  name: 'Configurations',
  styles: [demoStyles],
  render() {
    return html`
      <div class="demo-row">
        <div class="demo-card">
          <p class="demo-card-label">Default (Uncontained)</p>
          <md-gb-loading
            aria-label="Default loading"></md-gb-loading>
        </div>

        <div class="demo-card">
          <p class="demo-card-label">Contained</p>
          <md-gb-loading
            contained
            aria-label="Contained loading"></md-gb-loading>
        </div>
      </div>
    `;
  },
};

/** All loading stories. */
export const stories = [playground, configurations];
