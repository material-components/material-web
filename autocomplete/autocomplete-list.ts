/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {styles} from '../list/lib/list-styles.css.js';

import {AutocompleteList} from './lib/autocompletelist/autocomplete-list.js';
import {styles as autocompleteStyles} from './lib/autocompletelist/autocomplete-list-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-autocomplete-list': MdAutocompleteList;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-autocomplete-list')
export class MdAutocompleteList extends AutocompleteList {
  static override styles = [styles, autocompleteStyles];
}
