/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore

import {customElement} from 'lit-element';

import {FabBase} from './mwc-fab-base';
import {styles} from './mwc-fab.css';

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
