/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {Tab} from './lib/tab.js';
import {styles} from './lib/tab-styles.css.js';

export {Variant} from './lib/tab.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-tab': MdTab;
  }
}

// TODO(b/267336507): add docs
/**
 * @summary Tab allow users to display a tab within a Tabs.
 *
 */
@customElement('md-tab')
export class MdTab extends Tab {
  static override styles = [styles];
}
