/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {createElementDirective} from './directives.js';

/**
 * Emulates the `:has-slotted` CSS pseudo class by adding a `.has-slotted` class
 * to `<slot>` elements when they have assigned nodes.
 */
export const hasSlotted = createElementDirective((element, opts) => {
  if (!element.matches('slot')) {
    throw new Error('hasSlotted() must be used on a <slot> element.');
  }

  element.addEventListener(
    'slotchange',
    (event) => {
      element.classList.toggle(
        'has-slotted',
        (element as HTMLSlotElement).assignedNodes().length > 0,
      );
    },
    opts,
  );
});
