/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement, TemplateResult} from 'lit';
import {property} from 'lit/decorators.js';
import {ClassInfo, classMap} from 'lit/directives/class-map.js';

/** @soyCompatible */
export class FocusRing extends LitElement {
  @property({type: Boolean}) visible = false;

  /** @soyTemplate */
  protected override render(): TemplateResult {
    return html`<span class="md3-focus-ring ${
        classMap(this.getRenderClasses())}"></span>`;
  }

  /** @soyTemplate */
  protected getRenderClasses(): ClassInfo {
    return {
      'md3-focus-ring--visible': this.visible,
    };
  }
}
