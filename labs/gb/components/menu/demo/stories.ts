/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/labs/gb/components/menu/md-menu.js';
import '@material/web/labs/gb/components/menu/md-menu-group.js';
import '@material/web/labs/gb/components/menu/md-menu-item.js';

import {MaterialStoryInit} from './material-collection.js';
import {button} from '@material/web/labs/gb/components/button/button.js';
import {styles as buttonStyles} from '@material/web/labs/gb/components/button/button.cssresult.js';
import {divider} from '@material/web/labs/gb/components/divider/divider.js';
import {styles as dividerStyles} from '@material/web/labs/gb/components/divider/divider.cssresult.js';
import {styles as focusRingStyles} from '@material/web/labs/gb/components/focus/focus-ring.cssresult.js';
import {styles as menuStyles} from '@material/web/labs/gb/components/menu/menu.cssresult.js';
import {styles as rippleStyles} from '@material/web/labs/gb/components/ripple/ripple.cssresult.js';
import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
import m3Styles from '@material/web/labs/gb/styles/m3.cssresult.js';
import {css, html} from 'lit';

/** Knob types for menu stories. */
export interface StoryKnobs {
  vibrant: boolean;
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
  dividerStyles,
  menuStyles,
  buttonStyles,
  focusRingStyles,
  rippleStyles,
];

const playground: MaterialStoryInit<StoryKnobs> = {
  name: 'Playground',
  styles,
  render(knobs) {
    return html`
      <button popovertarget="menu" class=${button({color: 'filled'})}>
        Open Menu
      </button>
      <md-menu id="menu" color=${knobs.vibrant ? 'vibrant' : 'standard'}>
        <md-menu-item>Standard Item 1</md-menu-item>
        <md-menu-item>
          Standard Item 2
          <span slot="supporting-text">Supporting text</span>
        </md-menu-item>
        <md-menu-item disabled>Standard Item 3</md-menu-item>
        <hr class=${divider()} />
        <md-menu-group checkable="single">
          <md-menu-item checked>Radio 1</md-menu-item>
          <md-menu-item>Radio 2</md-menu-item>
          <md-menu-item disabled>Radio 3</md-menu-item>
        </md-menu-group>
        <hr class=${divider()} />
        <md-menu-group checkable="multiple">
          <md-menu-item checked>Checkbox 1</md-menu-item>
          <md-menu-item>Checkbox 2</md-menu-item>
          <md-menu-item disabled checked>Checkbox 3</md-menu-item>
        </md-menu-group>
      </md-menu>
    `;
  },
};

// TODO: add submenu support

/** Menu stories. */
export const stories = [playground];
