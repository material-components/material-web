/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../focus/md-focus-ring.js';
import '../../ripple/ripple.js';

import {html, nothing} from 'lit';

import {Chip} from './chip.js';

interface RemoveButtonProperties {
  ariaLabel: string;
  disabled: boolean;
  focusListener: EventListener;
  tabbable?: boolean;
}

/** @protected */
export function renderRemoveButton({
  ariaLabel,
  disabled,
  focusListener,
  tabbable = false,
}: RemoveButtonProperties) {
  return html`
    <button
      class="trailing action"
      aria-label=${ariaLabel}
      tabindex=${!tabbable ? -1 : nothing}
      @click=${handleRemoveClick}
      @focus=${focusListener}>
      <md-focus-ring part="trailing-focus-ring"></md-focus-ring>
      <md-ripple ?disabled=${disabled}></md-ripple>
      <span class="trailing icon" aria-hidden="true">
        <slot name="remove-trailing-icon">
          <svg viewBox="0 96 960 960">
            <path
              d="m249 849-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z" />
          </svg>
        </slot>
      </span>
      <span class="touch"></span>
    </button>
  `;
}

function handleRemoveClick(this: Chip, event: Event) {
  if (this.disabled) {
    return;
  }

  event.stopPropagation();
  const preventDefault = !this.dispatchEvent(
    new Event('remove', {cancelable: true}),
  );
  if (preventDefault) {
    return;
  }

  this.remove();
}
