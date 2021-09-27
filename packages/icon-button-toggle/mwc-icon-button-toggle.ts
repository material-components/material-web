/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore


import {styles} from '@material/mwc-icon-button/mwc-icon-button.css';
import {customElement} from 'lit/decorators.js';

import {IconButtonToggleBase} from './mwc-icon-button-toggle-base';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-icon-button-toggle': IconButtonToggle;
  }
}

@customElement('mwc-icon-button-toggle')
export class IconButtonToggle extends IconButtonToggleBase {
  static override styles = [styles];
}
