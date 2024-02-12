/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { html, LitElement } from 'lit';
import { property } from 'lit/decorators';

/**
 * The Supporting Pane Layout.
 */
export class SupportingPane extends LitElement {
  @property({ type: String, reflect: true })
  variant: 'compact' | 'medium' | 'expanded' = 'expanded';

  @property({ type: Boolean, reflect: true })
  left: boolean = false;

  protected override render() {
    return html`
      <slot></slot>
      <slot name="supporting"></slot>
    `;
  }
}
