/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import {customElement} from 'lit-element';

import {CheckboxBase} from './mwc-checkbox-base';
import {style} from './mwc-checkbox-css';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-checkbox': Checkbox;
  }
}

/** @soyCompatible */
@customElement('mwc-checkbox')
export class Checkbox extends CheckboxBase {
  static styles = style;
}
