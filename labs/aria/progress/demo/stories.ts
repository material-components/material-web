/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/labs/aria/progress/md-aria-progress.js';

import {MaterialStoryInit} from './material-collection.js';
import {css, html, nothing} from 'lit';

/** Knob types for ARIA Progress stories. */
export interface StoryKnobs {
  indeterminate?: boolean;
  value?: number;
  max?: number;
}

const progress: MaterialStoryInit<StoryKnobs> = {
  name: 'progress',
  render(knobs) {
    return html`
      <md-aria-progress
        value=${knobs.indeterminate ? nothing : (knobs.value ?? nothing)}
        max=${knobs.indeterminate
          ? nothing
          : (knobs.max ?? nothing)}></md-aria-progress>
    `;
  },
};

const progressCustom: MaterialStoryInit<StoryKnobs> = {
  name: 'custom progress',
  styles: css`
    /* |@property| would be nice here... */
    @keyframes --linear-time {
      0% {
        --time: 0;
      }
      10% {
        --time: 0.1;
      }
      20% {
        --time: 0.2;
      }
      30% {
        --time: 0.3;
      }
      40% {
        --time: 0.4;
      }
      50% {
        --time: 0.5;
      }
      60% {
        --time: 0.6;
      }
      70% {
        --time: 0.7;
      }
      80% {
        --time: 0.8;
      }
      90% {
        --time: 0.9;
      }
      100% {
        --time: 1;
      }
    }

    #track,
    #bar {
      --track-border-width: 1px;
      position: absolute;
      inset: 0px;
      border-radius: 10000px;
      --bg: peachpuff;
      --fg: coral;
      background-color: var(--bg);

      @media (forced-colors: active) {
        --fg: CanvasText;
      }
    }

    #track {
      border: var(--track-border-width) solid var(--fg);
    }

    #bar {
      --bar-inset: calc(var(--track-border-width) + 1px);
      inset: var(--bar-inset);
      background-color: var(--fg);

      md-aria-progress:state(indeterminate) & {
        forced-color-adjust: none;
        background-color: transparent;
        background-image: repeating-linear-gradient(
          to right,
          transparent 0px,
          transparent clamp(0px, calc(-5px + 10px * var(--time)), 10px),
          var(--fg) clamp(0px, calc(-5px + 10px * var(--time)), 10px),
          var(--fg) clamp(0px, calc(0px + 10px * var(--time)), 10px),
          transparent clamp(0px, calc(0px + 10px * var(--time)), 10px),
          transparent clamp(0px, calc(5px + 10px * var(--time)), 10px),
          var(--fg) clamp(0px, calc(5px + 10px * var(--time)), 10px),
          var(--fg) 10px
        );
        animation: --linear-time 1s infinite linear;
      }

      md-aria-progress:not(:state(indeterminate)) & {
        width: calc(
          100% * var(--md-aria-progress-position) - 2 * var(--bar-inset)
        );
      }
    }
  `,
  render(knobs) {
    return html`
      <md-aria-progress
        value=${knobs.indeterminate ? nothing : (knobs.value ?? nothing)}
        max=${knobs.indeterminate ? nothing : (knobs.max ?? nothing)}>
        <div id="track"></div>
        <div id="bar"></div>
      </md-aria-progress>
    `;
  },
};

/** ARIA Progress stories. */
export const stories = [progress, progressCustom];
