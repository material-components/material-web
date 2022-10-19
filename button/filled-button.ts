/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {FilledButton} from './lib/filled-button.js';
import {styles as filledStyles} from './lib/filled-styles.css.js';
import {styles as sharedElevationStyles} from './lib/shared-elevation-styles.css.js';
import {styles as sharedStyles} from './lib/shared-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-filled-button': MdFilledButton;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-filled-button')
export class MdFilledButton extends FilledButton {
  static override styles = [sharedStyles, sharedElevationStyles, filledStyles];
}
