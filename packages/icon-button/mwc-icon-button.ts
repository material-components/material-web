/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore


import {customElement} from 'lit/decorators.js';

import {IconButtonBase} from './mwc-icon-button-base';
import {styles} from './mwc-icon-button.css';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-icon-button': IconButton;
  }
}

/** @soyCompatible */
@customElement('mwc-icon-button')
export class IconButton extends IconButtonBase {
  static override styles = [styles];
}
