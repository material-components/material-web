/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/slider/slider.js';

import {
  labelStyles,
  MaterialStoryInit,
} from './material-collection.js';
import {MdSlider} from '@material/web/slider/slider.js';
import {css, html} from 'lit';

/** Knob types for slider stories. */
export interface StoryKnobs {
  disabled: boolean;
}

const sharedStyles = css`
  label {
    display: flex;
    flex-direction: column;
    gap: 0;
    place-items: flex-start;
  }
`;

const single: MaterialStoryInit<StoryKnobs> = {
  name: 'Single point sliders',
  styles: [labelStyles, sharedStyles],
  render({disabled}) {
    return html`
      <label>
        Continuous
        <md-slider
          ?disabled=${disabled ?? false}
          aria-label="An example continuous slider"></md-slider>
      </label>

      <label>
        Labeled
        <md-slider
          labeled
          ?disabled=${disabled ?? false}
          aria-label="An example slider with a label"></md-slider>
      </label>

      <label>
        Tick marks
        <md-slider
          labeled
          step="10"
          ticks
          ?disabled=${disabled ?? false}
          aria-label="An example slider with tick marks"></md-slider>
      </label>
    `;
  },
};

const range: MaterialStoryInit<StoryKnobs> = {
  name: 'Range sliders',
  styles: [labelStyles, sharedStyles],
  render({disabled}) {
    return html`
      <label>
        Range
        <md-slider
          range
          ?disabled=${disabled ?? false}
          aria-label="An example range slider"></md-slider>
      </label>

      <label>
        Labeled
        <md-slider
          labeled
          range
          ?disabled=${disabled ?? false}
          aria-label="An example range slider with labels"></md-slider>
      </label>

      <label>
        Tick marks
        <md-slider
          labeled
          range
          step="10"
          ticks
          ?disabled=${disabled ?? false}
          value-start="30"
          value-end="70"
          aria-label="An example range slider with tick marks"></md-slider>
      </label>
    `;
  },
};

const customStyling: MaterialStoryInit<StoryKnobs> = {
  name: 'Custom styling',
  styles: [
    labelStyles,
    sharedStyles,
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
        --md-slider-label-text-size: 20px;

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
      }
    `,
  ],
  render({disabled}) {
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
      target.valueLabelStart = labelFor(fractionStart);
      target.valueLabelEnd = labelFor(fractionEnd);
    }
    return html`
      <label>
        Custom styles
        <md-slider
          aria-label="An example slider with custom styles"
          range
          value-start="2"
          value-end="5"
          value-label-start="😔"
          value-label-end="😌"
          ticks
          labeled
          min="0"
          max="7"
          step="1"
          .disabled=${disabled ?? false}
          @pointerdown=${updateLabel}
          @input=${updateLabel}></md-slider>
      </label>
    `;
  },
};

/** slider stories. */
export const stories = [single, range, customStyling];
