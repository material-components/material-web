/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/labs/aria/tabs/md-aria-tab.js';
import '@material/web/labs/aria/tabs/md-aria-tablist.js';
import '@material/web/labs/aria/tabs/md-aria-tabpanel.js';

import {MaterialStoryInit} from './material-collection.js';
import {css, html} from 'lit';

/** Knob types for ARIA Tabs stories. */
export interface StoryKnobs {
  autoSelect: boolean;
  orientation: 'horizontal' | 'vertical';
}

const styles = [
  css`
    .container {
      display: flex;
      flex-direction: column;
      font-family: system-ui, sans-serif;
      max-width: 600px;
      margin: 16px;
    }

    .container:has(md-aria-tablist[orientation='vertical']) {
      flex-direction: row;
    }

    /* Horizontal tablist & tabs (default) */
    md-aria-tablist {
      gap: 4px;
      border-bottom: 2px solid #ccc;
    }

    md-aria-tab {
      padding: 8px 16px;
      font-weight: 500;
      border: 1px solid transparent;
      border-bottom: none;
      border-radius: 4px 4px 0 0;
      background: #f0f0f0;
      color: #333;
      user-select: none;
    }

    md-aria-tab:state(selected) {
      background: #ffffff;
      border-color: #ccc;
      color: #1a73e8;
      border-top: 3px solid #1a73e8;
    }

    /* Vertical tablist & tabs */
    md-aria-tablist[orientation='vertical'] {
      border-bottom: none;
      border-right: 2px solid #ccc;
    }

    md-aria-tablist[orientation='vertical'] md-aria-tab {
      border-bottom: 1px solid transparent;
      border-right: none;
      border-radius: 4px 0 0 4px;
    }

    md-aria-tablist[orientation='vertical'] md-aria-tab:state(selected) {
      background: #ffffff;
      border-color: #ccc;
      color: #1a73e8;
      border-top: 1px solid #ccc;
      border-left: 3px solid #1a73e8;
    }

    /* Focus indicators */
    md-aria-tab:focus-visible {
      outline: 2px solid #1a73e8;
      outline-offset: -2px;
    }

    /* Tabpanel */
    md-aria-tabpanel {
      flex: 1;
      padding: 16px;
      border: 1px solid #ccc;
      border-top: none;
      background: #ffffff;
      min-height: 100px;
    }

    .container:has(md-aria-tablist[orientation='vertical']) md-aria-tabpanel {
      border-top: 1px solid #ccc;
      border-left: none;
    }

    md-aria-tabpanel:focus-visible {
      outline: 2px dashed #1a73e8;
      outline-offset: -2px;
    }
  `,
];

const tabs: MaterialStoryInit<StoryKnobs> = {
  name: 'ARIA Tabs',
  styles,
  render(knobs) {
    return html`
      <div class="container">
        <md-aria-tablist
          ?autoselect=${knobs.autoSelect}
          .orientation=${knobs.orientation}>
          <md-aria-tab id="tab-1" tabpanel="panel-1">First Tab</md-aria-tab>
          <md-aria-tab id="tab-2" tabpanel="panel-2">Second Tab</md-aria-tab>
          <md-aria-tab id="tab-3" tabpanel="panel-3">Third Tab</md-aria-tab>
        </md-aria-tablist>

        <md-aria-tabpanel id="panel-1" tab="tab-1">
          <p>Content for the first panel.</p>
        </md-aria-tabpanel>
        <md-aria-tabpanel id="panel-2" tab="tab-2">
          <p>Content for the second panel.</p>
        </md-aria-tabpanel>
        <md-aria-tabpanel id="panel-3" tab="tab-3">
          <p>Content for the third panel.</p>
        </md-aria-tabpanel>
      </div>
    `;
  },
};

/** ARIA Tabs stories. */
export const stories = [tabs];
