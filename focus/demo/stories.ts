/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/focus/md-focus-ring.js';

import {MaterialStoryInit} from './material-collection.js';
import {css, html} from 'lit';

/** Knob types for focus ring stories. */
export interface StoryKnobs {
  inward: boolean;
}

const standard: MaterialStoryInit<StoryKnobs> = {
  name: 'Focus ring',
  styles: css`
    button {
      appearance: none;
      background: var(--md-sys-color-surface);
      border: none;
      border-radius: 16px;
      --md-focus-ring-shape: 16px;
      height: 64px;
      outline: none;
      position: relative;
      margin: 8px;
      vertical-align: top;
      width: 64px;
    }

    button::before {
      border: 1px solid var(--md-sys-color-outline);
      border-radius: inherit;
      content: '';
      inset: 0;
      position: absolute;
    }

    button:focus {
      background: var(--md-sys-color-surface-variant);
    }
  `,
  render({inward}) {
    return html`
      <button aria-label="A button with a focus ring">
        <md-focus-ring ?inward=${inward}></md-focus-ring>
      </button>
      <button aria-label="A button with a focus ring">
        <md-focus-ring ?inward=${inward}></md-focus-ring>
      </button>
      <button aria-label="A button with a focus ring">
        <md-focus-ring ?inward=${inward}></md-focus-ring>
      </button>
    `;
  },
};

const multiAction: MaterialStoryInit<StoryKnobs> = {
  name: 'Multi-action components',
  styles: css`
    [role='list'] {
      align-items: center;
      appearance: none;
      background: var(--md-sys-color-surface);
      border-radius: 16px;
      --md-focus-ring-shape: 16px;
      display: flex;
      gap: 8px;
      height: 64px;
      justify-content: stretch;
      margin: 0;
      padding: 0 16px;
      position: relative;
    }

    [role='list']:focus-within {
      background: var(--md-sys-color-surface-variant);
    }

    [role='listitem'] {
      display: flex;
      flex: 1;
    }

    button {
      appearance: none;
      background: none;
      border: none;
      outline: none;
      position: relative;
      vertical-align: top;
    }

    #primary {
      flex: 1;
    }

    #secondary {
      height: 32px;
      width: 32px;
      border-radius: 32px;
      --md-focus-ring-shape: 32px;
    }

    [role='list']::before,
    #secondary::before {
      border: 1px solid var(--md-sys-color-outline);
      border-radius: inherit;
      content: '';
      inset: 0;
      position: absolute;
    }
  `,
  render({inward}) {
    return html`
      <div role="list">
        <md-focus-ring for="primary" ?inward=${inward}></md-focus-ring>

        <div role="listitem">
          <button
            id="primary"
            aria-label="The primary action for a multi-action component">
            Action
          </button>
        </div>

        <div role="listitem">
          <button
            id="secondary"
            aria-label="The secondary action for a multi-action component">
            X
            <md-focus-ring ?inward=${inward}></md-focus-ring>
          </button>
        </div>
      </div>
    `;
  },
};

/** Focus ring stories. */
export const stories = [standard, multiAction];
