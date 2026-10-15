/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ClassInfo} from 'lit/directives/class-map.js';

import {createClassMapDirective} from '../shared/directives.js';
import {PSEUDO_CLASSES} from '../shared/pseudo-classes.js';

/** Chat Bubble classes. */
export const CHAT_BUBBLE_CLASSES = {
  chatBubble: 'chat-bubble',
  chatBubbleEditing: 'chat-bubble-editing',
  chatBubbleExpanded: 'chat-bubble-expanded',
  chatBubbleExpanding: 'chat-bubble-expanding',
  chatBubbleOverflowing: 'chat-bubble-overflowing',
  chatBubbleTransitioning: 'chat-bubble-transitioning',
  hover: PSEUDO_CLASSES.hover,
  focus: PSEUDO_CLASSES.focus,
} as const;

/** The state provided to the `chatBubbleClasses()` function. */
export interface ChatBubbleClassesState {
  /** Whether the chat bubble is in edit mode. */
  editing?: boolean;
  /** Whether the chat bubble is expanded. */
  expanded?: boolean;
  /** Whether the chat bubble content is overflowing and clamped. */
  overflowing?: boolean;
  /** Whether the chat bubble is currently animating transitions. */
  transitioning?: boolean;
  /** Whether the chat bubble is currently animating expansion. */
  expanding?: boolean;
  /** Emulates `:hover`. */
  hover?: boolean;
  /** Emulates `:focus`. */
  focus?: boolean;
}

/**
 * Returns the chat bubble classes to apply to an element based on the given state.
 *
 * @param state The state of the chat bubble.
 * @return An object of class names and truthy values if they apply.
 */
export function chatBubbleClasses({
  editing = false,
  expanded = false,
  overflowing = false,
  transitioning = false,
  expanding = false,
  hover = false,
  focus = false,
}: ChatBubbleClassesState = {}): ClassInfo {
  return {
    [CHAT_BUBBLE_CLASSES.chatBubble]: true,
    [CHAT_BUBBLE_CLASSES.chatBubbleEditing]: editing,
    [CHAT_BUBBLE_CLASSES.chatBubbleExpanded]: expanded,
    [CHAT_BUBBLE_CLASSES.chatBubbleExpanding]: expanding,
    [CHAT_BUBBLE_CLASSES.chatBubbleOverflowing]: overflowing,
    [CHAT_BUBBLE_CLASSES.chatBubbleTransitioning]: transitioning,
    [CHAT_BUBBLE_CLASSES.hover]: hover,
    [CHAT_BUBBLE_CLASSES.focus]: focus,
  };
}

/**
 * A Lit directive that adds chat bubble styling and functionality to its element.
 *
 * @example
 * ```ts
 * html`<div class="${chatBubble({editing: false, expanded: false})}">...</div>`;
 * ```
 */
export const chatBubble = createClassMapDirective({
  getClasses: chatBubbleClasses,
});
