/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/slider/slider.js';

import {MaterialStoryInit} from './material-collection.js';
import {MdSlider} from '@material/web/slider/slider.js';
import {css, html} from 'lit';

/** Knob types for slider stories. */
export interface StoryKnobs {
  value: number;
  valueStart: number;
  valueEnd: number;
  min: number;
  max: number;
  step: number;
  range: boolean;
  tickmarks: boolean;
  labeled: boolean;
  disabled: boolean;
}

const styles = css`
  label {
    font-family: Roboto, 'Google Sans', system-ui;
    color: var(--mdc-typography-headline-color);
  }
`;

const standard: MaterialStoryInit<StoryKnobs> = {
  name: '<md-slider>',
  styles,
  render(knobs) {
    return html`
      <label>label
        <md-slider
            .value=${knobs.value}
            .valueStart=${knobs.valueStart}
            .valueEnd=${knobs.valueEnd}
            .min=${knobs.min}
            .max=${knobs.max}
            .step=${knobs.step ?? 1}
            .range=${knobs.range}
            .tickmarks=${knobs.tickmarks}
            .labeled=${knobs.labeled ?? false}
            .disabled=${knobs.disabled ?? false}
        ></md-slider>
      </label>`;
  }
};

const multiValue: MaterialStoryInit<StoryKnobs> = {
  name: 'multi-value',
  styles,
  render(knobs) {
    return html`
      <label>label
        <md-slider
          range
          .valueStart=${(knobs.valueStart)}
          .valueEnd=${(knobs.valueEnd)}
          .min=${knobs.min}
          .max=${knobs.max}
          .step=${knobs.step ?? 1}
          .tickmarks=${knobs.tickmarks}
          .labeled=${knobs.labeled ?? true}
          .disabled=${knobs.disabled ?? false}
        ></md-slider>
      </label>`;
  }
};

const customStyling: MaterialStoryInit<StoryKnobs> = {
  name: 'custom styling',
  styles: [
    styles,
    css`
    md-slider {
      --myColor: hsl(180, 15%, 25%);
      --myInactiveColor: hsl(180, 15%, 75%);

      /* handle */
      --md-slider-handle-shape: 4px;
      --md-slider-handle-height: 12px;
      --md-slider-handle-width: 20px;
      --md-slider-handle-color: var(--myColor);
      --md-slider-focus-handle-color: yellow;
      --md-slider-hover-handle-color: green;
      --md-slider-pressed-handle-color: pink;

      /* label */
      --md-slider-label-container-height: 24px;
      --md-slider-label-container-color: var(--myColor);
      --md-slider-label-label-text-size: 20px;

      /* track */
      --md-slider-active-track-shape: 4px;
      --md-slider-inactive-track-shape: 4px;

      --md-slider-active-track-height: 16px;
      --md-slider-inactive-track-height: 16px;

      --md-slider-active-track-color: var(--myInactiveColor);
      --md-slider-inactive-track-color: var(--myInactiveColor);

      /* state layer */
      --md-slider-state-layer-color: var(--myColor);
      --md-slider-hover-state-layer-color: var(--myColor);
      --md-slider-pressed-state-layer-color: var(--myColor);
    }`,
  ],
  render(knobs) {
    const labels = ['🤬', '😡', '😔', '😐', '😌', '😁', '🤪'];
    function labelFor(value: number) {
      return labels[Math.round(value * (labels.length - 1))];
    }
    function updateLabel(event: Event) {
      const target = event.target as MdSlider;
      const {min, max, valueStart, valueEnd} = target;
      const range = max - min;
      const fractionStart = valueStart! / range;
      const fractionEnd = valueEnd! / range;
      target.valueStartLabel = labelFor(fractionStart);
      target.valueEndLabel = labelFor(fractionEnd);
    }
    return html`
      <label>label
        <md-slider
          range
          .valueStart=${(knobs.valueStart)}
          .valueEnd=${(knobs.valueEnd)}
          .valueStartLabel=${'😔'}
          .valueEndLabel=${'😌'}
          tickmarks
          labeled
          .min=${knobs.min}
          .max=${knobs.max ?? 30}
          .step=${knobs.step ?? 1}
          .disabled=${knobs.disabled ?? false}
          @pointerdown=${updateLabel}
          @input=${updateLabel}
        ></md-slider>
      </label>`;
  }
};

/** slider stories. */
export const stories = [standard, multiValue, customStyling];
