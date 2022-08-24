/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {MenuSurface} from './lib/menu-surface.js';
import {styles} from './lib/menu-surface-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-menu-surface': MdMenuSurface;
  }
}

@customElement('md-menu-surface')
export class MdMenuSurface extends MenuSurface {
  static override styles = [styles];
}
