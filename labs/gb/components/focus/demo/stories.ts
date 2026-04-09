/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {MaterialStoryInit} from './material-collection.js';
import {styles as focusRingStyles} from '@material/web/labs/gb/components/focus/focus-ring.cssresult.js';
import {css, html} from 'lit';

/** Knob types for focus ring stories. */
export interface StoryKnobs {}

const styles = [
  focusRingStyles,
  css`
    button {
      position: relative;
      height: 40px;
      border-radius: 20px;
      padding-inline: 16px;
      border: 1px solid currentColor;

      &:has(.child-ring) {
        outline: none;
      }
    }

    .child-ring {
      position: absolute;
      inset: -1px;
      border-radius: inherit;
    }

    .parent-ring {
      display: inline-block;
      border-radius: 20px;
      isolation: isolate;
      button {
        outline: none;
        z-index: -1;
      }
    }
  `,
];

const focusable: MaterialStoryInit<StoryKnobs> = {
  name: 'Focusable',
  styles,
  render() {
    return html`
      <button class="focus-ring-outer">Outer</button>
      <button class="focus-ring-inner">Inner</button>
    `;
  },
};

const focusableParent: MaterialStoryInit<StoryKnobs> = {
  name: 'Focusable parent',
  styles,
  render() {
    return html`
      <button class="focus-ring-target">
        Outer
        <span class="focus-ring-outer child-ring"></span>
      </button>
      <button class="focus-ring-target">
        Inner
        <span class="focus-ring-inner child-ring"></span>
      </button>
    `;
  },
};

const focusableChild: MaterialStoryInit<StoryKnobs> = {
  name: 'Focusable child',
  styles,
  render() {
    return html`
      <div class="focus-ring-outer parent-ring">
        <button class="focus-ring-target">Outer</button>
      </div>
      <div class="focus-ring-inner parent-ring">
        <button class="focus-ring-target">Inner</button>
      </div>
    `;
  },
};

const forcedStates: MaterialStoryInit<StoryKnobs> = {
  name: 'Forced states',
  styles,
  render() {
    return html`
      <button class="focus-ring-outer focus-visible">Outer</button>
      <button class="focus-ring-inner focus-visible">Inner</button>
    `;
  },
};

/** Focus ring stories. */
export const stories = [
  focusable,
  focusableParent,
  focusableChild,
  forcedStates,
];
