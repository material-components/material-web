/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../field/filled-field';

import {html, TemplateResult} from 'lit';
import {queryAsync} from 'lit/decorators';
import {ClassInfo} from 'lit/directives/class-map';

import {MdFilledField} from '../../field/filled-field';

import {TextField} from './text-field';

/** @soyCompatible */
export class FilledTextField extends TextField {
  @queryAsync('md-filled-field')
  protected readonly field!: Promise<MdFilledField>;

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
