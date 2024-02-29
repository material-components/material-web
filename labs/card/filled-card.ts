/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {CSSResultOrNative} from 'lit';
import {customElement} from 'lit/decorators.js';

import {Card} from './internal/card.js';
import {styles as filledStyles} from './internal/filled-styles.js';
import {styles as sharedStyles} from './internal/shared-styles.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-filled-card': MdFilledCard;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('md-filled-card')
export class MdFilledCard extends Card {
  static override styles: CSSResultOrNative[] = [sharedStyles, filledStyles];
}
