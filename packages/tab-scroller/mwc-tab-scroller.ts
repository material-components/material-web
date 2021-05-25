/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import {customElement} from 'lit-element';

import {TabScrollerBase} from './mwc-tab-scroller-base';
import {styles} from './mwc-tab-scroller.css';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-tab-scroller': TabScroller;
  }
}

@customElement('mwc-tab-scroller')
export class TabScroller extends TabScrollerBase {
  static styles = [styles];
}
