/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {CSSResultOrNative} from 'lit';
import {customElement} from 'lit/decorators.js';

import {AssistChip} from './internal/assist-chip.js';
import {styles} from './internal/assist-styles.js';
import {styles as elevatedStyles} from './internal/elevated-styles.js';
import {styles as sharedStyles} from './internal/shared-styles.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-assist-chip': MdAssistChip;
  }
}

/**
 * TODO(b/243982145): add docs
 *
 * @final
 * @suppress {visibility}
 */
@customElement('md-assist-chip')
export class MdAssistChip extends AssistChip {
  static override styles: CSSResultOrNative[] = [sharedStyles, elevatedStyles, styles];
}
