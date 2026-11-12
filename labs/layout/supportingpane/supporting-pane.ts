/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { customElement } from 'lit/decorators.js';

import { SupportingPane } from './internal/supporting-pane.js';
import { styles } from './internal/supporting-pane-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-supporting-pane': MDSupportingPane;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('md-supporting-pane')
export class MDSupportingPane extends SupportingPane {
  static override styles = [styles];
}
