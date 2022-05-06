/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore


import {customElement} from 'lit/decorators.js';

import {ListBase} from './mwc-list-base.js';
import {styles} from './mwc-list.css.js';

export {ActionDetail, createSetFromIndex, IndexDiff, isEventMulti, isIndexSet, MultiSelectedEvent, MWCListIndex, SelectedDetail, SelectedEvent, SingleSelectedEvent} from './mwc-list-foundation.js';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-list': List;
  }
}

@customElement('mwc-list')
export class List extends ListBase {
  static override styles = [styles];
}
