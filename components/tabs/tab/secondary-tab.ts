/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators';

import {SecondaryTab} from './lib/secondary-tab';
import {styles as secondaryStyles} from './lib/secondary-tab-styles.css';
import {styles as sharedStyles} from './lib/shared-styles.css';

export {TabInteractionEventDetail} from './lib/tab';

declare global {
  interface HTMLElementTagNameMap {
    'md-secondary-tab': SecondaryTab;
  }
}

@customElement('md-secondary-tab')
export class MdSecondaryTab extends SecondaryTab {
  static override styles = [sharedStyles, secondaryStyles];
}
