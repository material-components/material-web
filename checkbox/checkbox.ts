/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators';

import {Checkbox} from './lib/checkbox';
import {styles} from './lib/checkbox-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'md-checkbox': MdCheckbox;
  }
}

/** @soyCompatible */
@customElement('md-checkbox')
export class MdCheckbox extends Checkbox {
  static override styles = [styles];
}
