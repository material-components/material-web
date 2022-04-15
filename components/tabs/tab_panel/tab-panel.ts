/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators';

import {TabPanel} from './lib/tab-panel';
import {styles} from './lib/tab-panel-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'md-tab-panel': MdTabPanel;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-tab-panel')
export class MdTabPanel extends TabPanel {
  static override styles = [styles];
}
