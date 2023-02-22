/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, TemplateResult} from 'lit';

import {Field} from './field.js';

/**
 * An outlined field component.
 */
export class OutlinedField extends Field {
  protected override renderOutline(floatingLabel: TemplateResult) {
    return html`
      <span class="outline">
        <span class="outline-start"></span>
        <span class="outline-notch">
          <span class="outline-panel-inactive"></span>
          <span class="outline-panel-active"></span>
          ${floatingLabel}
        </span>
        <span class="outline-end"></span>
      </span>
    `;
  }
}
