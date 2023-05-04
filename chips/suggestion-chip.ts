/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {styles as elevatedStyles} from './lib/elevated-styles.css.js';
import {styles as sharedStyles} from './lib/shared-styles.css.js';
import {SuggestionChip} from './lib/suggestion-chip.js';
import {styles} from './lib/suggestion-styles.css.js';

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
  static override styles = [sharedStyles, elevatedStyles, styles];
}
