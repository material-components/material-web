/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/labs/aria/tabs/md-aria-tabpanel.js';
import '@material/web/labs/gb/components/tabs/md-gb-tab.js';
import '@material/web/labs/gb/components/tabs/md-gb-tabs.js';
import '@material/web/labs/gb/styles/icon/md-gb-icon.js';

import {MaterialStoryInit} from './material-collection.js';
import {styles as badgeStyles} from '@material/web/labs/gb/components/badge/badge.cssresult.js';
import {styles as focusRingStyles} from '@material/web/labs/gb/components/focus/focus-ring.cssresult.js';
import {styles as rippleStyles} from '@material/web/labs/gb/components/ripple/ripple.cssresult.js';
import {styles as tabsStyles} from '@material/web/labs/gb/components/tabs/tabs.cssresult.js';
import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.cssresult.js';
import {css, html} from 'lit';

/** Knob types for tabs stories. */
export interface StoryKnobs {
  variant?: 'primary' | 'secondary';
  selectedIndex: number;
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
  tabsStyles,
  css`
    .container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      inline-size: 480px;
    }
  `,
];

const playground: MaterialStoryInit<StoryKnobs> = {
  name: 'Playground',
  styles,
  render({variant, selectedIndex}) {
    const labels = ['Flights', 'Trips', 'Explore', 'Buy'];
    return html`
      <div class="container">
        <md-gb-tabs
          variant="${variant ?? 'primary'}"
          .selectedTabIndex="${selectedIndex}">
          ${labels.map(
            (label) => html`
              <md-gb-tab><span slot="label">${label}</span></md-gb-tab>
            `,
          )}
        </md-gb-tabs>
      </div>
    `;
  },
};

const withIcons: MaterialStoryInit<StoryKnobs> = {
  name: 'Icons',
  styles,
  render({variant, selectedIndex}) {
    const items = [
      {icon: 'flight', label: 'Flights'},
      {icon: 'luggage', label: 'Trips'},
      {icon: 'explore', label: 'Explore'},
    ];
    return html`
      <div class="container">
        <md-gb-tabs
          variant="${variant ?? 'primary'}"
          .selectedTabIndex="${selectedIndex}">
          ${items.map(
            ({icon, label}) => html`
              <md-gb-tab>
                <md-gb-icon>${icon}</md-gb-icon>
                <span slot="label">${label}</span>
              </md-gb-tab>
            `,
          )}
        </md-gb-tabs>
      </div>
    `;
  },
};

const iconOnly: MaterialStoryInit<StoryKnobs> = {
  name: 'Icon only',
  styles,
  render({variant, selectedIndex}) {
    const icons = ['flight', 'luggage', 'explore'];
    return html`
      <div class="container">
        <md-gb-tabs
          variant="${variant ?? 'primary'}"
          .selectedTabIndex="${selectedIndex}">
          ${icons.map(
            (icon) => html`
              <md-gb-tab>
                <md-gb-icon>${icon}</md-gb-icon>
              </md-gb-tab>
            `,
          )}
        </md-gb-tabs>
      </div>
    `;
  },
};

const iconOnlyWithBadge: MaterialStoryInit<StoryKnobs> = {
  name: 'Icon only with badge',
  styles: [...styles, badgeStyles],
  render({variant, selectedIndex}) {
    const items = [
      {icon: 'mail', badge: '3'},
      {icon: 'send', badge: ''},
      {icon: 'report', badge: '99+'},
    ];
    return html`
      <div class="container">
        <md-gb-tabs
          variant="${variant ?? 'primary'}"
          .selectedTabIndex="${selectedIndex}">
          ${items.map(
            ({icon, badge: count}) => html`
              <md-gb-tab>
                <md-gb-icon>${icon}</md-gb-icon>
                ${count
                  ? html`<span class="badge badge-large tab-badge" slot="badge"
                      >${count}</span
                    >`
                  : ''}
              </md-gb-tab>
            `,
          )}
        </md-gb-tabs>
      </div>
    `;
  },
};

const withBadges: MaterialStoryInit<StoryKnobs> = {
  name: 'Badges',
  styles: [...styles, badgeStyles],
  render({variant, selectedIndex}) {
    const items = [
      {label: 'Inbox', badge: '3'},
      {label: 'Sent', badge: ''},
      {label: 'Spam', badge: '99+'},
    ];
    return html`
      <div class="container">
        <md-gb-tabs
          variant="${variant ?? 'primary'}"
          .selectedTabIndex="${selectedIndex}">
          ${items.map(
            ({label, badge: count}) => html`
              <md-gb-tab>
                <span slot="label">${label}</span>
                ${count
                  ? html`<span class="badge badge-large tab-badge" slot="badge"
                      >${count}</span
                    >`
                  : ''}
              </md-gb-tab>
            `,
          )}
        </md-gb-tabs>
      </div>
    `;
  },
};

const iconsWithBadges: MaterialStoryInit<StoryKnobs> = {
  name: 'Icons with badges',
  styles: [...styles, badgeStyles],
  render({variant, selectedIndex}) {
    const items = [
      {icon: 'flight', label: 'Flights', badge: '3'},
      {icon: 'luggage', label: 'Trips', badge: ''},
      {icon: 'explore', label: 'Explore', badge: '99+'},
    ];
    return html`
      <div class="container">
        <md-gb-tabs
          variant="${variant ?? 'primary'}"
          .selectedTabIndex="${selectedIndex}">
          ${items.map(
            ({icon, label, badge: count}) => html`
              <md-gb-tab>
                <md-gb-icon>${icon}</md-gb-icon>
                <span slot="label">${label}</span>
                ${count
                  ? html`<span class="badge badge-large tab-badge" slot="badge"
                      >${count}</span
                    >`
                  : ''}
              </md-gb-tab>
            `,
          )}
        </md-gb-tabs>
      </div>
    `;
  },
};

const overflow: MaterialStoryInit<StoryKnobs> = {
  name: 'Overflow',
  styles,
  render({variant, selectedIndex}) {
    const labels = [
      'Flights',
      'Trips',
      'Explore',
      'Buy',
      'Hotels',
      'Car rental',
      'Packages',
      'Things to do',
    ];
    return html`
      <div class="container" style="inline-size: 320px;">
        <md-gb-tabs
          variant="${variant ?? 'primary'}"
          .selectedTabIndex="${selectedIndex}">
          ${labels.map(
            (label) => html`
              <md-gb-tab><span slot="label">${label}</span></md-gb-tab>
            `,
          )}
        </md-gb-tabs>
      </div>
    `;
  },
};

const withPanels: MaterialStoryInit<StoryKnobs> = {
  name: 'Tabpanels',
  styles,
  render({variant}) {
    return html`
      <div class="container">
        <md-gb-tabs variant="${variant ?? 'primary'}">
          <md-gb-tab tabpanel="panel-flights">
            <span slot="label">Flights</span>
          </md-gb-tab>
          <md-gb-tab tabpanel="panel-trips">
            <span slot="label">Trips</span>
          </md-gb-tab>
        </md-gb-tabs>
        <md-aria-tabpanel id="panel-flights">Flights content</md-aria-tabpanel>
        <md-aria-tabpanel id="panel-trips">Trips content</md-aria-tabpanel>
      </div>
    `;
  },
};

/** Tabs stories. */
export const stories = [
  playground,
  withIcons,
  iconOnly,
  iconOnlyWithBadge,
  withBadges,
  iconsWithBadges,
  overflow,
  withPanels,
];
