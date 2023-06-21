/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/fab/fab.js';
import '@material/web/icon/icon.js';
import '@material/web/fab/branded-fab.js';

import {FabSize, Variant} from '@material/web/fab/fab.js';
import {MaterialStoryInit} from './material-collection.js';
import {css, html} from 'lit';

/** Knob types for fab stories. */
export interface StoryKnobs {
  icon: string;
  label: string;
  lowered: boolean;
  size: FabSize|undefined;
  variant: Variant|undefined;
  reducedTouchTarget: boolean;
  hasIcon: boolean;
}

const styles = css`
  .fab {
    padding: 8px;
  }
`;

const standard: MaterialStoryInit<StoryKnobs> = {
  name: '<md-fab>',
  styles,
  render({icon, label, lowered, size, variant, reducedTouchTarget, hasIcon}) {
    return html`
      <md-fab
          class="fab"
          .variant=${variant!}
          .reducedTouchTarget=${reducedTouchTarget}
          .lowered=${lowered}
          .label=${label}
          .size=${size!}
          .hasIcon=${hasIcon}>
        <md-icon slot="icon">${icon}</md-icon>
      </md-fab>
    `;
  }
};

const branded: MaterialStoryInit<StoryKnobs> = {
  name: '<md-branded-fab>',
  styles,
  render({label, lowered, size, reducedTouchTarget, hasIcon}) {
    return html`
      <md-branded-fab
          class="fab"
          .reducedTouchTarget=${reducedTouchTarget}
          .lowered=${lowered}
          .label=${label}
          .size=${size!}
          .hasIcon=${hasIcon}>
        <svg slot="icon" width="36" height="36" viewBox="0 0 36 36">
          <path fill="#34A853" d="M16 16v14h4V20z"></path>
          <path fill="#4285F4" d="M30 16H20l-4 4h14z"></path>
          <path fill="#FBBC05" d="M6 16v4h10l4-4z"></path>
          <path fill="#EA4335" d="M20 16V6h-4v14z"></path>
          <path fill="none" d="M0 0h36v36H0z"></path>
        </svg>
    </md-branded-fab>
  `;
  }
};

/** Checkbox stories. */
export const stories = [standard, branded];
