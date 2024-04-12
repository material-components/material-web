/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/icon/icon.js';
import '@material/web/labs/navigationbar/navigation-bar.js';
import '@material/web/labs/navigationtab/navigation-tab.js';

import {MaterialStoryInit} from './material-collection.js';
import {css, html} from 'lit';

/** Knob types for nav bar stories. */
export interface StoryKnobs {
  hideInactiveLabels: boolean;
  label: string;
  showBadge: boolean;
  badgeValue: string;
  'active icon': string;
  'inactive icon': string;
}

const standard: MaterialStoryInit<StoryKnobs> = {
  name: '<md-navigation-bar>',
  styles: css`
    :host {
      /* Material Symbols does not include filled star. */
      --md-icon-font: 'Material Icons';
    }
  `,
  render(knobs) {
    const {hideInactiveLabels, label, showBadge, badgeValue} = knobs;
    return html` <div style="width:400px">
      <md-navigation-bar
        activeIndex="1"
        .hideInactiveLabels=${hideInactiveLabels}>
        <md-navigation-tab
          .label=${label}
          .showBadge=${showBadge}
          .badgeValue=${badgeValue}>
          <md-icon slot="active-icon">${knobs['active icon']}</md-icon>
          <md-icon slot="inactive-icon">${knobs['inactive icon']}</md-icon>
        </md-navigation-tab>

        <md-navigation-tab
          .label=${label}
          .showBadge=${showBadge}
          .badgeValue=${badgeValue}>
          <md-icon slot="active-icon">${knobs['active icon']}</md-icon>
          <md-icon slot="inactive-icon">${knobs['inactive icon']}</md-icon>
        </md-navigation-tab>

        <md-navigation-tab
          .label=${label}
          .showBadge=${showBadge}
          .badgeValue=${badgeValue}>
          <md-icon slot="active-icon">${knobs['active icon']}</md-icon>
          <md-icon slot="inactive-icon">${knobs['inactive icon']}</md-icon>
        </md-navigation-tab>

        <md-navigation-tab
          .label=${label}
          .showBadge=${showBadge}
          .badgeValue=${badgeValue}>
          <md-icon slot="active-icon">${knobs['active icon']}</md-icon>
          <md-icon slot="inactive-icon">${knobs['inactive icon']}</md-icon>
        </md-navigation-tab>
      </md-navigation-bar>
    </div>`;
  },
};

/** Nav Bar stories. */
export const stories = [standard];
