/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, TemplateResult} from 'lit';
import {ClassInfo} from 'lit/directives/class-map';

import {Field} from './field';
import {LabelType} from './state';

/** @soyCompatible */
export class OutlinedField extends Field {
  /** @soyTemplate */
  protected override getRenderClasses(): ClassInfo {
    return {
      ...super.getRenderClasses(),
      'mdc-field--outlined': true,
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
      <span class="mdc-field__outline">
        <span class="mdc-field__outline-start"></span>
        <span class="mdc-field__outline-notch">
          <span class="mdc-field__outline-panel-inactive"></span>
          <span class="mdc-field__outline-panel-active"></span>
          ${this.renderLabel(LabelType.FLOATING)}
        </span>
        <span class="mdc-field__outline-end"></span>
      </span>
    `;
  }

  /** @soyTemplate */
  protected override renderMiddleContents(): TemplateResult {
    return html`
      ${this.renderLabel(LabelType.RESTING)}
      ${super.renderMiddleContents()}
    `;
  }
}
