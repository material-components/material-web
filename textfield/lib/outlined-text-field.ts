/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../field/outlined-field.js';

import {html} from 'lit';

import {TextField} from './text-field.js';

/**
 * An outlined text field component
 */
export class OutlinedTextField extends TextField {
  
  // LINT.IfChange
  override renderField() {
    return html`<md-outlined-field
        class="field"
        ?disabled=${this.disabled}
        ?error=${this.hasError}
        ?focused=${this.focused}
        ?hasEnd=${this.hasTrailingIcon}
        ?hasStart=${this.hasLeadingIcon}
        .label=${this.label}
        ?populated=${!!this.getInputValue()}
        ?required=${this.required}
      >
        ${this.renderRootChildren()}
      </md-outlined-field>`;
  }
  // LINT.ThenChange(textfield/lib/filled-text-field.ts)
}
