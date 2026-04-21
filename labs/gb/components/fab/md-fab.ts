/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, CSSResultOrNative, html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import focusRingStyles from '@material/web/labs/gb/components/focus/focus-ring.cssresult.js';
import rippleStyles from '@material/web/labs/gb/components/ripple/ripple.cssresult.js';
import fabStyles from './fab.cssresult.js';

import {fab, type FabColor, type FabSize} from './fab.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design fab component. */
    'md-fab': Fab;
  }
}

/**
 * A Material Design fab component.
 */
@customElement('md-fab')
export class Fab extends LitElement {
  static override styles: CSSResultOrNative[] = [
    focusRingStyles,
    rippleStyles,
    fabStyles,
    css`
      :host {
        display: inline-flex;
      }
      .fab {
        flex: 1;
      }
    `,
  ];

  @property() color: FabColor = 'primary-container';
  @property() size: FabSize = 'default';

  protected override render() {
    return html`<button
      part="fab"
      class="${fab({color: this.color, size: this.size})}">
      <slot></slot>
    </button>`;
  }
}
