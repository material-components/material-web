/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {styles} from '../list/lib/listitem/list-item-styles.css.js';

import {AutocompleteItem} from './lib/autocompleteitem/autocomplete-item.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-autocomplete-item': MdAutocompleteItem;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-autocomplete-item')
export class MdAutocompleteItem extends AutocompleteItem {
  static override styles = [styles];
}
