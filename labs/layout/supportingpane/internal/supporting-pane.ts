/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { html, LitElement, PropertyValueMap } from 'lit';
import { property } from 'lit/decorators';

/**
 * The Supporting Pane Layout.
 */
export class SupportingPane extends LitElement {
  @property({ type: String, reflect: true })
  variant: 'compact' | 'medium' | 'expanded' = 'compact';

  @property({ type: Boolean, reflect: true })
  left: boolean = false;

  @property()
  mediumQuery: string = '(min-width: 600px)';

  @property()
  expandedQuery: string = '(min-width: 840px)';

  mediumMediaQuery: MediaQueryList;

  expandedMediaQuery: MediaQueryList;

  private _handleMediumChange({
    matches,
  }: MediaQueryList | MediaQueryListEvent) {
    if (matches) this.variant = 'medium';
  }

  private _handleExpandedChange({
    matches,
  }: MediaQueryList | MediaQueryListEvent) {
    if (matches) this.variant = 'expanded';
  }

  protected override firstUpdated() {
    this.mediumMediaQuery = window.matchMedia(this.mediumQuery);
    this.mediumMediaQuery.addEventListener('change', this._handleMediumChange);
    this._handleMediumChange(this.mediumMediaQuery);

    this.expandedMediaQuery = window.matchMedia(this.expandedQuery);
    this.expandedMediaQuery.addEventListener(
      'change',
      this._handleExpandedChange
    );
    this._handleExpandedChange(this.expandedMediaQuery);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.mediumMediaQuery.removeEventListener(
      'change',
      this._handleMediumChange
    );

    this.expandedMediaQuery.removeEventListener(
      'change',
      this._handleExpandedChange
    );
  }

  protected override render() {
    return html`
      <slot></slot>
      <slot name="supporting"></slot>
    `;
  }
}
