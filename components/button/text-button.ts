/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators';

import {styles as sharedStyles} from './lib/shared-styles.css';
import {TextButton} from './lib/text-button';
import {styles as textStyles} from './lib/text-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'md-text-button': MdTextButton;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-text-button')
export class MdTextButton extends TextButton {
  static override styles = [sharedStyles, textStyles];
}
