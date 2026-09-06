/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {CSSResultOrNative} from 'lit';
import {customElement} from 'lit/decorators.js';

import {NavigationRail} from './internal/navigation-rail.js';
import {styles} from './internal/navigation-rail-styles.cssresult.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-navigation-rail': MdNavigationRail;
  }
}

/**
 * A vertical navigation component for switching between top-level destinations.
 *
 * @slot - Navigation tabs.
 * @fires navigation-bar-activated
 */
@customElement('md-navigation-rail')
export class MdNavigationRail extends NavigationRail {
  static override styles: CSSResultOrNative[] = [styles];
}
