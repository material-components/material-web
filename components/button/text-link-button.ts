/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {styles as sharedStyles} from './lib/shared-styles.css.js';
import {TextLinkButton} from './lib/text-link-button.js';
import {styles as textStyles} from './lib/text-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-text-link-button': MdTextLinkButton;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-text-link-button')
export class MdTextLinkButton extends TextLinkButton {
  static override styles = [sharedStyles, textStyles];
}
