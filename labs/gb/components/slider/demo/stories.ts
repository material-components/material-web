/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {MaterialStoryInit} from './material-collection.js';
import '@material/web/labs/gb/components/slider/md-gb-slider.js';
import {
  type SliderOrientation,
  type SliderSize,
} from '@material/web/labs/gb/components/slider/slider.js';
import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
import '@material/web/labs/gb/styles/icon/md-gb-icon.js';
import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.cssresult.js';
import {css, html, nothing} from 'lit';

export {type SliderOrientation, type SliderSize};

/** Knob types for slider stories. */
export interface StoryKnobs {
  value: number;
  min: number;
  max: number;
  step: number;
  valueStart: number;
  valueEnd: number;
  size?: SliderSize;
  orientation?: SliderOrientation;
  range: boolean;
  centered: boolean;
  stops: boolean;
  'value indicator': boolean;
  icon: boolean;
  disabled: boolean;
  valueLabel: string;
}

const storyStyles = css`
  .story-column {
    box-sizing: content-box;
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 24px;
    width: 280px;
  }

  .story-column.vertical,
  .story-column:has(md-gb-slider[orientation='vertical']) {
    padding-left: 72px;
  }
`;

adoptStyles(document, [
  m3Styles,
  storyStyles,
  css`
    :root {
      --md-icon-font: 'Material Symbols Outlined';
    }
  `,
]);

const playground: MaterialStoryInit<StoryKnobs> = {
  name: 'Playground',
  styles: storyStyles,
  render(knobs) {
    const isVertical = knobs.orientation === 'vertical';
    const size = knobs.size ?? 'xs';
    const supportsIcon =
      !isVertical &&
      !knobs.range &&
      !knobs.centered &&
      (size === 'md' || size === 'lg' || size === 'xl');
    return html`
      <div class="story-column ${isVertical ? 'vertical' : ''}">
        <md-gb-slider
          .value=${knobs.value}
          .valueStart=${knobs.valueStart}
          .valueEnd=${knobs.valueEnd}
          .min=${knobs.min}
          .max=${knobs.max}
          .step=${knobs.stops ? knobs.step || 10 : 'any'}
          .size=${size}
          ?range=${knobs.range && !isVertical}
          ?centered=${knobs.centered}
          ?ticks=${knobs.stops}
          ?labeled=${knobs['value indicator']}
          ?disabled=${knobs.disabled}
          .valueLabel=${knobs.valueLabel}
          .orientation=${knobs.orientation ?? 'horizontal'}>
          ${knobs.icon && supportsIcon
            ? html`<md-gb-icon slot="icon">volume_up</md-gb-icon>`
            : nothing}
        </md-gb-slider>
      </div>
    `;
  },
};

const continuous: MaterialStoryInit<StoryKnobs> = {
  name: 'Continuous Slider',
  styles: storyStyles,
  render() {
    return html`
      <div class="story-column">
        <md-gb-slider min="0" max="100" value="50" labeled></md-gb-slider>
        <md-gb-slider
          min="0"
          max="100"
          step="10"
          value="50"
          ticks
          labeled></md-gb-slider>
      </div>
    `;
  },
};

const discrete: MaterialStoryInit<StoryKnobs> = {
  name: 'Discrete Slider',
  styles: storyStyles,
  render() {
    return html`
      <div class="story-column">
        <md-gb-slider
          min="0"
          max="100"
          step="10"
          value="50"
          labeled></md-gb-slider>
        <md-gb-slider
          min="0"
          max="100"
          step="10"
          value="50"
          ticks
          labeled></md-gb-slider>
      </div>
    `;
  },
};

const centered: MaterialStoryInit<StoryKnobs> = {
  name: 'Centered Slider',
  styles: storyStyles,
  render() {
    return html`
      <div class="story-column">
        <md-gb-slider
          centered
          min="-50"
          max="50"
          value="0"
          labeled></md-gb-slider>
        <md-gb-slider
          centered
          min="-50"
          max="50"
          step="10"
          value="0"
          ticks
          labeled></md-gb-slider>
      </div>
    `;
  },
};

const rangeStory: MaterialStoryInit<StoryKnobs> = {
  name: 'Range Selection Slider',
  styles: storyStyles,
  render() {
    return html`
      <div class="story-column">
        <md-gb-slider
          range
          min="0"
          max="100"
          value-start="25"
          value-end="75"
          labeled></md-gb-slider>
        <md-gb-slider
          range
          min="0"
          max="100"
          step="10"
          value-start="20"
          value-end="80"
          ticks
          labeled></md-gb-slider>
      </div>
    `;
  },
};

const withIcons: MaterialStoryInit<StoryKnobs> = {
  name: 'Sliders with Icons',
  styles: storyStyles,
  render() {
    return html`
      <div class="story-column">
        <md-gb-slider min="0" max="100" value="30" size="md" labeled>
          <md-gb-icon slot="icon">volume_up</md-gb-icon>
        </md-gb-slider>
        <md-gb-slider min="0" max="100" value="60" size="lg" labeled>
          <md-gb-icon slot="icon">volume_up</md-gb-icon>
        </md-gb-slider>
        <md-gb-slider min="0" max="100" value="80" size="xl" labeled>
          <md-gb-icon slot="icon">volume_up</md-gb-icon>
        </md-gb-slider>
      </div>
    `;
  },
};

/** Slider stories. */
export const stories = [
  playground,
  continuous,
  discrete,
  centered,
  rangeStory,
  withIcons,
];
