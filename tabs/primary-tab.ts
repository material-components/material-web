/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {PrimaryTab} from './internal/primary-tab.js';
import {styles as primaryStyles} from './internal/primary-tab-styles.css.js';
import {styles as sharedStyles} from './internal/tab-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-primary-tab': MdPrimaryTab;
  }
}

// TODO(b/267336507): add docs
/**
 * @summary Tab allow users to display a tab within a Tabs.
 *
 */
@customElement('md-primary-tab')
export class MdPrimaryTab extends PrimaryTab {
  static override styles = [sharedStyles, primaryStyles];
}
