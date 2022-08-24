/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, TemplateResult} from 'lit';
import {ClassInfo} from 'lit/directives/class-map.js';

import {Field} from './field.js';

/** @soyCompatible */
export class OutlinedField extends Field {
  /** @soyTemplate */
  protected override getRenderClasses(): ClassInfo {
    return {
      ...super.getRenderClasses(),
      'md3-field--outlined': true,
    };
  }

  /** @soyTemplate */
  protected override renderContainerContents(): TemplateResult {
    return html`
      ${this.renderOutline()}
      ${super.renderContainerContents()}
    `;
  }

  /** @soyTemplate */
  protected renderOutline(): TemplateResult {
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
    `;
  }

  /** @soyTemplate */
  protected override renderMiddleContents(): TemplateResult {
    return html`
      ${this.renderRestingLabel()}
      ${super.renderMiddleContents()}
    `;
  }
}
