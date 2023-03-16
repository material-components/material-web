/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../elevation/elevation.js';
import '../../focus/focus-ring.js';

import {LitElement, nothing} from 'lit';
import {property, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {html as staticHtml, literal} from 'lit/static-html.js';

import {pointerPress, shouldShowStrongFocus} from '../../focus/strong-focus.js';

/**
 * A chip component.
 */
export class Chip extends LitElement {
  @property({type: Boolean}) disabled = false;
  @property({type: Boolean}) elevated = false;
  @property({type: String}) href = '';
  @property({type: String}) label = '';
  @property({type: String}) target = '';

  @state() private showFocusRing = false;

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
          target=${this.href ? this.target : nothing}
          @blur=${this.handleBlur}
          @focus=${this.handleFocus}
          @pointerdown=${this.handlePointerDown}>
        <md-elevation shadow=${this.elevated} surface></md-elevation>
        <md-focus-ring .visible=${this.showFocusRing}></md-focus-ring>
        <div class="label">${this.label}</div>
      </${button}>
    `;
  }

  private handleBlur() {
    this.showFocusRing = false;
  }

  private handleFocus() {
    this.showFocusRing = shouldShowStrongFocus();
  }

  private handlePointerDown() {
    pointerPress();
    this.showFocusRing = shouldShowStrongFocus();
  }
}
