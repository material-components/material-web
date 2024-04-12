/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {NavigationDrawerModal} from './internal/navigation-drawer-modal.js';
import {styles} from './internal/navigation-drawer-modal-styles.js';
import {styles as sharedStyles} from './internal/shared-styles.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-navigation-drawer-modal': MdNavigationDrawerModal;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('md-navigation-drawer-modal')
export class MdNavigationDrawerModal extends NavigationDrawerModal {
  static override readonly styles = [sharedStyles, styles];
}
