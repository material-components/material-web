/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {CSSResultOrNative} from 'lit';
import {customElement} from 'lit/decorators.js';

import {Tabs} from './internal/tabs.js';
import {styles} from './internal/tabs-styles.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-tabs': MdTabs;
  }
}

// TODO(b/267336507): add docs
/**
 * @summary Tabs displays a list of selectable tabs.
 *
 * @final
 * @suppress {visibility}
 */
@customElement('md-tabs')
export class MdTabs extends Tabs {
  static override styles: CSSResultOrNative[] = [styles];
}
