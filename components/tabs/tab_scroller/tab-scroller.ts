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
    'md-tab-scroller': TabScroller;
  }
}

@customElement('md-tab-scroller')
export class MdTabScroller extends TabScroller {
  static override styles = [styles];
}
