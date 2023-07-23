/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import './tab.js';

import {customElement} from 'lit/decorators.js';

import {Tabs} from './lib/tabs.js';
import {styles} from './lib/tabs-styles.css.js';

export {MdTab, TabVariant} from './tab.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-tabs': MdTabs;
  }
}

// TODO(b/267336507): add docs
/**
 * @summary Tabs displays a list of selectable tabs.
 *
 */
@customElement('md-tabs')
export class MdTabs extends Tabs {
  static override styles = [styles];
}
