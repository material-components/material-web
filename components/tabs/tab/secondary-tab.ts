/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators';

import {SecondaryTab} from './lib/secondary-tab';
import {styles} from './lib/tab-styles.css';

export {TabInteractionEventDetail} from './lib/tab';

declare global {
  interface HTMLElementTagNameMap {
    'md-secondary-tab': SecondaryTab;
  }
}

@customElement('md-secondary-tab')
export class MdSecondaryTab extends SecondaryTab {
  static override styles = [styles];
}
