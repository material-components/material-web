/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/list/list.js';
import '@material/web/menu-surface/menu-surface.js';
import '@material/web/field/filled-field.js';

import {customElement} from 'lit/decorators.js';
import {literal} from 'lit/static-html.js';

import {styles as filledForcedColorsStyles} from '../textfield/lib/filled-forced-colors-styles.css.js';
import {styles as filledStyles} from '../textfield/lib/filled-styles.css.js';
import {styles as sharedStyles} from '../textfield/lib/shared-styles.css.js';

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
  static override styles =
      [sharedStyles, filledStyles, filledForcedColorsStyles];

  protected override readonly listTag = literal`md-list`;
  protected override readonly menuSurfaceTag = literal`md-menu-surface`;
  protected override readonly fieldTag = literal`md-filled-field`;
}
