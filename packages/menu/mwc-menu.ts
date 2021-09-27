/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore


import {customElement} from 'lit/decorators.js';

import {MenuBase} from './mwc-menu-base';
import {styles} from './mwc-menu.css';

export {createSetFromIndex, isEventMulti, isIndexSet, MWCListIndex} from '@material/mwc-list/mwc-list-foundation';
export {DefaultFocusState} from './mwc-menu-base';
export {Corner, MenuCorner} from './mwc-menu-surface-base';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-menu': MenuBase;
  }
}

@customElement('mwc-menu')
export class Menu extends MenuBase {
  static override styles = [styles];
}
