/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, html, isServer, LitElement} from 'lit';
import {property} from 'lit/decorators.js';

import {queryAssociatedById} from '../../aria/query-associated.js';
import {
  internals,
  mixinElementInternals,
} from '../../behaviors/element-internals.js';
import {mixinFocusable} from '../../behaviors/focusable.js';

const baseClass = mixinFocusable(mixinElementInternals(LitElement));

/**
 * An ARIA tabpanel element.
 */
export class AriaTabpanelElement extends baseClass {
  static override styles = css`
    :host(:not([hidden])) {
      display: block;
    }
  `;

  /**
   * ID of the tab element that controls this tabpanel.
   */
  @property({type: String, reflect: true, noAccessor: true})
  get tab(): string {
    return this.tabElement?.id || '';
  }
  set tab(value: string) {
    this.tabElement = queryAssociatedById(this, value);
  }

  /**
   * The tab element that controls this tabpanel.
   */
  get tabElement(): Element | null {
    return this[internals].ariaLabelledByElements?.[0] || null;
  }
  set tabElement(value: Element | null) {
    this[internals].ariaLabelledByElements = value ? [value] : [];
  }

  constructor() {
    super();
    if (isServer) return;
    this[internals].role = 'tabpanel';
  }

  protected override render() {
    return html`<slot></slot>`;
  }
}
