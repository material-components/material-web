/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  internals,
  mixinElementInternals,
} from '@material/web/labs/behaviors/element-internals.js';
import {css, CSSResultOrNative, html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import listStyles from './list.cssresult.js';

import {list} from './list.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design list component. */
    'md-list': List;
  }
}

// Separate variable needed for closure.
const baseClass = mixinElementInternals(LitElement);

/**
 * A Material Design list component.
 */
@customElement('md-list')
export class List extends baseClass {
  static override styles: CSSResultOrNative[] = [
    listStyles,
    css`
      :host {
        display: flex;
      }
      .list {
        flex: 1;
      }
    `,
  ];

  constructor() {
    super();
    this[internals].role = 'list';
  }

  /**
   * Whether to render the list with segmented items.
   */
  @property({type: Boolean}) segmented = false;

  protected override render() {
    return html`<div part="list" class="${list(this)}">
      <slot></slot>
    </div>`;
  }
}
