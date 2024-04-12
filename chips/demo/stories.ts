/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/chips/assist-chip.js';
import '@material/web/chips/chip-set.js';
import '@material/web/chips/filter-chip.js';
import '@material/web/chips/input-chip.js';
import '@material/web/chips/suggestion-chip.js';
import '@material/web/icon/icon.js';

import {MaterialStoryInit} from './material-collection.js';
import {css, html, svg} from 'lit';
import {classMap} from 'lit/directives/class-map.js';

/** Knob types for chips stories. */
export interface StoryKnobs {
  label: string;
  elevated: boolean;
  disabled: boolean;
  scrolling: boolean;
}

const GOOGLE_LOGO = svg`
  <svg viewBox="0 0 24 24" slot="icon">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    <path d="M1 1h22v22H1z" fill="none" />
  </svg>
`;

const styles = css`
  md-chip-set.scrolling {
    flex-wrap: nowrap;
    max-width: 512px;
    overflow: scroll;
    /** Add room for focus ring. */
    padding: 8px;
  }
`;

const assist: MaterialStoryInit<StoryKnobs> = {
  name: 'Assist chips',
  styles,
  render({label, elevated, disabled, scrolling}) {
    const classes = {'scrolling': scrolling};
    return html`
      <md-chip-set class=${classMap(classes)} aria-label="Assist chips">
        <md-assist-chip
          label=${label || 'Assist chip'}
          ?disabled=${disabled}
          ?elevated=${elevated}></md-assist-chip>
        <md-assist-chip
          label=${label || 'Assist chip with icon'}
          ?disabled=${disabled}
          ?elevated=${elevated}>
          <md-icon slot="icon">local_laundry_service</md-icon>
        </md-assist-chip>
        <md-assist-chip
          label=${label || 'Assist link chip'}
          ?elevated=${elevated}
          href="https://google.com"
          target="_blank"
          >${GOOGLE_LOGO}</md-assist-chip
        >
        <md-assist-chip
          label=${label || 'Disabled assist chip (focusable)'}
          disabled
          always-focusable
          ?elevated=${elevated}></md-assist-chip>
      </md-chip-set>
    `;
  },
};

const filters: MaterialStoryInit<StoryKnobs> = {
  name: 'Filter chips',
  styles,
  render({label, elevated, disabled, scrolling}) {
    const classes = {'scrolling': scrolling};
    return html`
      <md-chip-set class=${classMap(classes)} aria-label="Filter chips">
        <md-filter-chip
          label=${label || 'Filter chip'}
          ?disabled=${disabled}
          ?elevated=${elevated}></md-filter-chip>
        <md-filter-chip
          label=${label || 'Filter chip with icon'}
          ?disabled=${disabled}
          ?elevated=${elevated}>
          <md-icon slot="icon">local_laundry_service</md-icon>
        </md-filter-chip>
        <md-filter-chip
          label=${label || 'Removable filter chip'}
          ?disabled=${disabled}
          ?elevated=${elevated}
          removable></md-filter-chip>
        <md-filter-chip
          label=${label || 'Disabled filter chip (focusable)'}
          disabled
          always-focusable
          ?elevated=${elevated}
          removable></md-filter-chip>
      </md-chip-set>
    `;
  },
};

const inputs: MaterialStoryInit<StoryKnobs> = {
  name: 'Input chips',
  styles,
  render({label, disabled, scrolling}) {
    const classes = {'scrolling': scrolling};
    return html`
      <md-chip-set class=${classMap(classes)} aria-label="Input chips">
        <md-input-chip
          label=${label || 'Input chip'}
          ?disabled=${disabled}></md-input-chip>
        <md-input-chip
          label=${label || 'Input chip with icon'}
          ?disabled=${disabled}>
          <md-icon slot="icon">local_laundry_service</md-icon>
        </md-input-chip>
        <md-input-chip
          label=${label || 'Input chip with avatar'}
          ?disabled=${disabled}
          avatar>
          <img
            slot="icon"
            src="https://lh3.googleusercontent.com/a/default-user=s48" />
        </md-input-chip>
        <md-input-chip
          label=${label || 'Input link chip'}
          href="https://google.com"
          target="_blank"
          >${GOOGLE_LOGO}</md-input-chip
        >
        <md-input-chip
          label=${label || 'Remove-only input chip'}
          ?disabled=${disabled}
          remove-only></md-input-chip>
        <md-input-chip
          label=${label || 'Disabled input chip (focusable)'}
          disabled
          always-focusable></md-input-chip>
      </md-chip-set>
    `;
  },
};

const suggestions: MaterialStoryInit<StoryKnobs> = {
  name: 'Suggestion chips',
  styles,
  render({label, elevated, disabled, scrolling}) {
    const classes = {'scrolling': scrolling};
    return html`
      <md-chip-set class=${classMap(classes)} aria-label="Suggestion chips">
        <md-suggestion-chip
          label=${label || 'Suggestion chip'}
          ?disabled=${disabled}
          ?elevated=${elevated}></md-suggestion-chip>
        <md-suggestion-chip
          label=${label || 'Suggestion chip with icon'}
          ?disabled=${disabled}
          ?elevated=${elevated}>
          <md-icon slot="icon">local_laundry_service</md-icon>
        </md-suggestion-chip>
        <md-suggestion-chip
          label=${label || 'Suggestion link chip'}
          ?elevated=${elevated}
          href="https://google.com"
          target="_blank"
          >${GOOGLE_LOGO}</md-suggestion-chip
        >
        <md-suggestion-chip
          label=${label || 'Disabled suggestion chip (focusable)'}
          disabled
          always-focusable
          ?elevated=${elevated}></md-suggestion-chip>
      </md-chip-set>
    `;
  },
};

/** Chips stories. */
export const stories = [assist, filters, inputs, suggestions];
