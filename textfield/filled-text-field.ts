/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/field/filled-field';

import {customElement} from 'lit/decorators';
import {literal} from 'lit/static-html';

// TODO(b/236285090): update with HCM best practices
import {styles as filledForcedColorsStyles} from './lib/filled-forced-colors-styles.css';
import {styles as filledStyles} from './lib/filled-styles.css';
import {FilledTextField} from './lib/filled-text-field';
import {styles as sharedStyles} from './lib/shared-styles.css';

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
