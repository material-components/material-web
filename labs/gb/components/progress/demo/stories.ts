/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/labs/gb/components/progress/md-gb-circular-progress.js';
import '@material/web/labs/gb/components/progress/md-gb-linear-progress.js';

import {type MaterialStoryInit} from './material-collection.js';
import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.cssresult.js';
import {css, html} from 'lit';

/** Knob types for progress indicator stories. */
export interface StoryKnobs {
  fourColor?: boolean;
  indeterminate?: boolean;
  progressType?: 'both' | 'circular' | 'linear';
  thick?: boolean;
  value?: number;
  wavy?: boolean;
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
  .demo-shell {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 32px;
    inline-size: 100%;
    max-inline-size: 720px;
    padding-block: 24px;
    padding-inline: 24px;
  }

  .demo-section {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .demo-section-title {
    color: var(--md-sys-color-on-surface);
    font: var(--md-sys-typescale-title-medium);
    margin: 0;
  }

  .demo-row {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
  }

  .demo-card {
    background-color: var(--md-sys-color-surface-container-low);
    border-radius: var(--md-sys-shape-corner-medium);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 12px;
    inline-size: 100%;
    padding-block: 16px;
    padding-inline: 16px;
  }

  .demo-card-label {
    color: var(--md-sys-color-on-surface-variant);
    font: var(--md-sys-typescale-label-large);
  }
`;

const playground: MaterialStoryInit<StoryKnobs> = {
  name: 'Playground',
  styles,
  render(knobs) {
    const value = knobs.value ?? 0.65;
    const wavy = Boolean(knobs.wavy);
    const thick = Boolean(knobs.thick);
    const indeterminate = Boolean(knobs.indeterminate);
    const fourColor = Boolean(knobs.fourColor);
    const type = knobs.progressType || 'both';

    return html`
      <div class="demo-shell">
        ${type === 'both' || type === 'linear'
          ? html`
              <div class="demo-card">
                <span class="demo-card-label">Linear Progress</span>
                <md-gb-linear-progress
                  .value=${value}
                  ?wavy=${wavy}
                  ?thick=${thick}
                  ?indeterminate=${indeterminate}
                  ?four-color=${fourColor}
                  aria-label="Playground linear progress"></md-gb-linear-progress>
              </div>
            `
          : ''}
        ${type === 'both' || type === 'circular'
          ? html`
              <div class="demo-card">
                <span class="demo-card-label">Circular Progress</span>
                <div class="demo-row">
                  <md-gb-circular-progress
                    .value=${value}
                    ?wavy=${wavy}
                    ?thick=${thick}
                    ?indeterminate=${indeterminate}
                    ?four-color=${fourColor}
                    aria-label="Playground circular progress"></md-gb-circular-progress>
                </div>
              </div>
            `
          : ''}
      </div>
    `;
  },
};

const linearVariants: MaterialStoryInit<StoryKnobs> = {
  name: 'Linear Progress Variants',
  styles,
  render() {
    return html`
      <div class="demo-shell">
        <div class="demo-section">
          <h3 class="demo-section-title">Standard Determinate</h3>
          <div class="demo-card">
            <span class="demo-card-label">Normal (50%)</span>
            <md-gb-linear-progress
              .value=${0.5}
              aria-label="Standard determinate normal"></md-gb-linear-progress>
          </div>
          <div class="demo-card">
            <span class="demo-card-label">Thick (75%)</span>
            <md-gb-linear-progress
              .value=${0.75}
              thick
              aria-label="Standard determinate thick"></md-gb-linear-progress>
          </div>
        </div>

        <div class="demo-section">
          <h3 class="demo-section-title">Expressive Wavy Determinate</h3>
          <div class="demo-card">
            <span class="demo-card-label">In Motion (60%)</span>
            <md-gb-linear-progress
              .value=${0.6}
              wavy
              aria-label="Wavy in motion"></md-gb-linear-progress>
          </div>
          <div class="demo-card">
            <span class="demo-card-label">Thick in Motion (80%)</span>
            <md-gb-linear-progress
              .value=${0.8}
              wavy
              thick
              aria-label="Wavy thick in motion"></md-gb-linear-progress>
          </div>
          <div class="demo-card">
            <span class="demo-card-label">Flat at 100% Completion</span>
            <md-gb-linear-progress
              .value=${1.0}
              wavy
              aria-label="Wavy completed flat"></md-gb-linear-progress>
          </div>
        </div>

        <div class="demo-section">
          <h3 class="demo-section-title">Indeterminate</h3>
          <div class="demo-card">
            <span class="demo-card-label">Standard Indeterminate</span>
            <md-gb-linear-progress
              indeterminate
              aria-label="Standard indeterminate"></md-gb-linear-progress>
          </div>
          <div class="demo-card">
            <span class="demo-card-label">Expressive Wavy Indeterminate</span>
            <md-gb-linear-progress
              wavy
              indeterminate
              aria-label="Wavy indeterminate"></md-gb-linear-progress>
          </div>
          <div class="demo-card">
            <span class="demo-card-label">Four Color Indeterminate</span>
            <md-gb-linear-progress
              four-color
              indeterminate
              aria-label="Four color indeterminate"></md-gb-linear-progress>
          </div>
        </div>
      </div>
    `;
  },
};

const circularVariants: MaterialStoryInit<StoryKnobs> = {
  name: 'Circular Progress Variants',
  styles,
  render() {
    return html`
      <div class="demo-shell">
        <div class="demo-section">
          <h3 class="demo-section-title">Standard Determinate</h3>
          <div class="demo-row">
            <div class="demo-card">
              <span class="demo-card-label">Normal (65%)</span>
              <md-gb-circular-progress
                .value=${0.65}
                aria-label="Standard circular normal"></md-gb-circular-progress>
            </div>
            <div class="demo-card">
              <span class="demo-card-label">Thick (65%)</span>
              <md-gb-circular-progress
                .value=${0.65}
                thick
                aria-label="Standard circular thick"></md-gb-circular-progress>
            </div>
          </div>
        </div>

        <div class="demo-section">
          <h3 class="demo-section-title">Expressive Wavy Determinate</h3>
          <div class="demo-row">
            <div class="demo-card">
              <span class="demo-card-label">In Motion (65%)</span>
              <md-gb-circular-progress
                .value=${0.65}
                wavy
                aria-label="Wavy circular in motion"></md-gb-circular-progress>
            </div>
            <div class="demo-card">
              <span class="demo-card-label">Thick in Motion (65%)</span>
              <md-gb-circular-progress
                .value=${0.65}
                wavy
                thick
                aria-label="Wavy circular thick"></md-gb-circular-progress>
            </div>
            <div class="demo-card">
              <span class="demo-card-label">Flat at 100% Completion</span>
              <md-gb-circular-progress
                .value=${1.0}
                wavy
                aria-label="Wavy circular flat at 100%"></md-gb-circular-progress>
            </div>
          </div>
        </div>

        <div class="demo-section">
          <h3 class="demo-section-title">Indeterminate</h3>
          <div class="demo-row">
            <div class="demo-card">
              <span class="demo-card-label">Standard Indeterminate</span>
              <md-gb-circular-progress
                indeterminate
                aria-label="Standard circular indeterminate"></md-gb-circular-progress>
            </div>
            <div class="demo-card">
              <span class="demo-card-label">Wavy Indeterminate</span>
              <md-gb-circular-progress
                wavy
                indeterminate
                aria-label="Wavy circular indeterminate"></md-gb-circular-progress>
            </div>
            <div class="demo-card">
              <span class="demo-card-label">Four Color Indeterminate</span>
              <md-gb-circular-progress
                four-color
                indeterminate
                aria-label="Four color circular indeterminate"></md-gb-circular-progress>
            </div>
          </div>
        </div>
      </div>
    `;
  },
};

/** Progress indicators story definitions. */
export const stories = [playground, linearVariants, circularVariants];
