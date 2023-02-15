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
      <span class="outline">
        <span class="outline-start"></span>
        <span class="outline-notch">
          <span class="outline-panel-inactive"></span>
          <span class="outline-panel-active"></span>
          ${this.renderFloatingLabel()}
        </span>
        <span class="outline-end"></span>
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
