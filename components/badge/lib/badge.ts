/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement, TemplateResult} from 'lit';
import {property} from 'lit/decorators.js';
import {ClassInfo, classMap} from 'lit/directives/class-map.js';

/** @soyCompatible */
export class Badge extends LitElement {
  @property({type: String}) value = '';

  /** @soyTemplate */
  protected override render(): TemplateResult {
    return html`<div class="md3-badge ${
        classMap(this.getRenderClasses())}"><p class="md3-badge__value">${
        this.value}</p></div>`;
  }

  /** @soyTemplate */
  protected getRenderClasses(): ClassInfo {
    return {
      'md3-badge--large': this.value,
    };
  }
}
