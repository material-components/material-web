/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {Card} from './internal/card.js';
import {styles as elevatedStyles} from './internal/elevated-styles.css.js';
import {styles as sharedStyles} from './internal/shared-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-elevated-card': MdElevatedCard;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('md-elevated-card')
export class MdElevatedCard extends Card {
  static override styles = [sharedStyles, elevatedStyles];
}
