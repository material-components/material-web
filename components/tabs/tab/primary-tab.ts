/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators';

import {PrimaryTab} from './lib/primary-tab';
import {styles as primaryStyles} from './lib/primary-tab-styles.css';
import {styles as sharedStyles} from './lib/shared-styles.css';

export {TabInteractionEventDetail} from './lib/tab';

declare global {
  interface HTMLElementTagNameMap {
    'md-primary-tab': PrimaryTab;
  }
}

@customElement('md-primary-tab')
export class MdPrimaryTab extends PrimaryTab {
  static override styles = [sharedStyles, primaryStyles];
}
