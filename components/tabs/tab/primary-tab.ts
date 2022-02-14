/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators';

import {PrimaryTab} from './lib/primary-tab';
import {styles} from './lib/tab-styles.css';

export {TabInteractionEventDetail} from './lib/tab';

declare global {
  interface HTMLElementTagNameMap {
    'md-primary-tab': PrimaryTab;
  }
}

@customElement('md-primary-tab')
export class MdPrimaryTab extends PrimaryTab {
  static override styles = [styles];
}
