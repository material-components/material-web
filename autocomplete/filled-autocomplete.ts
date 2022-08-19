/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/list/list.js';
import '@material/web/menu-surface/menu-surface.js';
import '@material/web/textfield/filled-text-field.js';

import {customElement} from 'lit/decorators.js';
import {literal} from 'lit/static-html.js';

import {Autocomplete} from './lib/autocomplete.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-filled-autocomplete': MdFilledAutocomplete;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-filled-autocomplete')
export class MdFilledAutocomplete extends Autocomplete {
  protected override readonly listTag = literal`md-list`;
  protected override readonly menuSurfaceTag = literal`md-menu-surface`;
  protected override readonly textFieldTag = literal`md-filled-text-field`;
}
