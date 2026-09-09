/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/labs/gb/components/chip/md-gb-chip.js';
import '@material/web/labs/gb/styles/icon/md-gb-icon.js';

import {MaterialStoryInit} from './material-collection.js';
import {
  type ChipColor,
  type ChipType,
} from '@material/web/labs/gb/components/chip/chip.js';
import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.cssresult.js';
import {css, html} from 'lit';

/** Knob types for chip stories. */
export interface StoryKnobs {
  color?: ChipColor;
  type?: ChipType;
  selected?: boolean;
  removable?: boolean;
  disabled?: boolean;
  softDisabled?: boolean;
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
  :host,
  .demo-group {
    font-family: var(
      --md-sys-typescale-body-md-font,
      var(--md-ref-typeface-plain, Roboto, sans-serif)
    );
  }
  .demo-group {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 24px;
    padding: 16px;
    border: 1px solid var(--md-sys-color-outline-variant);
    border-radius: 16px;
    background-color: var(--md-sys-color-surface);
  }
  .chip-avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
  }
`;

const playground: MaterialStoryInit<StoryKnobs> = {
  name: 'Playground',
  styles,
  render(knobs) {
    return html`
      <div class="demo-group">
        <md-gb-chip
          color=${knobs.color || 'elevated'}
          type=${knobs.type || 'action'}
          ?selected=${knobs.selected ?? false}
          ?removable=${knobs.removable ?? false}
          ?disabled=${knobs.disabled ?? false}
          ?soft-disabled=${knobs.softDisabled ?? false}>
          <md-gb-icon slot="icon">star</md-gb-icon>
          Expressive Chip
        </md-gb-chip>
      </div>
    `;
  },
};

const variants: MaterialStoryInit<StoryKnobs> = {
  name: 'Expressive Action Variants',
  styles,
  render() {
    return html`
      <div class="demo-group">
        <md-gb-chip color="elevated">
          <md-gb-icon slot="icon">schedule</md-gb-icon>
          Elevated Action
        </md-gb-chip>
        <md-gb-chip color="filled">
          <md-gb-icon slot="icon">flight</md-gb-icon>
          Filled Action
        </md-gb-chip>
        <md-gb-chip color="tonal">
          <md-gb-icon slot="icon">event</md-gb-icon>
          Tonal Action
        </md-gb-chip>
        <md-gb-chip color="outlined">
          <md-gb-icon slot="icon">bookmark</md-gb-icon>
          Outlined Action
        </md-gb-chip>
      </div>
    `;
  },
};

const functional: MaterialStoryInit<StoryKnobs> = {
  name: 'Filter & Removable Chip',
  styles,
  render() {
    return html`
      <div class="demo-group">
        <md-gb-chip type="filter" color="elevated"
          >Unselected Filter</md-gb-chip
        >
        <md-gb-chip type="filter" color="elevated" selected
          >Selected Filter</md-gb-chip
        >
        <md-gb-chip removable color="tonal">Removable Tag</md-gb-chip>
        <md-gb-chip removable color="outlined" disabled
          >Disabled Tag</md-gb-chip
        >
      </div>
    `;
  },
};

const avatarsAndIcons: MaterialStoryInit<StoryKnobs> = {
  name: 'Avatars & Leading Icons',
  styles,
  render() {
    return html`
      <div class="demo-group">
        <md-gb-chip color="elevated">
          <span slot="icon" class="chip-avatar">A</span>
          Avatar Chip
        </md-gb-chip>
        <md-gb-chip color="tonal" removable>
          <span slot="icon" class="chip-avatar">B</span>
          Removable Avatar
        </md-gb-chip>
        <md-gb-chip color="outlined">
          <md-gb-icon slot="icon">face</md-gb-icon>
          Leading Icon Chip
        </md-gb-chip>
      </div>
    `;
  },
};

/** Chip stories. */
export const stories = [playground, variants, functional, avatarsAndIcons];
