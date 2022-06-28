/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators';

import {Tabs} from './lib/tabs';

declare global {
  interface HTMLElementTagNameMap {
    'md-tabs': MdTabs;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-tabs')
export class MdTabs extends Tabs {
}
