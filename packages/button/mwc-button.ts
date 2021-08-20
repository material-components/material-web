/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore

import {customElement} from 'lit-element';

import {ButtonBase} from './mwc-button-base';
import {styles} from './styles.css';

/** @soyCompatible */
@customElement('mwc-button')
export class Button extends ButtonBase {
  static override styles = [styles];
}

declare global {
  interface HTMLElementTagNameMap {
    'mwc-button': Button;
  }
}
