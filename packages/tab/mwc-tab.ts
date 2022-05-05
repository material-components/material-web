/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore

import {customElement} from 'lit/decorators.js';

import {TabBase} from './mwc-tab-base.js';
import {styles} from './mwc-tab.css.js';

export {TabInteractionEventDetail} from './mwc-tab-base.js';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-tab': Tab;
  }
}

@customElement('mwc-tab')
export class Tab extends TabBase {
  static override styles = [styles];
}
