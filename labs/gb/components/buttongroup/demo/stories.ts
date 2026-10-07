/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/labs/gb/components/button/md-gb-button.js';
import '@material/web/labs/gb/components/buttongroup/md-gb-button-group.js';
import '@material/web/labs/gb/styles/icon/md-gb-icon.js';

import {MaterialStoryInit} from './material-collection.js';
import {
  type ButtonColor,
  type ButtonSize,
} from '@material/web/labs/gb/components/button/button.js';
import {
  type ButtonGroupSelection,
  type ButtonGroupVariant,
} from '@material/web/labs/gb/components/buttongroup/button-group.js';
import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.cssresult.js';
import {css, html, nothing} from 'lit';

/** Knob types for button group stories. */
export interface StoryKnobs {
  variant?: ButtonGroupVariant;
  size?: ButtonSize;
  color?: ButtonColor;
  square?: boolean;
  selection?: ButtonGroupSelection;
  disabled?: boolean;
  icon?: string;
  showIcon1?: boolean;
  showIcon2?: boolean;
  showIcon3?: boolean;
  showIcon4?: boolean;
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
  css`
    .story-column {
      display: flex;
      flex-direction: column;
      gap: 24px;
      align-items: flex-start;
      text-align: left;
    }
    .story-row {
      display: flex;
      flex-direction: row;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
    }
  `,
];

const playground: MaterialStoryInit<StoryKnobs> = {
  name: 'Playground',
  styles,
  render(knobs) {
    const renderIcon = (show?: boolean) =>
      show && knobs.icon
        ? html`<md-gb-icon>${knobs.icon}</md-gb-icon>`
        : nothing;

    const size = knobs.size ?? 'sm';
    const color = knobs.color ?? 'tonal';
    const square = knobs.square ?? false;

    return html`
      <div class="story-column">
        <md-gb-button-group
          aria-label="Playground button group"
          variant=${knobs.variant ?? 'standard'}
          selection=${knobs.selection ?? 'none'}
          ?disabled=${knobs.disabled ?? false}>
          <md-gb-button
            value="btn1"
            size=${size}
            color=${color}
            ?square=${square}>
            ${renderIcon(knobs.showIcon1)}Option 1
          </md-gb-button>
          <md-gb-button
            value="btn2"
            size=${size}
            color=${color}
            ?square=${square}>
            ${renderIcon(knobs.showIcon2)}Option 2
          </md-gb-button>
          <md-gb-button
            value="btn3"
            size=${size}
            color=${color}
            ?square=${square}>
            ${renderIcon(knobs.showIcon3)}Option 3
          </md-gb-button>
          <md-gb-button
            value="btn4"
            size=${size}
            color=${color}
            ?square=${square}>
            ${renderIcon(knobs.showIcon4)}Option 4
          </md-gb-button>
        </md-gb-button-group>
      </div>
    `;
  },
};

const icons: MaterialStoryInit<StoryKnobs> = {
  name: 'Icons',
  styles,
  render(knobs) {
    const disabled = Boolean(knobs.disabled);

    return html`
      <div class="story-column">
        <h3>Icon-only</h3>
        <md-gb-button-group
          aria-label="Text alignment buttons"
          variant="connected"
          selection="single"
          ?disabled=${disabled}>
          <md-gb-button value="left" aria-label="Align left" size="sm" selected>
            <md-gb-icon>format_align_left</md-gb-icon>
          </md-gb-button>
          <md-gb-button value="center" aria-label="Align center" size="sm">
            <md-gb-icon>format_align_center</md-gb-icon>
          </md-gb-button>
          <md-gb-button value="right" aria-label="Align right" size="sm">
            <md-gb-icon>format_align_right</md-gb-icon>
          </md-gb-button>
        </md-gb-button-group>

        <h3>Icon and label</h3>
        <md-gb-button-group
          aria-label="Media controls"
          variant="connected"
          selection="single"
          ?disabled=${disabled}>
          <md-gb-button value="play" size="sm">
            <md-gb-icon>play_arrow</md-gb-icon>
            Play
          </md-gb-button>
          <md-gb-button value="pause" size="sm">
            <md-gb-icon>pause</md-gb-icon>
            Pause
          </md-gb-button>
          <md-gb-button value="stop" size="sm">
            <md-gb-icon>stop</md-gb-icon>
            Stop
          </md-gb-button>
        </md-gb-button-group>

        <h3>Mixed set</h3>
        <md-gb-button-group
          aria-label="Mixed icon and text actions"
          variant="connected"
          ?disabled=${disabled}>
          <md-gb-button value="starred" size="sm">
            <md-gb-icon>star</md-gb-icon>
            Starred
          </md-gb-button>
          <md-gb-button value="all" size="sm">All</md-gb-button>
          <md-gb-button value="archive" size="sm">
            <md-gb-icon>archive</md-gb-icon>
            Archive
          </md-gb-button>
        </md-gb-button-group>
      </div>
    `;
  },
};

/** Button Group stories. */
export const stories = [playground, icons];
