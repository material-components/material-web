/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {CSSResultOrNative} from 'lit';
import {customElement} from 'lit/decorators.js';

import {Switch} from './internal/switch.js';
import {styles} from './internal/switch-styles.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-switch': MdSwitch;
  }
}

/**
 * @summary Switches toggle the state of a single item on or off.
 *
 * @description
 * There's one type of switch in Material. Use this selection control when the
 * user needs to toggle a single item on or off.
 *
 * @final
 * @suppress {visibility}
 */
@customElement('md-switch')
export class MdSwitch extends Switch {
  static override styles: CSSResultOrNative[] = [styles];
}
