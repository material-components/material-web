/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {CSSResultOrNative} from 'lit';
import {customElement} from 'lit/decorators.js';

import {PrimaryTab} from './internal/primary-tab.js';
import {styles as primaryStyles} from './internal/primary-tab-styles.js';
import {styles as sharedStyles} from './internal/tab-styles.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-primary-tab': MdPrimaryTab;
  }
}

// TODO(b/267336507): add docs
/**
 * @summary Tab allow users to display a tab within a Tabs.
 *
 * @final
 * @suppress {visibility}
 */
@customElement('md-primary-tab')
export class MdPrimaryTab extends PrimaryTab {
  static override styles: CSSResultOrNative[] = [sharedStyles, primaryStyles];
}
