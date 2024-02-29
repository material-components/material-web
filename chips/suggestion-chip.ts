/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {CSSResultOrNative} from 'lit';
import {customElement} from 'lit/decorators.js';

import {styles as elevatedStyles} from './internal/elevated-styles.js';
import {styles as sharedStyles} from './internal/shared-styles.js';
import {SuggestionChip} from './internal/suggestion-chip.js';
import {styles} from './internal/suggestion-styles.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-suggestion-chip': MdSuggestionChip;
  }
}

/**
 * TODO(b/243982145): add docs
 *
 * @final
 * @suppress {visibility}
 */
@customElement('md-suggestion-chip')
export class MdSuggestionChip extends SuggestionChip {
  static override styles: CSSResultOrNative[] = [sharedStyles, elevatedStyles, styles];
}
