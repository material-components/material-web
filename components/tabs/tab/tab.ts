/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore

import {customElement} from 'lit/decorators.js';

import {TabBase} from './lib/tab';
import {styles} from './lib/tab-styles.css';

export {TabInteractionEventDetail} from './lib/tab';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-tab': Tab;
  }
}

@customElement('mwc-tab')
export class Tab extends TabBase {
  static override styles = [styles];
}
