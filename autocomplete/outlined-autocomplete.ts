/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../field/outlined-field.js';
import './autocomplete-list.js';
import './autocomplete-surface.js';

import {customElement} from 'lit/decorators.js';
import {ClassInfo} from 'lit/directives/class-map.js';
import {literal} from 'lit/static-html.js';

import {styles as outlinedForcedColorsStyles} from '../textfield/lib/outlined-forced-colors-styles.css.js';
import {styles as outlinedStyles} from '../textfield/lib/outlined-styles.css.js';
import {styles as sharedStyles} from '../textfield/lib/shared-styles.css.js';

import {Autocomplete} from './lib/autocomplete.js';
import {styles as autocompleteStyles} from './lib/outlined-styles.css.js';
import {styles as sharedAutocompleteStyles} from './lib/shared-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-outlined-autocomplete': MdOutlinedAutocomplete;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-outlined-autocomplete')
export class MdOutlinedAutocomplete extends Autocomplete {
  static override styles = [
    sharedStyles, outlinedStyles, outlinedForcedColorsStyles,
    sharedAutocompleteStyles, autocompleteStyles
  ];

  protected override readonly listTag = literal`md-autocomplete-list`;
  protected override readonly menuSurfaceTag = literal`md-autocomplete-surface`;
  protected override readonly fieldTag = literal`md-outlined-field`;

  /** @soyTemplate */
  protected override getAutocompleteRenderClasses(): ClassInfo {
    return {
      ...super.getAutocompleteRenderClasses(),
      'md3-autocomplete--outlined': true,
    };
  }

  /** @soyTemplate */
  protected override getRenderClasses(): ClassInfo {
    return {
      ...super.getRenderClasses(),
      'md3-text-field--outlined': true,
    };
  }
}
