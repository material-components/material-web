/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import {customElement} from 'lit-element';

import {ButtonBase} from './mwc-button-base';
import {styles} from './styles.css';

/** @soyCompatible */
@customElement('mwc-button')
export class Button extends ButtonBase {
  static styles = styles;
}

declare global {
  interface HTMLElementTagNameMap {
    'mwc-button': Button;
  }
}
