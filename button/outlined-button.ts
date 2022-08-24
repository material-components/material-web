/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {OutlinedButton} from './lib/outlined-button.js';
import {styles as outlinedStyles} from './lib/outlined-styles.css.js';
import {styles as sharedStyles} from './lib/shared-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-outlined-button': MdOutlinedButton;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-outlined-button')
export class MdOutlinedButton extends OutlinedButton {
  static override styles = [sharedStyles, outlinedStyles];
}
