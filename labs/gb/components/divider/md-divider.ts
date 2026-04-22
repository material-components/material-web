/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, CSSResultOrNative, html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import dividerStyles from './divider.css' with {type: 'css'}; // github-only
// import {styles as dividerStyles} from './divider.cssresult.js'; // google3-only

import {divider} from './divider.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design divider component. */
    'md-divider': Divider;
  }
}

/**
 * A Material Design divider component.
 */
@customElement('md-divider')
export class Divider extends LitElement {
  static override styles: CSSResultOrNative[] = [
    dividerStyles,
    css`
      :host {
        display: flex;
      }
      .divider {
        flex: 1;
      }
      :host(:not([vertical])) {
        width: 100%;
      }
      :host([vertical]) {
        min-height: 100%;
      }
    `,
  ];

  /**
   * Whether or not the divider is vertical.
   */
  @property({type: Boolean, reflect: true}) vertical = false;

  protected override render() {
    return html`<div part="divider" class="${divider(this)}"></div>`;
  }
}
