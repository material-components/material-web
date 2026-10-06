/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/labs/gb/components/segmentedbutton/md-gb-segmented-button.js';
import '@material/web/labs/gb/components/segmentedbutton/md-gb-segmented-button-set.js';
import '@material/web/labs/gb/styles/icon/md-gb-icon.js';

import {type MaterialStoryInit} from './material-collection.js';
import {
  type SegmentedButtonDensity,
  type SegmentedButtonSelection,
} from '@material/web/labs/gb/components/segmentedbutton/segmented-button.js';
import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.cssresult.js';
import {css, html, nothing} from 'lit';

/** Knob types for segmented button stories. */
export interface StoryKnobs {
  selection?: SegmentedButtonSelection;
  segments?: '2' | '3' | '4' | '5';
  content?: 'label' | 'icon' | 'both';
  density?: '0' | '-1' | '-2' | '-3';
  disabled?: boolean;
  disabledSegment?: 'none' | '0' | '1' | '2' | '3' | '4';
  ariaLabel?: string;
}

adoptStyles(document, [
  m3Styles,
  css`
    :root {
      --md-icon-font: 'Material Symbols Outlined';
    }
  `,
]);

const styles = [
  css`
    .story-column {
      display: flex;
      flex-direction: column;
      gap: 24px;
      align-items: flex-start;
      text-align: left;
      direction: ltr;
    }
    [dir='rtl'] .story-column md-gb-segmented-button-set {
      direction: rtl;
    }
    .story-row {
      display: flex;
      flex-direction: row;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
    }
  `,
];

interface SegmentConfig {
  value: string;
  label: string;
  icon: string;
}

const DEFAULT_SEGMENTS: SegmentConfig[] = [
  {value: 'day', label: 'Day', icon: 'calendar_today'},
  {value: 'week', label: 'Week', icon: 'calendar_view_week'},
  {value: 'month', label: 'Month', icon: 'calendar_month'},
  {value: 'quarter', label: 'Quarter', icon: 'view_agenda'},
  {value: 'year', label: 'Year', icon: 'event_note'},
];

const playground: MaterialStoryInit<StoryKnobs> = {
  name: 'Playground',
  styles,
  render(knobs) {
    const count = Number(knobs.segments ?? '3');
    const content = knobs.content ?? 'label';
    const items = DEFAULT_SEGMENTS.slice(0, count);
    const density = Number(knobs.density ?? '0') as SegmentedButtonDensity;
    const disabledSegIndex =
      knobs.disabledSegment === 'none' || !knobs.disabledSegment
        ? -1
        : Number(knobs.disabledSegment);

    return html`
      <div class="story-column">
        <md-gb-segmented-button-set
          aria-label=${knobs.ariaLabel || 'Select option'}
          selection=${knobs.selection ?? 'single'}
          density=${density}
          ?disabled=${knobs.disabled ?? false}>
          ${items.map((item, index) => {
            const isDisabled = disabledSegIndex === index;
            const isIconOnly = content === 'icon';
            const hasIcon = content === 'icon' || content === 'both';
            const hasLabel = content === 'label' || content === 'both';

            return html`
              <md-gb-segmented-button
                value=${item.value}
                ?selected=${index === 0}
                ?disabled=${isDisabled}
                aria-label=${isIconOnly ? item.label : nothing}>
                ${hasIcon
                  ? html`<md-gb-icon slot="icon">${item.icon}</md-gb-icon>`
                  : ''}
                ${hasLabel ? item.label : ''}
              </md-gb-segmented-button>
            `;
          })}
        </md-gb-segmented-button-set>
      </div>
    `;
  },
};

const singleSelect: MaterialStoryInit<StoryKnobs> = {
  name: 'Single-select',
  styles,
  render() {
    return html`
      <div class="story-column">
        <h3>Calendar View</h3>
        <md-gb-segmented-button-set
          aria-label="Calendar view options"
          selection="single">
          <md-gb-segmented-button value="day" selected
            >Day</md-gb-segmented-button
          >
          <md-gb-segmented-button value="week">Week</md-gb-segmented-button>
          <md-gb-segmented-button value="month">Month</md-gb-segmented-button>
          <md-gb-segmented-button value="year">Year</md-gb-segmented-button>
        </md-gb-segmented-button-set>
      </div>
    `;
  },
};

const multiSelect: MaterialStoryInit<StoryKnobs> = {
  name: 'Multi-select',
  styles,
  render() {
    return html`
      <div class="story-column">
        <h3>Text Formatting</h3>
        <md-gb-segmented-button-set
          aria-label="Text formatting options"
          selection="multiple">
          <md-gb-segmented-button value="bold" selected aria-label="Bold">
            <md-gb-icon slot="icon">format_bold</md-gb-icon>
          </md-gb-segmented-button>
          <md-gb-segmented-button value="italic" aria-label="Italic">
            <md-gb-icon slot="icon">format_italic</md-gb-icon>
          </md-gb-segmented-button>
          <md-gb-segmented-button
            value="underline"
            selected
            aria-label="Underline">
            <md-gb-icon slot="icon">format_underlined</md-gb-icon>
          </md-gb-segmented-button>
        </md-gb-segmented-button-set>
      </div>
    `;
  },
};

const iconsAndCheckmarks: MaterialStoryInit<StoryKnobs> = {
  name: 'Icons and checkmarks',
  styles,
  render() {
    return html`
      <div class="story-column">
        <h3>Label-only (checkmark prepends when selected)</h3>
        <md-gb-segmented-button-set
          aria-label="Travel modes"
          selection="single">
          <md-gb-segmented-button value="walk" selected
            >Walking</md-gb-segmented-button
          >
          <md-gb-segmented-button value="transit"
            >Transit</md-gb-segmented-button
          >
          <md-gb-segmented-button value="drive">Driving</md-gb-segmented-button>
        </md-gb-segmented-button-set>

        <h3>Icon-only (checkmark appears at inline-start)</h3>
        <md-gb-segmented-button-set
          aria-label="Favorite items"
          selection="multiple">
          <md-gb-segmented-button
            value="favorite"
            selected
            aria-label="Favorite">
            <md-gb-icon slot="icon">favorite</md-gb-icon>
          </md-gb-segmented-button>
          <md-gb-segmented-button value="star" aria-label="Star">
            <md-gb-icon slot="icon">star</md-gb-icon>
          </md-gb-segmented-button>
          <md-gb-segmented-button
            value="bookmark"
            selected
            aria-label="Bookmark">
            <md-gb-icon slot="icon">bookmark</md-gb-icon>
          </md-gb-segmented-button>
        </md-gb-segmented-button-set>

        <h3>Label and icon (checkmark replaces icon)</h3>
        <md-gb-segmented-button-set aria-label="Media views" selection="single">
          <md-gb-segmented-button value="list" selected>
            <md-gb-icon slot="icon">view_list</md-gb-icon>
            List
          </md-gb-segmented-button>
          <md-gb-segmented-button value="grid">
            <md-gb-icon slot="icon">grid_view</md-gb-icon>
            Grid
          </md-gb-segmented-button>
        </md-gb-segmented-button-set>
      </div>
    `;
  },
};

const densities: MaterialStoryInit<StoryKnobs> = {
  name: 'Densities',
  styles,
  render() {
    return html`
      <div class="story-column">
        <h3>Density 0 (Default - 40px)</h3>
        <md-gb-segmented-button-set aria-label="Density 0 options" density="0">
          <md-gb-segmented-button selected>Day</md-gb-segmented-button>
          <md-gb-segmented-button>Week</md-gb-segmented-button>
          <md-gb-segmented-button>Month</md-gb-segmented-button>
        </md-gb-segmented-button-set>

        <h3>Density -1 (36px)</h3>
        <md-gb-segmented-button-set
          aria-label="Density -1 options"
          density="-1">
          <md-gb-segmented-button selected>Day</md-gb-segmented-button>
          <md-gb-segmented-button>Week</md-gb-segmented-button>
          <md-gb-segmented-button>Month</md-gb-segmented-button>
        </md-gb-segmented-button-set>

        <h3>Density -2 (32px)</h3>
        <md-gb-segmented-button-set
          aria-label="Density -2 options"
          density="-2">
          <md-gb-segmented-button selected>Day</md-gb-segmented-button>
          <md-gb-segmented-button>Week</md-gb-segmented-button>
          <md-gb-segmented-button>Month</md-gb-segmented-button>
        </md-gb-segmented-button-set>

        <h3>Density -3 (28px)</h3>
        <md-gb-segmented-button-set
          aria-label="Density -3 options"
          density="-3">
          <md-gb-segmented-button selected>Day</md-gb-segmented-button>
          <md-gb-segmented-button>Week</md-gb-segmented-button>
          <md-gb-segmented-button>Month</md-gb-segmented-button>
        </md-gb-segmented-button-set>
      </div>
    `;
  },
};

/** Segmented Button stories. */
export const stories = [
  playground,
  singleSelect,
  multiSelect,
  iconsAndCheckmarks,
  densities,
];
