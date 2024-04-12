/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {CSSResultOrNative} from 'lit';
import {customElement} from 'lit/decorators.js';

import {Card} from './internal/card.js';
import {styles as outlinedStyles} from './internal/outlined-styles.js';
import {styles as sharedStyles} from './internal/shared-styles.js';

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
  static override styles: CSSResultOrNative[] = [sharedStyles, outlinedStyles];
}
