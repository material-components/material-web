/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';
import {BadgeElement} from './badge-element.js';

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
export class Badge extends BadgeElement {}
