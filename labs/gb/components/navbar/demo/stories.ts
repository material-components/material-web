/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/labs/gb/components/navbar/md-gb-nav-bar.js';
import '@material/web/labs/gb/components/navbar/md-gb-nav-bar-item.js';
import '@material/web/labs/gb/styles/icon/md-gb-icon.js';

import {type MaterialStoryInit} from './material-collection.js';
import {type NavBarItemLayout} from '@material/web/labs/gb/components/navbar/nav-bar.js';
import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
import {css, html} from 'lit';

import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.css' with {type: 'css'}; // github-only
// import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.cssresult.js'; // google3-only

/** Knob types for navigation bar stories. */
export interface StoryKnobs {
  itemLayout?: NavBarItemLayout;
  showBadges: boolean;
}

adoptStyles(document, [
  m3Styles,
  css`
    :root {
      --md-icon-font: 'Material Symbols Outlined';
    }
  `,
]);

const styles = css`
  .demo-container {
    align-items: flex-end;
    background-color: var(--md-sys-color-surface);
    border: 1px solid var(--md-sys-color-outline-variant);
    border-radius: 16px;
    box-shadow: var(--md-sys-elevation-shadow-1);
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
    min-height: 160px;
    overflow: hidden;
    padding: 0;
    width: 100%;
    max-width: 640px;
  }

  .demo-stack {
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
    max-width: 640px;
  }
`;

const playground: MaterialStoryInit<StoryKnobs> = {
  name: 'Playground',
  styles,
  render(knobs) {
    const itemLayout = knobs.itemLayout || 'vertical';
    const showBadges = Boolean(knobs.showBadges);

    return html`
      <div class="demo-container">
        <md-gb-nav-bar
          item-layout=${itemLayout}
          aria-label="Primary navigation">
          <md-gb-nav-bar-item active badge=${showBadges ? 'dot' : ''}>
            <md-gb-icon slot="icon">home</md-gb-icon>
            Home
          </md-gb-nav-bar-item>
          <md-gb-nav-bar-item badge=${showBadges ? '3' : ''}>
            <md-gb-icon slot="icon">explore</md-gb-icon>
            Explore
          </md-gb-nav-bar-item>
          <md-gb-nav-bar-item badge=${showBadges ? '99+' : ''}>
            <md-gb-icon slot="icon">library_music</md-gb-icon>
            Library
          </md-gb-nav-bar-item>
          <md-gb-nav-bar-item>
            <md-gb-icon slot="icon">person</md-gb-icon>
            Profile
          </md-gb-nav-bar-item>
        </md-gb-nav-bar>
      </div>
    `;
  },
};

const allVariants: MaterialStoryInit<StoryKnobs> = {
  name: 'Expressive Variants',
  styles,
  render() {
    return html`
      <div class="demo-stack">
        <div class="demo-container">
          <md-gb-nav-bar
            item-layout="vertical"
            aria-label="Vertical item navigation bar">
            <md-gb-nav-bar-item active>
              <md-gb-icon slot="icon">home</md-gb-icon>
              Home
            </md-gb-nav-bar-item>
            <md-gb-nav-bar-item badge="4">
              <md-gb-icon slot="icon">mail</md-gb-icon>
              Inbox
            </md-gb-nav-bar-item>
            <md-gb-nav-bar-item badge="dot">
              <md-gb-icon slot="icon">chat_bubble</md-gb-icon>
              Chat
            </md-gb-nav-bar-item>
            <md-gb-nav-bar-item>
              <md-gb-icon slot="icon">videocam</md-gb-icon>
              Meet
            </md-gb-nav-bar-item>
          </md-gb-nav-bar>
        </div>

        <div class="demo-container">
          <md-gb-nav-bar
            item-layout="horizontal"
            aria-label="Horizontal item navigation bar">
            <md-gb-nav-bar-item active>
              <md-gb-icon slot="icon">auto_awesome</md-gb-icon>
              For You
            </md-gb-nav-bar-item>
            <md-gb-nav-bar-item>
              <md-gb-icon slot="icon">bookmark</md-gb-icon>
              Saved
            </md-gb-nav-bar-item>
            <md-gb-nav-bar-item>
              <md-gb-icon slot="icon">settings</md-gb-icon>
              Settings
            </md-gb-nav-bar-item>
          </md-gb-nav-bar>
        </div>
      </div>
    `;
  },
};

/** Navigation Bar stories. */
export const stories = [playground, allVariants];
