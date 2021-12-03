/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement, TemplateResult} from 'lit';
import {property} from 'lit/decorators';
import {ClassInfo, classMap} from 'lit/directives/class-map';

import {TextFieldFoundation} from './foundation';
import {TextFieldState} from './state';

/** @soyCompatible */
export abstract class TextField extends LitElement implements TextFieldState {
  // TextFieldState
  @property({type: Boolean}) disabled = false;
  @property({type: Boolean}) error = false;
  @property({type: String}) label?: string;
  @property({type: Boolean}) required = false;
  @property({type: String}) value?: string;

  protected foundation = new TextFieldFoundation({state: this});

  /** @soyTemplate */
  override render(): TemplateResult {
    return html`
      <span class="md3-text-field ${classMap(this.getRenderClasses())}">
        ${this.renderField()}
      </span>
    `;
  }

  /** @soyTemplate */
  protected getRenderClasses(): ClassInfo {
    return {};
  }

  /** @soyTemplate */
  protected abstract renderField(): TemplateResult;

  /** @soyTemplate */
  protected renderFieldContent(): TemplateResult {
    return html`
      <input class="md3-text-field__input"
        ?disabled=${this.disabled}
        ?required=${this.required}
        .value=${this.value ?? ''}>
    `;
  }
}
