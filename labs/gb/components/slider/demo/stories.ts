/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/labs/gb/components/slider/md-gb-slider.js';

import {
  labelStyles,
  MaterialStoryInit,
} from './material-collection.js';
import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
import {css, html} from 'lit';

import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.css' with {type: 'css'}; // github-only
import {SliderSize} from '@material/web/labs/gb/components/slider/slider.js';
import {SliderElement} from '@material/web/labs/gb/components/slider/slider-element.js';
// import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.cssresult.js'; // google3-only

/** Knob types for slider stories. */
export interface StoryKnobs {
  disabled: boolean;
  size?: SliderSize;
}

adoptStyles(document, [
  m3Styles,
  css`
    :root {
      --md-icon-font: 'Material Symbols Outlined';
    }
    .story-wrapper {
      display: flex;
      flex-direction: column;
      gap: 24px;
      padding: 48px 24px;
      min-width: 320px;
      max-width: 600px;
    }
    label {
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-family: Roboto, sans-serif;
      font-size: 14px;
      color: var(--md-sys-color-on-surface);
    }
    md-gb-slider {
      width: 100%;
    }
  `,
]);

const single: MaterialStoryInit<StoryKnobs> = {
  name: 'Single point sliders',
  styles: [labelStyles],
  render({disabled, size}) {
    return html`
      <div class="story-wrapper">
        <label>
          Continuous
          <md-gb-slider
            ?disabled=${disabled ?? false}
            .size=${size}
            aria-label="An example continuous slider"></md-gb-slider>
        </label>
        <label>
          Labeled
          <md-gb-slider
            labeled
            ?disabled=${disabled ?? false}
            .size=${size}
            aria-label="An example slider with a label"></md-gb-slider>
        </label>
        <label>
          Tick marks
          <md-gb-slider
            labeled
            step="10"
            ticks
            ?disabled=${disabled ?? false}
            .size=${size}
            aria-label="An example slider with tick marks"></md-gb-slider>
        </label>
      </div>
    `;
  },
};

const range: MaterialStoryInit<StoryKnobs> = {
  name: 'Range sliders',
  styles: [labelStyles],
  render({disabled, size}) {
    return html`
      <div class="story-wrapper">
        <label>
          Range
          <md-gb-slider
            range
            ?disabled=${disabled ?? false}
            .size=${size}
            aria-label="An example range slider"></md-gb-slider>
        </label>
        <label>
          Labeled
          <md-gb-slider
            labeled
            range
            ?disabled=${disabled ?? false}
            .size=${size}
            aria-label="An example range slider with labels"></md-gb-slider>
        </label>
        <label>
          Tick marks
          <md-gb-slider
            labeled
            range
            step="10"
            ticks
            ?disabled=${disabled ?? false}
            .size=${size}
            value-start="30"
            value-end="70"
            aria-label="An example range slider with tick marks"></md-gb-slider>
        </label>
      </div>
    `;
  },
};

const centered: MaterialStoryInit<StoryKnobs> = {
  name: 'Centered sliders',
  styles: [labelStyles],
  render({disabled, size}) {
    return html`
      <div class="story-wrapper">
        <label>
          Centered (-50 to 50, value 0)
          <md-gb-slider
            min="-50"
            max="50"
            value="0"
            labeled
            ticks
            step="10"
            ?disabled=${disabled ?? false}
            .size=${size}
            aria-label="An example centered slider"></md-gb-slider>
        </label>
      </div>
    `;
  },
};

const disabledStory: MaterialStoryInit<StoryKnobs> = {
  name: 'Disabled sliders',
  styles: [labelStyles],
  render({size}) {
    return html`
      <div class="story-wrapper">
        <label>
          Disabled single point
          <md-gb-slider
            disabled
            value="30"
            .size=${size}
            aria-label="Disabled single point slider"></md-gb-slider>
        </label>
        <label>
          Disabled range
          <md-gb-slider
            disabled
            range
            value-start="20"
            value-end="80"
            .size=${size}
            aria-label="Disabled range slider"></md-gb-slider>
        </label>
      </div>
    `;
  },
};

const customText: MaterialStoryInit<StoryKnobs> = {
  name: 'Slider with custom value indicator text and aria-valuetext',
  styles: [labelStyles],
  render({disabled, size}) {
    const labels = ['Extra Small', 'Small', 'Medium', 'Large', 'Extra Large'];
    function updateText(event: Event) {
      const target = event.target as SliderElement;
      const index = Math.round(target.value ?? 0);
      target.valueLabel = labels[index];
      target.ariaValueText = labels[index];
    }
    return html`
      <div class="story-wrapper">
        <label>
          Custom text indicator
          <md-gb-slider
            labeled
            ticks
            min="0"
            max="4"
            step="1"
            value="2"
            value-label="Medium"
            aria-valuetext="Medium"
            ?disabled=${disabled ?? false}
            .size=${size}
            @input=${updateText}
            aria-label="Slider with custom value indicator text"></md-gb-slider>
        </label>
      </div>
    `;
  },
};

const customTheme: MaterialStoryInit<StoryKnobs> = {
  name: 'Sliders with custom theme',
  styles: [
    labelStyles,
    css`
      .custom-theme-slider {
        --active-track-color: #6750a4;
        --inactive-track-color: #eaddff;
        --handle-color: #6750a4;
        --active-handle-color: #381e72;
      }
    `,
  ],
  render({disabled, size}) {
    return html`
      <div class="story-wrapper">
        <label>
          Custom purple theme
          <md-gb-slider
            class="custom-theme-slider"
            labeled
            ticks
            step="5"
            value="40"
            ?disabled=${disabled ?? false}
            .size=${size}
            aria-label="Slider with custom theme"></md-gb-slider>
        </label>
      </div>
    `;
  },
};

const idomDemo: MaterialStoryInit<StoryKnobs> = {
  name: 'IDOM demo',
  styles: [labelStyles],
  render({disabled, size}) {
    return html`
      <div class="story-wrapper">
        <!-- Demo of a slider that is updated via IDOM patching. go/gm-web-slider-docs#idom-support for more information. -->
        <label>
          IDOM Patching Demo (External State Updates)
          <md-gb-slider
            id="idom-slider"
            labeled
            ticks
            step="10"
            value="50"
            ?disabled=${disabled ?? false}
            .size=${size}
            aria-label="Slider updated via IDOM patching"></md-gb-slider>
        </label>
        <div style="display: flex; gap: 8px; margin-top: 8px;">
          <button
            @click=${(e: Event) => {
              const slider = (
                e.target as HTMLElement
              ).parentElement?.previousElementSibling?.querySelector(
                'md-gb-slider',
              ) as SliderElement | null;
              if (slider) {
                slider.value = Math.max(
                  slider.min,
                  (slider.value ?? 0) - 10,
                );
              }
            }}>
            -10
          </button>
          <button
            @click=${(e: Event) => {
              const slider = (
                e.target as HTMLElement
              ).parentElement?.previousElementSibling?.querySelector(
                'md-gb-slider',
              ) as SliderElement | null;
              if (slider) {
                slider.value = Math.min(
                  slider.max,
                  (slider.value ?? 0) + 10,
                );
              }
            }}>
            +10
          </button>
          <button
            @click=${(e: Event) => {
              const slider = (
                e.target as HTMLElement
              ).parentElement?.previousElementSibling?.querySelector(
                'md-gb-slider',
              ) as SliderElement | null;
              if (slider) {
                slider.value = 50;
              }
            }}>
            Reset (50)
          </button>
        </div>
      </div>
    `;
  },
};

const disabled: MaterialStoryInit<StoryKnobs> = {
  name: 'Disabled',
  styles: [labelStyles],
  render({size}) {
    return html`
      <div class="story-wrapper">
        <label>
          Disabled continuous
          <md-gb-slider
            disabled
            value="40"
            .size=${size}
            aria-label="Disabled continuous slider"></md-gb-slider>
        </label>
      </div>
    `;
  },
};

/** Slider stories. */
export const stories = [
  single,
  range,
  centered,
  disabledStory,
  customText,
  customTheme,
  idomDemo,
  disabled,
];
