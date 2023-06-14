/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../focus/focus-ring.js';
import '../../ripple/ripple.js';

import {html} from 'lit';

import {Chip} from './chip.js';

interface RemoveButtonProperties {
  ariaLabel: string;
  disabled: boolean;
}

/** @protected */
export function renderRemoveButton(
    {ariaLabel, disabled}: RemoveButtonProperties) {
  return html`
    <button class="trailing action"
      aria-label=${ariaLabel}
      ?disabled=${disabled}
      @click=${handleRemoveClick}
    >
      <md-focus-ring></md-focus-ring>
      <md-ripple></md-ripple>
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
