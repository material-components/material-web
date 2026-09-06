/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/button/filled-button.js';
import '@material/web/labs/tooltip/tooltip.js';

import {MaterialStoryInit} from './material-collection.js';
import {css, html} from 'lit';

export interface StoryKnobs {}

const styles = css`
  .examples {
    align-items: center;
    display: flex;
    gap: 32px;
    justify-content: center;
    min-height: 160px;
  }
`;

const basic: MaterialStoryInit<StoryKnobs> = {
  name: 'Tooltip',
  styles,
  render() {
    return html`
      <div class="examples">
        <md-tooltip text="Save your changes">
          <md-filled-button>Save</md-filled-button>
        </md-tooltip>
        <md-tooltip text="Additional information" placement="bottom">
          <button aria-label="More information">Info</button>
        </md-tooltip>
      </div>
    `;
  },
};

export const stories = [basic];
