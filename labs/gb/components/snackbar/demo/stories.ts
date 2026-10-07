/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/labs/gb/components/button/md-gb-button.js';
import '@material/web/labs/gb/components/snackbar/md-gb-snackbar.js';

import {type MaterialStoryInit} from './material-collection.js';
import {type SnackbarElement} from '@material/web/labs/gb/components/snackbar/snackbar-element.js';
import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
import {css, html, nothing, type TemplateResult} from 'lit';
import {createRef, ref} from 'lit/directives/ref.js';

import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.css' with {type: 'css'}; // github-only
// import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.cssresult.js'; // google3-only

/** Knob types for snackbar stories. */
export interface StoryKnobs {
  timeoutMs: string;
  message: string;
  action: string;
  hasCloseButton: boolean;
}

adoptStyles(document, [m3Styles]);

const styles = css`
  .demo-container {
    display: flex;
    flex-direction: column;
    gap: 32px;
    padding: 24px;
    box-sizing: border-box;
  }

  .demo-section {
    display: flex;
    flex-direction: column;
    gap: 16px;

    h2 {
      font: var(--md-sys-typescale-headline-sm);
      letter-spacing: var(--md-sys-typescale-headline-sm-tracking);
      margin: 0;
      color: var(--md-sys-color-on-surface);
    }
  }

  .static-grid {
    display: grid;
    grid-template-columns: repeat(2, max-content);
    gap: 24px;
  }

  /*
   * Each cell is a container the snackbar anchors to: it sits --bottom-offset
   * (16px) above the cell's bottom edge and, below the 600px breakpoint, 16px
   * in from each side. The fixed height fits the tallest example (a wrapped
   * action row) with clear space above, and lines up every snackbar's bottom
   * edge across the grid.
   */
  .cell-stage {
    width: 376px;
    block-size: 176px;
    outline: 1px dashed var(--md-sys-color-outline-variant);
    border: none;
    border-radius: 8px;
    background-color: var(--md-sys-color-surface-container-low);
    box-sizing: border-box;
    position: relative;
  }

  .interactive-stage {
    resize: horizontal;
    overflow: hidden;
    position: relative;
    width: 100%;
    min-width: 360px;
    min-height: 240px;
    border: 2px dashed var(--md-sys-color-outline-variant);
    border-radius: 16px;
    background-color: var(--md-sys-color-surface-container-low);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: 24px;
  }

  .demo-controls {
    display: flex;
    gap: 12px;
    margin-block-end: 16px;
  }

  .demo-hint {
    font: var(--md-sys-typescale-body-md);
    letter-spacing: var(--md-sys-typescale-body-md-tracking);
    color: var(--md-sys-color-on-surface-variant);
    text-align: center;
    margin: 0;
  }
`;

interface StaticExample {
  /**
   * A string is passed as `label-text`; a template is slotted, so two-line
   * labels can break where Figma breaks them.
   */
  label: string | TemplateResult;
  action?: string;
  close?: boolean;
}

// Figma 44:43717 "Examples", row-major: without close on the left, with close
// on the right.
const staticExamples: StaticExample[] = [
  {label: 'Single-line snackbar'},
  {label: 'Single-line snackbar with close affordance', close: true},
  {label: 'Single-line snackbar with action', action: 'Action'},
  {label: 'Single-line snackbar with action', action: 'Action', close: true},
  {label: html`Two-line snackbar<br />without action`},
  {label: html`Two-line snackbar with<br />close affordance`, close: true},
  {label: html`Two-line snackbar<br />with action`, action: 'Action'},
  {
    label: html`Two-line snackbar with longer<br />action and close affordance`,
    action: 'Action',
    close: true,
  },
  {
    label: html`Two-line snackbar with<br />longer action`,
    action: 'Longer Action',
  },
  {
    label: html`Two-line snackbar with longer<br />action and close affordance`,
    action: 'Longer Action',
    close: true,
  },
];

const playground: MaterialStoryInit<StoryKnobs> = {
  name: 'Playground',
  styles,
  render(knobs) {
    const snackbarRef = createRef<SnackbarElement>();

    return html`
      <div class="demo-container">
        <section class="demo-section">
          <h2>Interactive</h2>
          <div class="demo-controls">
            <md-gb-button
              color="filled"
              @click=${() => snackbarRef.value?.show()}>
              Show Snackbar
            </md-gb-button>
            <md-gb-button
              color="outlined"
              @click=${() => snackbarRef.value?.close()}>
              Close Snackbar
            </md-gb-button>
          </div>
          <div class="interactive-stage">
            <p class="demo-hint">
              Drag the corner to resize: below a 600px container width the
              snackbar uses the compact layout. Use Show/Close to replay it.
            </p>
            <md-gb-snackbar
              ${ref(snackbarRef)}
              open
              .labelText=${knobs.message}
              .timeoutMs=${Number(knobs.timeoutMs)}
              .actionLabel=${knobs.action}
              ?has-close-button=${knobs.hasCloseButton}>
            </md-gb-snackbar>
          </div>
        </section>

        <section class="demo-section">
          <h2>Static examples</h2>
          <div class="static-grid">
            ${staticExamples.map(
              ({label, action = '', close = false}) => html`
                <div class="cell-stage">
                  <md-gb-snackbar
                    open
                    timeout-ms="-1"
                    ?has-close-button=${close}
                    label-text=${typeof label === 'string' ? label : ''}
                    action-label=${action}
                    @close=${(e: Event) => {
                      e.preventDefault();
                    }}
                    >${typeof label === 'string'
                      ? nothing
                      : label}</md-gb-snackbar
                  >
                </div>
              `,
            )}
          </div>
        </section>
      </div>
    `;
  },
};

/** Snackbar demo stories. */
export const stories = [playground];
