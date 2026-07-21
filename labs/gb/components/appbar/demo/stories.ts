/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/labs/gb/components/appbar/md-gb-app-bar.js';
import '@material/web/labs/gb/components/iconbutton/md-gb-icon-button.js';
import '@material/web/labs/gb/styles/icon/md-gb-icon.js';

import {MaterialStoryInit} from './material-collection.js';
import {
  type AppBarSize,
  type AppBarVariant,
} from '@material/web/labs/gb/components/appbar/app-bar.js';
import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.cssresult.js';
import {css, html, nothing} from 'lit';

/** Knob types for app bar stories. */
export interface StoryKnobs {
  size?: AppBarSize;
  variant?: AppBarVariant;
  scrolled: boolean;
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
    border: 1px solid var(--md-sys-color-outline-variant);
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 24px;
    background-color: var(--md-sys-color-surface);
    box-shadow: var(--md-sys-elevation-shadow-1);
  }
`;

const playground: MaterialStoryInit<StoryKnobs> = {
  name: 'Playground',
  styles,
  render(knobs) {
    const size = knobs.size || 'sm';
    const variant = knobs.variant || 'standard';
    const scrolled = Boolean(knobs.scrolled);

    if (variant === 'search') {
      return html`
        <div class="demo-container">
          <md-gb-app-bar variant="search" ?scrolled=${scrolled}>
            <md-gb-icon-button slot="leading" color="standard">
              <md-gb-icon>menu</md-gb-icon>
            </md-gb-icon-button>
            <input
              slot="search"
              type="text"
              placeholder="Search Expressive App Bar..."
              style="width: 100%; border: none; background: transparent; font: inherit; color: var(--md-sys-color-on-surface); outline: none; padding: 8px;" />
            <md-gb-icon-button slot="trailing" color="standard">
              <md-gb-icon>account_circle</md-gb-icon>
            </md-gb-icon-button>
          </md-gb-app-bar>
        </div>
      `;
    }

    const showSubtitle = size === 'md' || size === 'lg';

    return html`
      <div class="demo-container">
        <md-gb-app-bar size=${size} ?scrolled=${scrolled}>
          <md-gb-icon-button slot="leading" color="standard">
            <md-gb-icon>menu</md-gb-icon>
          </md-gb-icon-button>
          Expressive App Bar (${size})
          ${showSubtitle
            ? html`<span slot="subtitle"
                >Two-tier expressive hierarchy (${size})</span
              >`
            : nothing}
          <md-gb-icon-button slot="trailing" color="standard">
            <md-gb-icon>search</md-gb-icon>
          </md-gb-icon-button>
          <md-gb-icon-button slot="trailing" color="standard">
            <md-gb-icon>more_vert</md-gb-icon>
          </md-gb-icon-button>
        </md-gb-app-bar>
      </div>
    `;
  },
};

const allSizes: MaterialStoryInit<StoryKnobs> = {
  name: 'Expressive Sizes & Variants',
  styles,
  render() {
    return html`
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div class="demo-container">
          <md-gb-app-bar size="sm">
            <md-gb-icon-button slot="leading" color="standard">
              <md-gb-icon>menu</md-gb-icon>
            </md-gb-icon-button>
            Small App Bar (sm)
            <md-gb-icon-button slot="trailing" color="standard">
              <md-gb-icon>search</md-gb-icon>
            </md-gb-icon-button>
            <md-gb-icon-button slot="trailing" color="standard">
              <md-gb-icon>account_circle</md-gb-icon>
            </md-gb-icon-button>
          </md-gb-app-bar>
        </div>

        <div class="demo-container">
          <md-gb-app-bar size="md">
            <md-gb-icon-button slot="leading" color="standard">
              <md-gb-icon>arrow_back</md-gb-icon>
            </md-gb-icon-button>
            Medium App Bar (md)
            <md-gb-icon-button slot="trailing" color="standard">
              <md-gb-icon>more_vert</md-gb-icon>
            </md-gb-icon-button>
          </md-gb-app-bar>
        </div>

        <div class="demo-container">
          <md-gb-app-bar size="md">
            <md-gb-icon-button slot="leading" color="standard">
              <md-gb-icon>menu</md-gb-icon>
            </md-gb-icon-button>
            Medium App Bar with Subtitle
            <span slot="subtitle">Two-tier expressive hierarchy</span>
            <md-gb-icon-button slot="trailing" color="standard">
              <md-gb-icon>edit</md-gb-icon>
            </md-gb-icon-button>
          </md-gb-app-bar>
        </div>

        <div class="demo-container">
          <md-gb-app-bar size="lg">
            <md-gb-icon-button slot="leading" color="standard">
              <md-gb-icon>menu</md-gb-icon>
            </md-gb-icon-button>
            Large App Bar (lg)
            <md-gb-icon-button slot="trailing" color="standard">
              <md-gb-icon>settings</md-gb-icon>
            </md-gb-icon-button>
          </md-gb-app-bar>
        </div>

        <div class="demo-container">
          <md-gb-app-bar size="lg">
            <md-gb-icon-button slot="leading" color="standard">
              <md-gb-icon>menu</md-gb-icon>
            </md-gb-icon-button>
            Large App Bar with Subtitle
            <span slot="subtitle">Dynamic headline layout</span>
            <md-gb-icon-button slot="trailing" color="standard">
              <md-gb-icon>account_circle</md-gb-icon>
            </md-gb-icon-button>
          </md-gb-app-bar>
        </div>

        <div class="demo-container">
          <md-gb-app-bar variant="search">
            <md-gb-icon-button slot="leading" color="standard">
              <md-gb-icon>search</md-gb-icon>
            </md-gb-icon-button>
            <input
              slot="search"
              type="text"
              placeholder="Search variant..."
              style="width:100%; border:none; background:transparent; font:inherit; color: var(--md-sys-color-on-surface); outline:none;" />
            <md-gb-icon-button slot="trailing" color="standard">
              <md-gb-icon>close</md-gb-icon>
            </md-gb-icon-button>
          </md-gb-app-bar>
        </div>

        <div class="demo-container">
          <md-gb-app-bar size="md" scrolled>
            <md-gb-icon-button slot="leading" color="standard">
              <md-gb-icon>menu</md-gb-icon>
            </md-gb-icon-button>
            Scrolled App Bar (Declarative property)
            <span slot="subtitle">Demonstrating elevated scrolled style</span>
            <md-gb-icon-button slot="trailing" color="standard">
              <md-gb-icon>filter_list</md-gb-icon>
            </md-gb-icon-button>
          </md-gb-app-bar>
        </div>
      </div>
    `;
  },
};

/** App Bar stories. */
export const stories = [playground, allSizes];
