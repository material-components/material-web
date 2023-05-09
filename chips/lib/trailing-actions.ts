/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../focus/focus-ring.js';
import '../../ripple/ripple.js';

import {html} from 'lit';
import {createRef, ref} from 'lit/directives/ref.js';

import {ripple} from '../../ripple/directive.js';
import {MdRipple} from '../../ripple/ripple.js';

import {Chip} from './chip.js';

/** @protected */
export function renderRemoveButton({disabled}: {disabled: boolean}) {
  const rippleRef = createRef<MdRipple>();
  return html`
    <button class="trailing action"
      ?disabled=${disabled ?? false}
      @click=${handleRemoveClick}
      ${ripple(() => rippleRef.value || null)}
    >
      <md-focus-ring></md-focus-ring>
      <md-ripple ${ref(rippleRef)} unbounded></md-ripple>
      <svg class="trailing icon" viewBox="0 96 960 960">
        <path d="m249 849-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z" />
      </svg>
      <span class="touch"></span>
    </button>
  `;
}

function handleRemoveClick(this: Chip, event: Event) {
  if (this.disabled) {
    return;
  }

  event.stopPropagation();
  const preventDefault = !this.dispatchEvent(new Event('remove'));
  if (preventDefault) {
    return;
  }

  this.remove();
}
