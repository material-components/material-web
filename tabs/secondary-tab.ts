/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {SecondaryTab} from './internal/secondary-tab.js';
import {styles as secondaryStyles} from './internal/secondary-tab-styles.css.js';
import {styles as sharedStyles} from './internal/tab-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-secondary-tab': MdSecondaryTab;
  }
}

// TODO(b/267336507): add docs
/**
 * @summary Tab allow users to display a tab within a Tabs.
 *
 */
@customElement('md-secondary-tab')
export class MdSecondaryTab extends SecondaryTab {
  static override styles = [sharedStyles, secondaryStyles];
}
