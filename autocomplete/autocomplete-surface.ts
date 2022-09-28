/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {styles} from '../menusurface/lib/menu-surface-styles.css.js';

import {AutocompleteSurface} from './lib/autocompletesurface/autocomplete-surface.js';
import {styles as autocompleteStyles} from './lib/autocompletesurface/autocomplete-surface-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-autocomplete-surface': MdAutocompleteSurface;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-autocomplete-surface')
export class MdAutocompleteSurface extends AutocompleteSurface {
  static override styles = [styles, autocompleteStyles];
}
