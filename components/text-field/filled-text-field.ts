/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../field/filled-field';

import {html, TemplateResult} from 'lit';
import {customElement} from 'lit/decorators';

import {styles as filledStyles} from './lib/filled-styles.css';
import {FilledTextField} from './lib/filled-text-field';
import {styles as sharedStyles} from './lib/shared-styles.css';

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

  constructor() {
    super();
    // TODO(b/223268166): remove when l2w supports superclass event handlers
    this.addEventListener('click', this.handleClick);
  }

  /** @soyTemplate */
  protected override renderField(): TemplateResult {
    return html`
      <md-filled-field
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
