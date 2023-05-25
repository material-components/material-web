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
  '--md-ripple-pressed-color': string;
  '--md-ripple-pressed-opacity': number;
  '--md-ripple-hover-color': string;
  '--md-ripple-hover-opacity': number;
}

const bounded: MaterialStoryInit<StoryKnobs> = {
  name: 'Bounded',
  styles: css`
    .container {
      border-radius: 16px;
      height: 64px;
      outline: 1px solid var(--md-sys-color-outline);
      position: relative;
      width: 64px;
    }
  `,
  render({disabled}) {
    const rippleRef = createRef<MdRipple>();
    return html`
      <div class="container" ${ripple(() => rippleRef.value || null)}>
        <md-ripple ?disabled=${disabled} ${ref(rippleRef)}></md-ripple>
      </div>
    `;
  }
};

const unbounded: MaterialStoryInit<StoryKnobs> = {
  name: 'Unbounded',
  styles: css`
    .container {
      align-items: center;
      border-radius: 24px;
      display: flex;
      gap: 16px;
      height: 48px;
      outline: 1px dashed var(--md-sys-color-outline);
      padding: 16px;
    }

    .icon {
      border: 1px solid var(--md-sys-color-outline);
      border-radius: 50%;
      display: grid;
      height: 24px;
      place-items: center;
      position: relative;
      width: 24px;
    }

    .anchor {
      background: var(--md-sys-color-primary-container);
    }

    md-ripple {
      border-radius: 50%;
      height: 40px;
      inset: unset;
      width: 40px;
    }
  `,
  render({disabled}) {
    const rippleRef = createRef<MdRipple>();
    return html`
      <div class="container" ${ripple(() => rippleRef.value || null)}>
        <div class="icon anchor">
          <md-ripple ?disabled=${disabled} ${ref(rippleRef)}></md-ripple>
        </div>
        <div class="icon"></div>
      </div>
    `;
  }
};

/** Ripple stories. */
export const stories = [bounded, unbounded];
