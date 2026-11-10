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
        <div slot="title">An accordion</div>
        <div slot="content">
          This is the expandable content. This content is only visible and
          accessible when the accordion item is expanded.
        </div>
      </md-aria-accordion>
      <hr />
      <md-aria-accordion open>
        <div slot="title">An open accordion</div>
        <div slot="content">
          This is the expandable content. This content is only visible and
          accessible when the accordion item is expanded.
        </div>
      </md-aria-accordion>
    `;
  },
};

const accordionExclusive: MaterialStoryInit<StoryKnobs> = {
  name: 'Exclusivity',
  styles: css``,
  render(knobs) {
    return html`
      <md-aria-accordion name="groupA">
        <div slot="title">Group A, Item 1</div>
        <div slot="content">
          This is the expandable content. This content is only visible and
          accessible when the accordion item is expanded.
        </div>
      </md-aria-accordion>
      <md-aria-accordion name="groupA">
        <div slot="title">Group A, Item 2</div>
        <div slot="content">
          This is the expandable content. This content is only visible and
          accessible when the accordion item is expanded.
        </div>
      </md-aria-accordion>
      <md-aria-accordion name="groupA">
        <div slot="title">Group A, Item 3</div>
        <div slot="content">
          This is the expandable content. This content is only visible and
          accessible when the accordion item is expanded.
        </div>
      </md-aria-accordion>
      <hr />
      <md-aria-accordion name="groupB">
        <div slot="title">Group B, Item 1</div>
        <div slot="content">
          This is the expandable content. This content is only visible and
          accessible when the accordion item is expanded.
        </div>
      </md-aria-accordion>
      <md-aria-accordion name="groupB">
        <div slot="title">Group B, Item 2</div>
        <div slot="content">
          This is the expandable content. This content is only visible and
          accessible when the accordion item is expanded.
        </div>
      </md-aria-accordion>
      <md-aria-accordion name="groupB">
        <div slot="title">Group B, Item 3</div>
        <div slot="content">
          This is the expandable content. This content is only visible and
          accessible when the accordion item is expanded.
        </div>
      </md-aria-accordion>
    `;
  },
};

const accordionHeadings: MaterialStoryInit<StoryKnobs> = {
  name: 'Nesting & Headings',
  styles: css`
    #root {
      min-width: 20em;
    }

    md-aria-accordion::part(button):hover {
      background: lightgray;
    }

    [slot='content'] {
      border-left: 2px solid lightgray;
      padding-left: 1em;
    }
  `,
  render(knobs) {
    return html`
      <!-- Individual story headings are level 3. -->
      <md-aria-accordion id="root" .headingLevel=${4}>
        <div slot="title">Root</div>
        <div slot="content">
          <md-aria-accordion .headingLevel=${5}>
            <div slot="title">Item 1</div>
            <div slot="content">
              <md-aria-accordion .headingLevel=${6}>
                <div slot="title">Item 1-1</div>
                <div slot="content"> Item 1-1 content </div>
              </md-aria-accordion>
              <md-aria-accordion .headingLevel=${6}>
                <div slot="title">Item 1-2</div>
                <div slot="content"> Item 1-2 content </div>
              </md-aria-accordion>
              <md-aria-accordion .headingLevel=${6}>
                <div slot="title">Item 1-3</div>
                <div slot="content"> Item 1-3 content </div>
              </md-aria-accordion>
            </div>
          </md-aria-accordion>
          <md-aria-accordion .headingLevel=${5}>
            <div slot="title">Item 2</div>
            <div slot="content"> Item 2 content </div>
          </md-aria-accordion>
          <md-aria-accordion .headingLevel=${5}>
            <div slot="title">Item 3</div>
            <div slot="content"> Item 3 content </div>
          </md-aria-accordion>
        </div>
      </md-aria-accordion>
    `;
  },
};

export const stories = [accordion, accordionExclusive, accordionHeadings];
