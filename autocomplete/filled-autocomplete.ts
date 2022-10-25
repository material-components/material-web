/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../field/filled-field.js';
import './autocomplete-list.js';
import './autocomplete-surface.js';

import {customElement} from 'lit/decorators.js';
import {ClassInfo} from 'lit/directives/class-map.js';
import {literal} from 'lit/static-html.js';

import {styles as filledForcedColorsStyles} from '../textfield/lib/filled-forced-colors-styles.css.js';
import {styles as filledStyles} from '../textfield/lib/filled-styles.css.js';
import {styles as sharedStyles} from '../textfield/lib/shared-styles.css.js';

import {Autocomplete} from './lib/autocomplete.js';
import {styles as autocompleteStyles} from './lib/filled-styles.css.js';
import {styles as sharedAutocompleteStyles} from './lib/shared-styles.css.js';

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
  static override styles = [
    sharedStyles, filledStyles, filledForcedColorsStyles,
    sharedAutocompleteStyles, autocompleteStyles
  ];

  protected override readonly listTag = literal`md-autocomplete-list`;
  protected override readonly menuSurfaceTag = literal`md-autocomplete-surface`;
  protected override readonly fieldTag = literal`md-filled-field`;

  /** @soyTemplate */
  protected override getAutocompleteRenderClasses(): ClassInfo {
    return {
      ...super.getAutocompleteRenderClasses(),
      'md3-autocomplete--filled': true,
    };
  }

  /** @soyTemplate */
  protected override getRenderClasses(): ClassInfo {
    return {
      ...super.getRenderClasses(),
      'md3-text-field--filled': true,
    };
  }
}
