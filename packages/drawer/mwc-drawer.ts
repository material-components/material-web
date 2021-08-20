/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore

import {customElement} from 'lit-element';

import {DrawerBase} from './mwc-drawer-base';
import {styles} from './mwc-drawer.css';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-drawer': Drawer;
  }
}

@customElement('mwc-drawer')
export class Drawer extends DrawerBase {
  static override styles = [styles];
}
