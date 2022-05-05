/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore


import {customElement} from 'lit/decorators.js';

import {SelectBase} from './mwc-select-base.js';
import {styles} from './mwc-select.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-select': Select;
  }
}

@customElement('mwc-select')
export class Select extends SelectBase {
  static override styles = [styles];
}
