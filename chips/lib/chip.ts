/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../elevation/elevation.js';

import {html, LitElement} from 'lit';
import {property} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';

/**
 * A chip component.
 */
export class Chip extends LitElement {
  @property({type: Boolean}) disabled = false;
  @property({type: Boolean}) elevated = false;
  @property({type: String}) label = '';

  override render() {
    const classes = {
      elevated: this.elevated,
      flat: !this.elevated,
    };

    return html`
      <button class="container ${classMap(classes)}"
          ?disabled=${this.disabled}>
        <md-elevation shadow=${this.elevated} surface></md-elevation>
        <div class="label">${this.label}</div>
      </button>
    `;
  }
}
