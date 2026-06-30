/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/labs/gb/components/badge/md-badge.js';

import {MaterialStoryInit} from './material-collection.js';
import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.cssresult.js';
import {html} from 'lit';

adoptStyles(document, [m3Styles]);

/** Knob types for badge stories. */
export interface StoryKnobs {
  // Badge is stateless and has no knobs currently.
}

const playground: MaterialStoryInit<StoryKnobs> = {
  name: 'Playground',
  render() {
    return html`
      <div style="display: flex; gap: 16px; align-items: center;">
        <!-- Small badge (dot) -->
        <div style="position: relative; display: inline-block;">
          <div
            style="width: 40px; height: 40px; background: #ccc; border-radius: 8px;"></div>
          <md-gb-badge
            style="position: absolute; top: -3px; right: -3px;"></md-gb-badge>
        </div>

        <!-- Large badge (with text) -->
        <div style="position: relative; display: inline-block;">
          <div
            style="width: 40px; height: 40px; background: #ccc; border-radius: 8px;"></div>
          <md-gb-badge style="position: absolute; top: -8px; right: -8px;"
            >3</md-gb-badge
          >
        </div>

        <!-- Large badge (with multi-digit text) -->
        <div style="position: relative; display: inline-block;">
          <div
            style="width: 40px; height: 40px; background: #ccc; border-radius: 8px;"></div>
          <md-gb-badge style="position: absolute; top: -8px; right: -8px;"
            >99+</md-gb-badge
          >
        </div>
      </div>
    `;
  },
};

/** Badge stories. */
export const stories = [playground];
