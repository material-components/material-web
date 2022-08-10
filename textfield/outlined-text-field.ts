/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/field/outlined-field';

import {customElement} from 'lit/decorators';
import {literal} from 'lit/static-html';

// TODO(b/236285090): update with HCM best practices
import {styles as outlinedForcedColorsStyles} from './lib/outlined-forced-colors-styles.css';
import {styles as outlinedStyles} from './lib/outlined-styles.css';
import {OutlinedTextField} from './lib/outlined-text-field';
import {styles as sharedStyles} from './lib/shared-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'md-outlined-text-field': MdOutlinedTextField;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-outlined-text-field')
export class MdOutlinedTextField extends OutlinedTextField {
  static override styles =
      [sharedStyles, outlinedStyles, outlinedForcedColorsStyles];

  protected override readonly fieldTag = literal`md-outlined-field`;
}
