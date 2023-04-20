/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../field/filled-field.js';

import {html} from 'lit';

import {TextField} from './text-field.js';

/**
 * A filled text field component.
 */
export class FilledTextField extends TextField {
  // LINT.IfChange
  override renderField() {
    return html`<md-filled-field
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
      </md-filled-field>`;
  }
  // LINT.ThenChange(textfield/lib/outlined-text-field.ts)
}
