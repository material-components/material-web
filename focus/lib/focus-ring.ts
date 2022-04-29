/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement, TemplateResult} from 'lit';
import {eventOptions, property} from 'lit/decorators';
import {ClassInfo, classMap} from 'lit/directives/class-map';

// TODO: Should strong-focus be moved into /lib?
import {pointerPress, shouldShowStrongFocus} from '../strong-focus';

/** @soyCompatible */
export class FocusRing extends LitElement {
  @property({type: Boolean}) visible = false;

  /** @soyTemplate */
  protected override render(): TemplateResult {
    return html`
    <span
        class="md3-focus-ring__container"
        @focusin="${this.handleFocus}"
        @focusout="${this.handleBlur}"
        @pointerdown="${this.handlePointerDown}">
      <span class="md3-focus-ring ${classMap(this.getRenderClasses())}"></span>
      <span><slot></slot></span>
    </span>
    `;
  }

  /** @soyTemplate */
  protected getRenderClasses(): ClassInfo {
    return {
      'md3-focus-ring--visible': this.visible,
    };
  }

  protected handleFocus() {
    this.visible = shouldShowStrongFocus();
  }

  protected handleBlur() {
    this.visible = false;
  }

  @eventOptions({passive: true})
  protected handlePointerDown(event: PointerEvent) {
    pointerPress();
  }
}
