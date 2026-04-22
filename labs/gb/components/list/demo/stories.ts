/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/icon/icon.js';
import '@material/web/labs/gb/components/list/md-list.js';
import '@material/web/labs/gb/components/list/md-list-item.js';

import {MaterialStoryInit} from './material-collection.js';
import {styles as checkboxStyles} from '@material/web/labs/gb/components/checkbox/checkbox.cssresult.js';
import {styles as focusRingStyles} from '@material/web/labs/gb/components/focus/focus-ring.cssresult.js';
import {list, listItem} from '@material/web/labs/gb/components/list/list.js';
import {styles as listStyles} from '@material/web/labs/gb/components/list/list.cssresult.js';
import {styles as radioStyles} from '@material/web/labs/gb/components/radio/radio.cssresult.js';
import {styles as rippleStyles} from '@material/web/labs/gb/components/ripple/ripple.cssresult.js';
import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.cssresult.js';
import {css, html} from 'lit';

/** Knob types for list stories. */
export interface StoryKnobs {
  segmented: boolean;
  nonInteractive: boolean;
}

adoptStyles(document, [
  m3Styles,
  css`
    :root {
      --md-icon-font: 'Material Symbols Outlined';
    }
  `,
]);

const styles = [
  focusRingStyles,
  rippleStyles,
  listStyles,
  checkboxStyles,
  radioStyles,
  css`
    .container {
      background-color: var(--md-sys-color-surface-container);
      border-radius: var(--md-sys-shape-corner-lg);
      padding: 2rem;
      border: 1px solid var(--md-sys-color-outline-variant);
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  `,
];

const playground: MaterialStoryInit<StoryKnobs> = {
  name: 'Playground',
  styles,
  render(knobs) {
    return html`
      <div class="container" style="width: 360px;">
        <md-list ?segmented=${knobs.segmented}>
          <md-list-item ?static=${knobs.nonInteractive}>
            Basic Item
          </md-list-item>
          <md-list-item ?static=${knobs.nonInteractive}>
            <md-icon slot="leading">star</md-icon>
            With Leading Icon
          </md-list-item>
          <md-list-item ?static=${knobs.nonInteractive}>
            <span slot="avatar">A</span>
            With Avatar & Supporting Text
            <span slot="supporting-text">Supporting text goes here</span>
          </md-list-item>
          <md-list-item
            ?static=${knobs.nonInteractive}
            style="align-items: start;">
            <md-icon slot="leading">image</md-icon>
            <span slot="overline">Overline text</span>
            Complex Item
            <span slot="supporting-text">
              With overline, support text, and two icons
            </span>
            <span slot="trailing-text">100+</span>
            <md-icon slot="trailing">chevron_right</md-icon>
          </md-list-item>
          <md-list-item ?static=${knobs.nonInteractive} checked>
            <md-icon slot="leading">check</md-icon>
            Selected Item
          </md-list-item>
          <md-list-item ?static=${knobs.nonInteractive} disabled>
            <md-icon slot="leading">block</md-icon>
            Disabled Item
            <span slot="supporting-text">This item is disabled</span>
          </md-list-item>
        </md-list>
      </div>
    `;
  },
};

const staticList: MaterialStoryInit<StoryKnobs> = {
  name: 'Non-interactive',
  styles,
  render(knobs) {
    return html`
      <div class="container" style="width: 360px;">
        <md-list ?segmented=${knobs.segmented}>
          <md-list-item static>
            <md-icon slot="leading">developer_board</md-icon>
            The first computer (ENIAC)
            <span slot="trailing-text">Feb 14, 1946</span>
          </md-list-item>
          <md-list-item static>
            <md-icon slot="leading">satellite_alt</md-icon>
            Sputnik launched into space
            <span slot="trailing-text">Oct 4, 1957</span>
          </md-list-item>
          <md-list-item static>
            <md-icon slot="leading">rocket_launch</md-icon>
            The Apollo 11 moon landing
            <span slot="trailing-text">Jul 20, 1969</span>
          </md-list-item>
          <md-list-item static>
            <md-icon slot="leading">moon_stars</md-icon>
            Artemis 2 crewed lunar flyby
            <span slot="trailing-text">Apr 1, 2026</span>
          </md-list-item>
        </md-list>
      </div>
    `;
  },
};

const singleAction: MaterialStoryInit<StoryKnobs> = {
  name: 'Single-action',
  styles: [
    ...styles,
    css`
      .img {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        background-color: var(--md-sys-color-tertiary-container);
      }
    `,
  ],
  render(knobs) {
    return html`
      <div class="container" style="width: 360px;">
        <md-list ?segmented=${knobs.segmented}>
          <md-list-item>
            <div class="img" slot="avatar"></div>
            Festivals
            <span slot="supporting-text">Food, music, arts, community...</span>
            <span slot="trailing-text">May 8</span>
          </md-list-item>
          <md-list-item>
            <div class="img" slot="avatar"></div>
            Arts
            <span slot="supporting-text">
              Literature, games, music, physical...
            </span>
            <span slot="trailing-text">May 8</span>
          </md-list-item>
          <md-list-item>
            <div class="img" slot="avatar"></div>
            Family & friends
            <span slot="supporting-text">
              The relationships that bring and bind...
            </span>
            <span slot="trailing-text">May 8</span>
          </md-list-item>
        </md-list>
      </div>
    `;
  },
};

// TODO: add multi-action list examples

const singleSelect: MaterialStoryInit<StoryKnobs> = {
  name: 'Single-select',
  styles,
  render(knobs) {
    return html`
      <div class="container" style="width: 360px;">
        <select class="list-select" size="3">
          <div class="${list(knobs)}">
            <option class="${listItem()}">
              <div class="list-item-leading list-item-radio radio"></div>
              List item 1
            </option>
            <option class="${listItem()}" selected>
              <div class="list-item-leading list-item-radio radio"></div>
              List item 2
            </option>
            <option class="${listItem()}">
              <div class="list-item-leading list-item-radio radio"></div>
              List item 3
            </option>
          </div>
        </select>
      </div>
    `;
  },
};

const multiSelect: MaterialStoryInit<StoryKnobs> = {
  name: 'Multi-select',
  styles,
  render(knobs) {
    return html`
      <div class="container" style="width: 360px;">
        <select class="list-select" multiple size="3">
          <div class="${list(knobs)}">
            <option class="${listItem()}">
              <div class="list-item-leading list-item-checkbox checkbox"></div>
              List item 1
            </option>
            <option class="${listItem()}" selected>
              <div class="list-item-leading list-item-checkbox checkbox"></div>
              List item 2
            </option>
            <option class="${listItem()}">
              <div class="list-item-leading list-item-checkbox checkbox"></div>
              List item 3
            </option>
          </div>
        </select>
      </div>
    `;
  },
};

/** List stories. */
export const stories = [
  playground,
  singleAction,
  singleSelect,
  multiSelect,
  staticList,
];
