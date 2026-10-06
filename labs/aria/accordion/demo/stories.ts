/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/labs/aria/accordion/md-aria-accordion.js';

import {MaterialStoryInit} from './material-collection.js';
import {css, html} from 'lit';

export interface StoryKnobs {}

const accordion: MaterialStoryInit<StoryKnobs> = {
  name: 'ARIA Accordion',
  styles: css``,
  render(knobs) {
    return html`
      <md-aria-accordion>
        <div slot="title">Expandable content</div>
        <div slot="content">
          This is the expandable content.<br />
          This content is only visible and accessable when
        </div>
      </md-aria-accordion>
    `;
  },
};

const accordionNameEmpty: MaterialStoryInit<StoryKnobs> = {
  name: 'Empty name is non-exclusive',
  styles: css``,
  render(knobs) {
    return html`
      <md-aria-accordion name="">
        <div slot="title">Expandable content</div>
        <div slot="content">
          This is the expandable content.<br />
          This content is only visible and accessable when
        </div>
      </md-aria-accordion>
      <md-aria-accordion name="">
        <div slot="title">Expandable content</div>
        <div slot="content">
          This is the expandable content.<br />
          This content is only visible and accessable when
        </div>
      </md-aria-accordion>
      <md-aria-accordion name="">
        <div slot="title">Expandable content</div>
        <div slot="content">
          This is the expandable content.<br />
          This content is only visible and accessable when
        </div>
      </md-aria-accordion>
    `;
  },
};

const accordionNameExclusive: MaterialStoryInit<StoryKnobs> = {
  name: 'Exclusivity',
  styles: css``,
  render(knobs) {
    return html`
      <md-aria-accordion name="group1">
        <div slot="title">Expandable content</div>
        <div slot="content">
          This is the expandable content.<br />
          This content is only visible and accessable when
        </div>
      </md-aria-accordion>
      <md-aria-accordion name="group1">
        <div slot="title">Expandable content</div>
        <div slot="content">
          This is the expandable content.<br />
          This content is only visible and accessable when
        </div>
      </md-aria-accordion>
      <md-aria-accordion name="group1">
        <div slot="title">Expandable content</div>
        <div slot="content">
          This is the expandable content.<br />
          This content is only visible and accessable when
        </div>
      </md-aria-accordion>
      <hr />
      <md-aria-accordion name="group2">
        <div slot="title">Expandable content</div>
        <div slot="content">
          This is the expandable content.<br />
          This content is only visible and accessable when
        </div>
      </md-aria-accordion>
      <md-aria-accordion name="group2">
        <div slot="title">Expandable content</div>
        <div slot="content">
          This is the expandable content.<br />
          This content is only visible and accessable when
        </div>
      </md-aria-accordion>
      <md-aria-accordion name="group2">
        <div slot="title">Expandable content</div>
        <div slot="content">
          This is the expandable content.<br />
          This content is only visible and accessable when
        </div>
      </md-aria-accordion>
    `;
  },
};

export const stories = [accordion, accordionNameEmpty, accordionNameExclusive];
