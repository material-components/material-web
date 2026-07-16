/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {MaterialStoryInit} from './material-collection.js';
import {ripple} from '@material/web/labs/gb/components/ripple/ripple.js';
import {styles as rippleStyles} from '@material/web/labs/gb/components/ripple/ripple.cssresult.js';
import {css, html} from 'lit';

/** Knob types for ripple stories. */
export interface StoryKnobs {}

const styles = [
  rippleStyles,
  css`
    button {
      position: relative;
      height: 40px;
      border-radius: 20px;
      padding-inline: 16px;
      background-color: transparent;
      border: 1px solid currentColor;
    }

    .child-ripple {
      position: absolute;
      inset: -1px;
      border-radius: inherit;
    }

    .parent-ripple {
      display: inline-block;
      border-radius: 20px;
      isolation: isolate;
      button {
        z-index: -1;
      }
    }
  `,
];

const element: MaterialStoryInit<StoryKnobs> = {
  name: 'Element',
  styles,
  render() {
    return html`
      <button class="ripple" ${ripple()}>Ripple</button>
      <button class="ripple" ${ripple()} disabled>Disabled</button>
    `;
  },
};

const focusableParent: MaterialStoryInit<StoryKnobs> = {
  name: 'Focusable parent',
  styles,
  render() {
    return html`
      <button class="ripple-target" ${ripple()}>
        Ripple
        <span class="ripple child-ripple"></span>
      </button>
    `;
  },
};

const focusableChild: MaterialStoryInit<StoryKnobs> = {
  name: 'Focusable child',
  styles,
  render() {
    return html`
      <div class="ripple parent-ripple" ${ripple()}>
        <button class="ripple-target">Ripple</button>
      </div>
    `;
  },
};

const forcedStates: MaterialStoryInit<StoryKnobs> = {
  name: 'Forced states',
  styles,
  render() {
    return html`
      <button class="ripple hover">Hover</button>
      <button class="ripple active">Press</button>
    `;
  },
};

/** Ripple stories. */
export const stories = [element, focusableParent, focusableChild, forcedStates];
