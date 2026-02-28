/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {CSSResultOrNative} from 'lit';
import {customElement} from 'lit/decorators.js';

import {ElevatedButton} from './internal/elevated-button.js';
import {styles as elevatedStyles} from './internal/elevated-styles.js';
import {styles as sharedElevationStyles} from './internal/shared-elevation-styles.js';
import {styles as sharedStyles} from './internal/shared-styles.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-elevated-button': MdElevatedButton;
  }
}

/**
 * @summary Buttons help people take action, such as sending an email, sharing a
 * document, or liking a comment.
 *
 * @description
 * __Emphasis:__ Medium emphasis – For important actions that don’t distract
 * from other onscreen elements.
 *
 * __Rationale:__ Elevated buttons are essentially filled buttons with a lighter
 * background color and a shadow. To prevent shadow creep, only use them when
 * absolutely necessary, such as when the button requires visual separation from
 * a patterned background.
 *
 * __Example usages:__
 * - Reply
 * - View all
 * - Add to cart
 * - Take out of trash
 *
 * @final
 * @suppress {visibility}
 */
@customElement('md-elevated-button')
export class MdElevatedButton extends ElevatedButton {
  static override styles: CSSResultOrNative[] = [
    sharedStyles,
    sharedElevationStyles,
    elevatedStyles,
  ];
}
