/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/icon/icon.js';
import '@material/web/labs/navigationrail/navigation-rail.js';
import '@material/web/labs/navigationtab/navigation-tab.js';

import {css, html} from 'lit';

import {MaterialStoryInit} from './material-collection.js';

const story: MaterialStoryInit = {
  name: '<md-navigation-rail>',
  styles: css`
    :host {
      --md-icon-font: 'Material Icons';
      height: 360px;
    }
  `,
  render() {
    return html`
      <md-navigation-rail aria-label="Main navigation">
        <md-navigation-tab label="Home">
          <md-icon slot="active-icon">home</md-icon>
          <md-icon slot="inactive-icon">home</md-icon>
        </md-navigation-tab>
        <md-navigation-tab label="Search">
          <md-icon slot="active-icon">search</md-icon>
          <md-icon slot="inactive-icon">search</md-icon>
        </md-navigation-tab>
        <md-navigation-tab label="Settings">
          <md-icon slot="active-icon">settings</md-icon>
          <md-icon slot="inactive-icon">settings</md-icon>
        </md-navigation-tab>
      </md-navigation-rail>
    `;
  },
};

export const stories = [story];
