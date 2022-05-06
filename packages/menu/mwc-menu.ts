/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore


import {customElement} from 'lit/decorators.js';

import {MenuBase} from './mwc-menu-base.js';
import {styles} from './mwc-menu.css.js';

export {createSetFromIndex, isEventMulti, isIndexSet, MWCListIndex} from '@material/mwc-list/mwc-list-foundation.js';
export {DefaultFocusState} from './mwc-menu-base.js';
export {Corner, MenuCorner} from './mwc-menu-surface-base.js';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-menu': MenuBase;
  }
}

@customElement('mwc-menu')
export class Menu extends MenuBase {
  static override styles = [styles];
}
