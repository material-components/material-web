/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, PropertyValues} from 'lit';
import {state} from 'lit/decorators.js';
import {styleMap} from 'lit/directives/style-map.js';

import {Field} from './field.js';

/**
 * A filled field component.
 */
export class FilledField extends Field {
  @state() private strokeTransformOrigin = '';

  constructor() {
    super();
    this.addEventListener('click', event => {
      if (!this.disabled) {
        this.updateStrokeTransformOrigin(event);
      }
    });
  }

  protected override renderBackground() {
    return html`
      <div class="state-layer"></div>
    `;
  }

  protected override renderIndicator() {
    const strokeStyle = {transformOrigin: this.strokeTransformOrigin};
    return html`
      <div class="active-indicator" style="${styleMap(strokeStyle)}"></div>
    `;
  }

  protected override update(props: PropertyValues<FilledField>) {
    // Upon losing focus, the stroke resets to expanding from the center, such
    // as when re-focusing with a keyboard.
    const unfocusing = props.has('focused') && !this.focused;
    if (unfocusing) {
      this.updateStrokeTransformOrigin();
    }

    super.update(props);
  }

  private updateStrokeTransformOrigin(event?: MouseEvent|TouchEvent) {
    let transformOrigin = '';
    if (event) {
      // Can't use instanceof TouchEvent since Firefox does not provide the
      // constructor globally.
      const isTouchEvent = 'touches' in event;
      const eventX = isTouchEvent ? event.touches[0].clientX : event.clientX;
      const rootRect = this.getBoundingClientRect();
      transformOrigin = `${eventX - rootRect.x}px`;
    }

    this.strokeTransformOrigin = transformOrigin;
  }
}
