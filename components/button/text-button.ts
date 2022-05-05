/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {styles as sharedStyles} from './lib/shared-styles.css.js';
import {TextButton} from './lib/text-button.js';
import {styles as textStyles} from './lib/text-styles.css.js';

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
