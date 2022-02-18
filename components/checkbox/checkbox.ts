/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore

import {customElement} from 'lit/decorators.js';

import {Checkbox} from './lib/checkbox';
import {styles} from './lib/checkbox-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'md-checkbox': Checkbox;
  }
}

/** @soyCompatible */
@customElement('md-checkbox')
export class MdCheckbox extends Checkbox {
  static override styles = [styles];
}
