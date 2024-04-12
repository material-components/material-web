/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement} from 'lit';
import {property} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';

/**
 * b/265340196 - add docs
 */
export class Badge extends LitElement {
  @property() value = '';

  protected override render() {
    const classes = {'md3-badge--large': this.value};

    return html`<div class="md3-badge ${classMap(classes)}">
      <p class="md3-badge__value">${this.value}</p>
    </div>`;
  }
}
