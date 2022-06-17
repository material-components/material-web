/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators';

import {NavigationDrawerModal} from './lib/navigation-drawer-modal';
import {styles} from './lib/navigation-drawer-modal-styles.css';

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
  static override readonly styles = [styles];
}
