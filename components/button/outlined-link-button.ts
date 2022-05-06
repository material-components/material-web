/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {OutlinedLinkButton} from './lib/outlined-link-button.js';
import {styles as outlinedStyles} from './lib/outlined-styles.css.js';
import {styles as sharedStyles} from './lib/shared-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-outlined-link-button': MdOutlinedLinkButton;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-outlined-link-button')
export class MdOutlinedLinkButton extends OutlinedLinkButton {
  static override styles = [sharedStyles, outlinedStyles];
}
