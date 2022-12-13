/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {Checkbox} from './lib/checkbox.js';
import {styles} from './lib/checkbox-styles.css.js';
import {styles as forcedColorsStyles} from './lib/forced-colors-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-checkbox': MdCheckbox;
  }
}

/**
 * Checkboxes allow users to select one or more items from a set. Checkboxes can
 * turn an option on or off.
 */
@customElement('md-checkbox')
export class MdCheckbox extends Checkbox {
  static override styles = [styles, forcedColorsStyles];
}
