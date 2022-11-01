/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {NavigationDrawerModal} from './lib/navigation-drawer-modal.js';
import {styles} from './lib/navigation-drawer-modal-styles.css.js';
import {styles as sharedStyles} from './lib/shared-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-navigation-drawer-modal': MdNavigationDrawerModal;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-navigation-drawer-modal')
export class MdNavigationDrawerModal extends NavigationDrawerModal {
  static override readonly styles = [sharedStyles, styles];
}
