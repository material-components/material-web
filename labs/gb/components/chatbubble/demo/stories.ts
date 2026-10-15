/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/labs/gb/components/chatbubble/md-gb-chat-bubble.js';

import {MaterialStoryInit} from './material-collection.js';
import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
import {css, html} from 'lit';

import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.css' with {type: 'css'}; // github-only
// import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.cssresult.js'; // google3-only

/** Knob types for chat bubble stories. */
export interface StoryKnobs {
  text: string;
  editing: boolean;
  expanded: boolean;
  showEditButton: boolean;
  showCopyButton: boolean;
}

adoptStyles(document, [
  m3Styles,
  css`
    :root {
      --md-icon-font: 'Material Symbols Outlined';
    }
  `,
]);

const DEFAULT_TEXT =
  'Analyze user feedback on our marketing and sales strategy.';

const LONG_TEXT_SAMPLE =
  'Write a full analysis of the differences between Material 2 and Material 3 design systems. Focus on color theory, typography, spacing, and interaction states. For color theory, explain how the dynamic color system works, including the generation of tonal palettes and how they map to specific UI roles. For typography, detail the changes in scale and weight, and how they contribute to improved readability across different screen sizes. For spacing, discuss the move towards a more grid-based approach and the impact on dense layouts. Finally, for interaction states, describe the refined hover, focus, and pressed visual indicators. Please include examples of components that demonstrate these changes clearly, such as the FAB, Chips, and Navigation Drawer. Provide the final report in Markdown format with clear headings, bullet points for key takeaways, and a side-by-side comparison table for quick reference. This will be used in an upcoming design review with external stakeholders, so please ensure the tone is professional and the explanations are accessible to both designers and non-designers alike.';

const styles = css`
  .chat-bubble-container {
    display: flex;
    flex-direction: column;
    gap: 32px;
    padding: 24px;
    width: min(800px, calc(100vw - 64px));
    max-width: 800px;
    box-sizing: border-box;
  }

  .chat-bubble-section {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
  }

  .chat-bubble-section h4 {
    margin: 0;
  }

  md-gb-chat-bubble.custom-corner::part(chat-bubble) {
    --container-shape-top-trailing: var(--md-sys-shape-corner-xs, 4px);
  }
`;

const playground: MaterialStoryInit<StoryKnobs> = {
  name: 'Playground',
  styles,
  render(knobs) {
    const text = knobs.text || DEFAULT_TEXT;
    const editing = Boolean(knobs.editing);
    const expanded = Boolean(knobs.expanded);
    const showEditButton = knobs.showEditButton ?? true;
    const showCopyButton = knobs.showCopyButton ?? true;

    return html`
      <div class="chat-bubble-container">
        <md-gb-chat-bubble
          .text="${text}"
          ?editing="${editing}"
          ?expanded="${expanded}"
          .showEditButton="${showEditButton}"
          .showCopyButton="${showCopyButton}">
        </md-gb-chat-bubble>
      </div>
    `;
  },
};

const variations: MaterialStoryInit<StoryKnobs> = {
  name: 'Chat Bubble Variations',
  styles,
  render() {
    return html`
      <div class="chat-bubble-container">
        <div class="chat-bubble-section">
          <h4>Default</h4>
          <md-gb-chat-bubble .text="${DEFAULT_TEXT}"></md-gb-chat-bubble>
        </div>

        <div class="chat-bubble-section">
          <h4>Long Message</h4>
          <md-gb-chat-bubble .text="${LONG_TEXT_SAMPLE}"></md-gb-chat-bubble>
        </div>

        <div class="chat-bubble-section">
          <h4>No Copy Button</h4>
          <md-gb-chat-bubble .text="${DEFAULT_TEXT}" .showCopyButton="${false}">
          </md-gb-chat-bubble>
        </div>

        <div class="chat-bubble-section">
          <h4>No Edit Button</h4>
          <md-gb-chat-bubble .text="${DEFAULT_TEXT}" .showEditButton="${false}">
          </md-gb-chat-bubble>
        </div>

        <div class="chat-bubble-section">
          <h4>No Buttons</h4>
          <md-gb-chat-bubble
            .text="${DEFAULT_TEXT}"
            .showCopyButton="${false}"
            .showEditButton="${false}">
          </md-gb-chat-bubble>
        </div>

        <div class="chat-bubble-section">
          <h4>Custom Theme</h4>
          <md-gb-chat-bubble class="custom-corner" .text="${DEFAULT_TEXT}">
          </md-gb-chat-bubble>
        </div>
      </div>
    `;
  },
};

/** Chat Bubble stories. */
export const stories = [playground, variations];
