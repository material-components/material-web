/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../elevation/elevation.js';

import {LitElement, nothing} from 'lit';
import {property} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {html as staticHtml, literal} from 'lit/static-html.js';

/**
 * A chip component.
 */
export class Chip extends LitElement {
  @property({type: Boolean}) disabled = false;
  @property({type: Boolean}) elevated = false;
  @property({type: String}) href = '';
  @property({type: String}) label = '';
  @property({type: String}) target = '';

  override render() {
    const classes = {
      elevated: this.elevated,
      flat: !this.elevated,
    };

    const button = this.href ? literal`a` : literal`button`;
    return staticHtml`
      <${button} class="container ${classMap(classes)}"
          ?disabled=${this.disabled}
          href=${this.href || nothing}
          target=${this.href ? this.target : nothing}>
        <md-elevation shadow=${this.elevated} surface></md-elevation>
        <div class="label">${this.label}</div>
      </${button}>
    `;
  }
}
