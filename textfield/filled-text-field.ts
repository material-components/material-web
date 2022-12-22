/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../field/filled-field.js';

import {customElement} from 'lit/decorators.js';
import {literal} from 'lit/static-html.js';

// TODO(b/236285090): update with HCM best practices
import {styles as filledForcedColorsStyles} from './lib/filled-forced-colors-styles.css.js';
import {styles as filledStyles} from './lib/filled-styles.css.js';
import {FilledTextField} from './lib/filled-text-field.js';
import {styles as sharedStyles} from './lib/shared-styles.css.js';

export {TextFieldType} from './lib/text-field.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-filled-text-field': MdFilledTextField;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-filled-text-field')
export class MdFilledTextField extends FilledTextField {
  static override styles =
      [sharedStyles, filledStyles, filledForcedColorsStyles];

  protected override readonly fieldTag = literal`md-filled-field`;
}
