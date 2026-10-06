/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ChatBubbleElement} from './chat-bubble-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design chat bubble component. */
    'md-gb-chat-bubble': ChatBubbleElement;
  }
}

customElements.define('md-gb-chat-bubble', ChatBubbleElement);
