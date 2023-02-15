/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html} from 'lit';

import {Field} from './field.js';

/**
 * An outlined field component.
 */
export class OutlinedField extends Field {
  protected override renderContainerContents() {
    return html`
      <span class="md3-field__outline">
        <span class="md3-field__outline-start"></span>
        <span class="md3-field__outline-notch">
          <span class="md3-field__outline-panel-inactive"></span>
          <span class="md3-field__outline-panel-active"></span>
          ${this.renderFloatingLabel()}
        </span>
        <span class="md3-field__outline-end"></span>
      </span>
      ${super.renderContainerContents()}
    `;
  }

  protected override renderMiddleContents() {
    return html`
      ${this.renderRestingLabel()}
      ${super.renderMiddleContents()}
    `;
  }
}
