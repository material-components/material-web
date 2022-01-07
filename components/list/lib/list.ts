/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement, TemplateResult} from 'lit';

/** @soyCompatible */
export class List extends LitElement {
  static override shadowRootOptions:
      ShadowRootInit = {mode: 'open', delegatesFocus: true};

  /** @soyTemplate */
  override render(): TemplateResult {
    return html`
      <ul tabindex="0" class="md3-list">
        <slot></slot>
      </ul>
    `;
  }
}
