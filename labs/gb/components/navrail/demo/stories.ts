/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/labs/gb/components/fab/md-gb-fab.js';
import '@material/web/labs/gb/components/iconbutton/md-gb-icon-button.js';
import '@material/web/labs/gb/components/navrail/md-gb-nav-rail.js';
import '@material/web/labs/gb/components/navrail/md-gb-nav-rail-item.js';
import '@material/web/labs/gb/styles/icon/md-gb-icon.js';

import {type MaterialStoryInit} from './material-collection.js';
import {type NavRailAlignment} from '@material/web/labs/gb/components/navrail/nav-rail.js';
import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
import {css, html, nothing} from 'lit';

import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.css' with {type: 'css'}; // github-only
// import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.cssresult.js'; // google3-only

/** Knob types for navigation rail stories. */
export interface StoryKnobs {
  alignment?: NavRailAlignment;
  expanded?: boolean;
  modal?: boolean;
  showBadges?: boolean;
  showHeader?: boolean;
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
  .demo-shell {
    background-color: var(--md-sys-color-surface-container-lowest);
    border: 1px solid var(--md-sys-color-outline-variant);
    border-radius: 16px;
    box-shadow: var(--md-sys-elevation-shadow-1);
    display: flex;
    height: 480px;
    max-width: 720px;
    overflow: hidden;
    width: 100%;
  }

  .demo-content {
    align-items: center;
    color: var(--md-sys-color-on-surface-variant);
    display: flex;
    flex: 1;
    font: var(--md-sys-typescale-body-lg);
    justify-content: center;
    padding: 24px;
  }

  .demo-row {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
  }
`;

const playground: MaterialStoryInit<StoryKnobs> = {
  name: 'Playground',
  styles,
  render(knobs) {
    const alignment = knobs.alignment || 'top';
    const expanded = Boolean(knobs.expanded);
    const modal = Boolean(knobs.modal);
    const showBadges = Boolean(knobs.showBadges);
    const showHeader = Boolean(knobs.showHeader);

    return html`
      <div class="demo-shell">
        <md-gb-nav-rail
          alignment=${alignment}
          ?collapsible=${showHeader}
          ?expanded=${expanded}
          ?modal=${modal}
          aria-label="Primary navigation rail">
          ${showHeader
            ? html`
                <md-gb-icon-button
                  slot="header"
                  aria-label="Toggle navigation rail">
                  <md-gb-icon>${expanded ? 'menu_open' : 'menu'}</md-gb-icon>
                </md-gb-icon-button>
                <md-gb-fab
                  slot="header"
                  color="tertiary-container"
                  aria-label="Compose">
                  <md-gb-icon>edit</md-gb-icon>
                  <span>Compose</span>
                </md-gb-fab>
              `
            : nothing}
          <md-gb-nav-rail-item selected badge=${showBadges ? 'dot' : ''}>
            <md-gb-icon slot="icon">mail</md-gb-icon>
            Inbox
          </md-gb-nav-rail-item>
          <md-gb-nav-rail-item badge=${showBadges ? '4' : ''}>
            <md-gb-icon slot="icon">chat_bubble</md-gb-icon>
            Chat
          </md-gb-nav-rail-item>
          <md-gb-nav-rail-item badge=${showBadges ? '99+' : ''}>
            <md-gb-icon slot="icon">groups</md-gb-icon>
            Spaces
          </md-gb-nav-rail-item>
          <md-gb-nav-rail-item>
            <md-gb-icon slot="icon">videocam</md-gb-icon>
            Meet
          </md-gb-nav-rail-item>
        </md-gb-nav-rail>
        <div class="demo-content">Main application workspace</div>
      </div>
    `;
  },
};

const allVariants: MaterialStoryInit<StoryKnobs> = {
  name: 'Collapsed, Expanded & Aligned',
  styles,
  render() {
    return html`
      <div class="demo-row">
        <div class="demo-shell">
          <md-gb-nav-rail aria-label="Collapsed navigation rail">
            <md-gb-icon-button
              slot="header"
              aria-label="Toggle navigation rail">
              <md-gb-icon>menu</md-gb-icon>
            </md-gb-icon-button>
            <md-gb-fab
              slot="header"
              color="tertiary-container"
              aria-label="Create">
              <md-gb-icon>add</md-gb-icon>
              <span>Create</span>
            </md-gb-fab>
            <md-gb-nav-rail-item selected>
              <md-gb-icon slot="icon">home</md-gb-icon>
              Home
            </md-gb-nav-rail-item>
            <md-gb-nav-rail-item badge="3">
              <md-gb-icon slot="icon">explore</md-gb-icon>
              Explore
            </md-gb-nav-rail-item>
            <md-gb-nav-rail-item badge="dot">
              <md-gb-icon slot="icon">library_music</md-gb-icon>
              Library
            </md-gb-nav-rail-item>
            <md-gb-nav-rail-item>
              <md-gb-icon slot="icon">settings</md-gb-icon>
              Settings
            </md-gb-nav-rail-item>
          </md-gb-nav-rail>
          <div class="demo-content">Collapsed Rail (Top Aligned)</div>
        </div>

        <div class="demo-shell">
          <md-gb-nav-rail expanded modal aria-label="Expanded navigation rail">
            <md-gb-icon-button
              slot="header"
              aria-label="Toggle navigation rail">
              <md-gb-icon>menu_open</md-gb-icon>
            </md-gb-icon-button>
            <md-gb-fab
              slot="header"
              color="tertiary-container"
              aria-label="Compose">
              <md-gb-icon>edit</md-gb-icon>
              <span>Compose</span>
            </md-gb-fab>
            <md-gb-nav-rail-item selected>
              <md-gb-icon slot="icon">inbox</md-gb-icon>
              Inbox
            </md-gb-nav-rail-item>
            <md-gb-nav-rail-item badge="12">
              <md-gb-icon slot="icon">star</md-gb-icon>
              Starred
            </md-gb-nav-rail-item>
            <md-gb-nav-rail-item>
              <md-gb-icon slot="icon">send</md-gb-icon>
              Sent
            </md-gb-nav-rail-item>
            <md-gb-nav-rail-item>
              <md-gb-icon slot="icon">delete</md-gb-icon>
              Trash
            </md-gb-nav-rail-item>
          </md-gb-nav-rail>
          <div class="demo-content">Expanded Modal Rail</div>
        </div>

        <div class="demo-shell">
          <md-gb-nav-rail
            collapsible
            alignment="center"
            aria-label="Center aligned navigation rail">
            <md-gb-nav-rail-item selected>
              <md-gb-icon slot="icon">dashboard</md-gb-icon>
              Overview
            </md-gb-nav-rail-item>
            <md-gb-nav-rail-item>
              <md-gb-icon slot="icon">analytics</md-gb-icon>
              Analytics
            </md-gb-nav-rail-item>
            <md-gb-nav-rail-item>
              <md-gb-icon slot="icon">person</md-gb-icon>
              Account
            </md-gb-nav-rail-item>
          </md-gb-nav-rail>
          <div class="demo-content">Center Aligned Rail</div>
        </div>
      </div>
    `;
  },
};

/** Navigation Rail stories. */
export const stories = [playground, allVariants];
