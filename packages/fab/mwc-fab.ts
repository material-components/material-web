/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore

import {customElement} from 'lit/decorators.js';

import {FabBase} from './mwc-fab-base.js';
import {styles} from './mwc-fab.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-fab': Fab;
  }
}

/** @soyCompatible */
@customElement('mwc-fab')
export class Fab extends FabBase {
  static override styles = [styles];
}
