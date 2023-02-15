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
    this.addEventListener('click', this.handleClick);
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

  protected override renderContainerContents() {
    const strokeStyle = {transformOrigin: this.strokeTransformOrigin};
    return html`
      <span class="md3-field__state-layer"></span>
      ${super.renderContainerContents()}
      <span class="md3-field__active-indicator"
        style="${styleMap(strokeStyle)}"></span>
    `;
  }

  protected override renderMiddleContents() {
    return html`
      ${this.renderFloatingLabel()}
      ${this.renderRestingLabel()}
      ${super.renderMiddleContents()}
    `;
  }

  private readonly handleClick = (event: MouseEvent|TouchEvent) => {
    if (this.disabled) {
      return;
    }

    this.updateStrokeTransformOrigin(event);
  };

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
