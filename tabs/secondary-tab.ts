/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {CSSResultOrNative} from 'lit';
import {customElement} from 'lit/decorators.js';

import {SecondaryTab} from './internal/secondary-tab.js';
import {styles as secondaryStyles} from './internal/secondary-tab-styles.js';
import {styles as sharedStyles} from './internal/tab-styles.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-secondary-tab': MdSecondaryTab;
  }
}

// TODO(b/267336507): add docs
/**
 * @summary Tab allow users to display a tab within a Tabs.
 *
 * @final
 * @suppress {visibility}
 */
@customElement('md-secondary-tab')
export class MdSecondaryTab extends SecondaryTab {
  static override styles: CSSResultOrNative[] = [sharedStyles, secondaryStyles];
}
