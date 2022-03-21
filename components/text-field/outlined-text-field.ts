/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../field/outlined-field';

import {html, TemplateResult} from 'lit';
import {customElement} from 'lit/decorators';

import {styles as outlinedStyles} from './lib/outlined-styles.css';
import {OutlinedTextField} from './lib/outlined-text-field';
import {styles as sharedStyles} from './lib/shared-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'md-outlined-text-field': MdOutlinedTextField;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-outlined-text-field')
export class MdOutlinedTextField extends OutlinedTextField {
  static override styles = [sharedStyles, outlinedStyles];

  constructor() {
    super();
    // TODO(b/223268166): remove when l2w supports superclass event handlers
    this.addEventListener('click', this.handleClick);
  }

  /** @soyTemplate */
  protected override renderField(): TemplateResult {
    return html`
      <md-outlined-field
        id=${this.fieldID}
        .disabled=${this.disabled}
        .error=${this.error}
        .label=${this.label}
        .populated=${Boolean(this.value)}
        .required=${this.required}
      >
        ${this.renderFieldContent()}
      </md-outlined-field>
    `;
  }
}
