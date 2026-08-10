/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  css,
  CSSResultOrNative,
  html,
  LitElement,
} from 'lit';

import toolbarStyles from './toolbar.css' with {type: 'css'}; // github-only
// import toolbarStyles from './toolbar.cssresult.js'; // google3-only

/**
 * A Material Design gBreeze toolbar separator custom element (`md-gb-toolbar-separator`).
 *
 * @csspart separator - The separator element.
 */
export class ToolbarSeparatorElement extends LitElement {
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    toolbarStyles,
    css`
      :host {
        align-self: center;
        display: inline-flex;
      }
    `,
  ];

  protected override render() {
    return html`
      <div
        part="separator"
        class="toolbar-separator"
        role="separator"></div>
    `;
  }
}
