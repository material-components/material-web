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
export class FilledField extends Field {
  /** @soyTemplate */
  protected override getRenderClasses(): ClassInfo {
    return {
      ...super.getRenderClasses(),
      'mdc-field--filled': true,
    };
  }

  /** @soyTemplate */
  protected override renderContainerContents(): TemplateResult {
    return html`
      ${super.renderContainerContents()}
      <span class="mdc-field__stroke"></span>
    `;
  }

  /** @soyTemplate */
  protected override renderMiddleContents(): TemplateResult {
    return html`
      ${this.renderLabel(LabelType.FLOATING)}
      ${this.renderLabel(LabelType.RESTING)}
      ${super.renderMiddleContents()}
    `;
  }
}
