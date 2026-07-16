/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, CSSResultOrNative, html, LitElement} from 'lit';
import {property} from 'lit/decorators.js';

import focusRingStyles from '../focus/focus-ring.css' with {type: 'css'}; // github-only
// import focusRingStyles from '../focus/focus-ring.cssresult.js'; // google3-only
import rippleStyles from '../ripple/ripple.css' with {type: 'css'}; // github-only
// import rippleStyles from '../ripple/ripple.cssresult.js'; // google3-only
import fabStyles from './fab.css' with {type: 'css'}; // github-only
// import {styles as fabStyles} from './fab.cssresult.js'; // google3-only

import {fab, type FabColor, type FabSize} from './fab.js';

/**
 * A Material Design fab component.
 *
 * @slot - Used to display an icon and optional label.
 * @csspart fab - The FAB's root element.
 * @cssprop --container-color
 * @cssprop --container-elevation
 * @cssprop --container-height
 * @cssprop --container-shape
 * @cssprop --icon-color
 * @cssprop --icon-label-space
 * @cssprop --icon-size
 * @cssprop --label-text
 * @cssprop --label-text-color
 * @cssprop --label-text-tracking
 * @cssprop --leading-space
 * @cssprop --trailing-space
 */
export class FabElement extends LitElement {
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
