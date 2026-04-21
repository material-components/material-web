/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/icon/icon.js';
import '@material/web/labs/gb/components/switch/md-switch.js';

import {MaterialStoryInit} from './material-collection.js';
import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
import m3Styles from '@material/web/labs/gb/styles/m3.cssresult.js';
import {css, html, nothing} from 'lit';

/** Knob types for switch stories. */
export interface StoryKnobs {
  selected: boolean;
  disabled: boolean;
  onIcon: string;
  offIcon: string;
}

adoptStyles(document, [
  m3Styles,
  css`
    :root {
      --md-icon-font: 'Material Symbols Outlined';
    }
  `,
]);

const playground: MaterialStoryInit<StoryKnobs> = {
  name: 'Playground',
  render(knobs) {
    return html`
      <md-switch .selected=${knobs.selected} ?disabled=${knobs.disabled}>
        ${knobs.offIcon
          ? html`<md-icon slot="off-icon">${knobs.offIcon}</md-icon>`
          : nothing}
        ${knobs.onIcon
          ? html`<md-icon slot="on-icon">${knobs.onIcon}</md-icon>`
          : nothing}
      </md-switch>
    `;
  },
};

const withIcons: MaterialStoryInit<StoryKnobs> = {
  name: 'With icons',
  styles: css`
    md-switch.css-icons::part(switch) {
      --icon: 'close';
    }
    md-switch.css-icons:state(selected)::part(switch) {
      --icon: 'check';
    }
  `,
  render(knobs) {
    return html`
      <md-switch
        class="css-icons"
        .selected=${knobs.selected}
        ?disabled=${knobs.disabled}>
      </md-switch>
    `;
  },
};

/** Switch stories. */
export const stories = [playground, withIcons];
