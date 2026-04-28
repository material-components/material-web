/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type CSSResultOrNative} from 'lit';
import {customElement} from 'lit/decorators.js';
import {Icon as IconBase} from '../../../../icon/internal/icon.js';

import iconStyles from './md-icon.css' with {type: 'css'}; // github-only
// import iconStyles from './md-icon.cssresult.js'; // google3-only

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design icon component. */
    'md-icon': Icon;
  }
}

/**
 * A Material Design icon component.
 */
@customElement('md-icon')
export class Icon extends IconBase {
  static override styles: CSSResultOrNative[] = [iconStyles];

  override connectedCallback() {
    super.connectedCallback();
    this.classList.add('md-icon');
  }
}
