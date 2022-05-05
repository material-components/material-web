/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../field/filled-field.js';

import {html, TemplateResult} from 'lit';
import {customElement} from 'lit/decorators.js';

import {styles as filledStyles} from './lib/filled-styles.css.js';
import {FilledTextField} from './lib/filled-text-field.js';
import {styles as sharedStyles} from './lib/shared-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-filled-text-field': MdFilledTextField;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-filled-text-field')
export class MdFilledTextField extends FilledTextField {
  static override styles = [sharedStyles, filledStyles];

  /** @soyTemplate */
  protected override renderField(): TemplateResult {
    return html`
      <md-filled-field
        class="md3-text-field__field"
        id=${this.fieldID}
        .disabled=${this.disabled}
        .error=${this.error}
        .label=${this.label}
        .populated=${Boolean(this.value)}
        .required=${this.required}
      >
        ${this.renderFieldContent()}
      </md-filled-field>
    `;
  }
}
