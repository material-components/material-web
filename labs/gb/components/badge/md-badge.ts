/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, CSSResultOrNative, html, LitElement} from 'lit';
import {customElement} from 'lit/decorators.js';
import {badge} from './badge.js';
import {styles as badgeStyles} from './badge.cssresult.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design badge component. */
    'md-gb-badge': Badge;
  }
}

/**
 * A Material Design badge component.
 */
@customElement('md-gb-badge')
export class Badge extends LitElement {
  static override styles: CSSResultOrNative[] = [
    badgeStyles,
    css`
      :host {
        display: inline-flex;
      }
      .badge {
        flex: 1;
      }
    `,
  ];

  protected override render() {
    return html`<div part="badge" class="${badge()}">
      <slot></slot>
    </div>`;
  }
}
