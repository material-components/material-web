/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../field/filled-field';

import {html, TemplateResult} from 'lit';
import {ClassInfo} from 'lit/directives/class-map';

import {TextField} from './text-field';

/** @soyCompatible */
export class FilledTextField extends TextField {
  /** @soyTemplate */
  protected override getRenderClasses(): ClassInfo {
    return {
      ...super.getRenderClasses(),
      'md3-text-field--filled': true,
    };
  }

  /** @soyTemplate */
  protected override renderField(): TemplateResult {
    return html`
      <md-filled-field
        .disabled=${this.disabled}
        .error=${this.error}
        .label=${this.label}
        ?populated=${Boolean(this.value)}
        .required=${this.required}
      >
        ${this.renderFieldContent()}
      </md-filled-field>
    `;
  }
}
