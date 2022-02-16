/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {TabScroller} from './lib/tab-scroller';
import {styles} from './lib/tab-scroller-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-tab-scroller': TabScroller;
  }
}

@customElement('mwc-tab-scroller')
export class MdTabScroller extends TabScroller {
  static override styles = [styles];
}
