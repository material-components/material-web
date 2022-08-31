/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, PropertyValues, TemplateResult} from 'lit';
import {state} from 'lit/decorators.js';
import {ClassInfo} from 'lit/directives/class-map.js';
import {styleMap} from 'lit/directives/style-map.js';

import {Field} from './field.js';

/** @soyCompatible */
export class FilledField extends Field {
  @state() protected strokeTransformOrigin = '';

  /** @soyTemplate */
  protected override getRenderClasses(): ClassInfo {
    return {
      ...super.getRenderClasses(),
      'md3-field--filled': true,
    };
  }

  /** @soyTemplate */
  protected override renderContainer(): TemplateResult {
    return html`
      <span class="md3-field__container" @click=${this.handleClick}>
        ${this.renderContainerContents()}
      </span>
    `;
  }

  /** @soyTemplate */
  protected override renderContainerContents(): TemplateResult {
    /** @styleMap */
    const strokeStyle = {transformOrigin: this.strokeTransformOrigin};
    return html`
      <span class="md3-field__state-layer"></span>
      ${super.renderContainerContents()}
      <span class="md3-field__active-indicator"
        style="${styleMap(strokeStyle)}"></span>
    `;
  }

  /** @soyTemplate */
  protected override renderMiddleContents(): TemplateResult {
    return html`
      ${this.renderFloatingLabel()}
      ${this.renderRestingLabel()}
      ${super.renderMiddleContents()}
    `;
  }

  /** @bubbleWizEvent */
  protected handleClick(event: MouseEvent|TouchEvent) {
    if (this.disabled) {
      return;
    }

    this.updateStrokeTransformOrigin(event);
  }

  protected override update(props: PropertyValues<this>) {
    // Upon losing focus, the stroke resets to expanding from the center, such
    // as when re-focusing with a keyboard.
    const unfocusing = props.has('focused') && !this.focused;
    if (unfocusing) {
      this.updateStrokeTransformOrigin();
    }

    super.update(props);
  }

  protected async updateStrokeTransformOrigin(event?: MouseEvent|TouchEvent) {
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
