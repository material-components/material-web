/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/fab/branded-fab.js';
import '@material/web/fab/fab.js';
import '@material/web/icon/icon.js';

import {FabSize} from '@material/web/fab/fab.js';
import {
  labelStyles,
  MaterialStoryInit,
} from './material-collection.js';
import {css, html, nothing} from 'lit';

/** Knob types for fab stories. */
export interface StoryKnobs {
  icon: string;
  label: string;
  lowered: boolean;
  size: FabSize | undefined;
}

const styles = css`
  .row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }

  label {
    flex-direction: column;
    gap: 16px;
  }
`;

const standard: MaterialStoryInit<StoryKnobs> = {
  name: 'Floating action buttons',
  styles: [labelStyles, styles],
  render({icon, label, lowered, size}) {
    return html`
      <div class="row">
        <label>
          <span aria-hidden="true">Surface</span>
          <md-fab
            aria-label=${label ? nothing : 'An example surface FAB'}
            variant="surface"
            .lowered=${lowered}
            .label=${label}
            .size=${size!}>
            <md-icon slot="icon">${icon}</md-icon>
          </md-fab>
        </label>

        <label>
          <span aria-hidden="true">Primary</span>
          <md-fab
            aria-label=${label ? nothing : 'An example primary FAB'}
            variant="primary"
            .lowered=${lowered}
            .label=${label}
            .size=${size!}>
            <md-icon slot="icon">${icon}</md-icon>
          </md-fab>
        </label>

        <label>
          <span aria-hidden="true">Secondary</span>
          <md-fab
            aria-label=${label ? nothing : 'An example secondary FAB'}
            variant="secondary"
            .lowered=${lowered}
            .label=${label}
            .size=${size!}>
            <md-icon slot="icon">${icon}</md-icon>
          </md-fab>
        </label>

        <label>
          <span aria-hidden="true">Tertiary</span>
          <md-fab
            aria-label=${label ? nothing : 'An example tertiary FAB'}
            variant="tertiary"
            .lowered=${lowered}
            .label=${label}
            .size=${size!}>
            <md-icon slot="icon">${icon}</md-icon>
          </md-fab>
        </label>

        <label>
          <span aria-hidden="true">Branded</span>
          <md-branded-fab
            aria-label=${label ? nothing : 'An example branded FAB'}
            .lowered=${lowered}
            .label=${label}
            .size=${size!}>
            <svg slot="icon" width="36" height="36" viewBox="0 0 36 36">
              <path fill="#34A853" d="M16 16v14h4V20z"></path>
              <path fill="#4285F4" d="M30 16H20l-4 4h14z"></path>
              <path fill="#FBBC05" d="M6 16v4h10l4-4z"></path>
              <path fill="#EA4335" d="M20 16V6h-4v14z"></path>
              <path fill="none" d="M0 0h36v36H0z"></path>
            </svg>
          </md-branded-fab>
        </label>
      </div>
    `;
  },
};

/** Checkbox stories. */
export const stories = [standard];
