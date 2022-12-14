/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement, TemplateResult} from 'lit';
import {property} from 'lit/decorators.js';
import {ClassInfo, classMap} from 'lit/directives/class-map.js';

/**
 * @summary An accessible, themable ring designed to be shown on
 * `:focus-visible`.
 *
 * @description
 * An accessible, themable ring designed to be shown on focus-visible.
 * Focus ring is designed to be controlled by the `strong-focus` module in the
 * same package.
 *
 * In most cases, `visible` should be set to
 * `shouldShowStrongFocus()` on `focus` and `pointerdown` (see `pointerPress()`
 * documentation in the `strong-focus` module), and `false` on `blur`.
 */
export class FocusRing extends LitElement {
  /**
   * Makes the focus ring visible.
   */
  @property({type: Boolean}) visible = false;

  protected override render(): TemplateResult {
    return html`<span class="md3-focus-ring ${
        classMap(this.getRenderClasses())}"></span>`;
  }

  protected getRenderClasses(): ClassInfo {
    return {
      'md3-focus-ring--visible': this.visible,
    };
  }
}
