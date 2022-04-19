/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement, TemplateResult} from 'lit';

/** @soyCompatible */
export class Icon extends LitElement {
  /** @soyTemplate */
  protected override render(): TemplateResult {
    return html`<span><slot></slot></span>`;
  }
}
