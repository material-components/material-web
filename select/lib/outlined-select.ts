/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../field/outlined-field.js';

import {html} from 'lit';

import {Select} from './select.js';

// tslint:disable-next-line:enforce-comments-on-exported-symbols
export abstract class OutlinedSelect extends Select {
  // LINT.IfChange
  override renderField() {
    return html`
      <md-outlined-field
          aria-haspopup="listbox"
          role="combobox"
          tabindex=${this.disabled ? '-1' : '0'}
          aria-expanded=${this.open ? 'true' : 'false'}
          class="field"
          label=${this.label}
          .focused=${this.focused || this.open}
          .populated=${!!this.displayText}
          .disabled=${this.disabled}
          .required=${this.required}
          .error=${this.error}
          .hasStart=${this.hasLeadingIcon}
          .hasEnd=${this.hasTrailingIcon}
          @keydown =${this.handleKeydown}
          @click=${this.handleClick}
          @focus=${this.handleFocus}
          @blur=${this.handleBlur}>
        ${this.renderFieldContent()}
      </md-outlined-field>`;
  }
  // LINT.ThenChange(select/lib/filled-select.ts)
}
