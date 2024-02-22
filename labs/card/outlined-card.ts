/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {CSSResult} from 'lit';
import {customElement} from 'lit/decorators.js';

import {Card} from './internal/card.js';
import {styles as outlinedStyles} from './internal/outlined-styles.css.js';
import {styles as sharedStyles} from './internal/shared-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-outlined-card': MdOutlinedCard;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('md-outlined-card')
export class MdOutlinedCard extends Card {
  static override styles: CSSResult[] = [sharedStyles, outlinedStyles];
}
