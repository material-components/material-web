/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/ripple/ripple.js';

import {MaterialStoryInit} from './material-collection.js';
import {ripple} from '@material/web/ripple/directive.js';
import {MdRipple} from '@material/web/ripple/ripple.js';
import {css, html} from 'lit';
import {createRef, ref} from 'lit/directives/ref.js';

/** Knob types for ripple stories. */
export interface StoryKnobs {
  disabled: boolean;
  unbounded: boolean;
  '--md-ripple-pressed-color': string;
  '--md-ripple-pressed-opacity': number;
  '--md-ripple-hover-color': string;
  '--md-ripple-hover-opacity': number;
}

const standard: MaterialStoryInit<StoryKnobs> = {
  name: 'Ripple',
  styles: css`
    .root {
      border: 2px solid black;
      box-sizing: border-box;
      height: 100px;
      width: 100px;
      position: relative;
    }
  `,
  render({disabled, unbounded}) {
    const rippleRef = createRef<MdRipple>();
    return html`
      <div class="root" ${ripple(() => rippleRef.value || null)}>
        <md-ripple
          ?disabled=${disabled}
          ?unbounded=${unbounded}
          ${ref(rippleRef)}></md-ripple>
      </div>
    `;
  }
};

/** Ripple stories. */
export const stories = [standard];
