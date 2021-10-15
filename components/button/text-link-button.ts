/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators';

import {styles as sharedStyles} from './lib/shared-styles.css';
import {TextLinkButton} from './lib/text-link-button';
import {styles as textStyles} from './lib/text-styles.css';

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
