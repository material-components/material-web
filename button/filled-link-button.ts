/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {FilledLinkButton} from './lib/filled-link-button.js';
import {styles as filledStyles} from './lib/filled-styles.css.js';
import {styles as sharedElevationStyles} from './lib/shared-elevation-styles.css.js';
import {styles as sharedStyles} from './lib/shared-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-filled-link-button': MdFilledLinkButton;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-filled-link-button')
export class MdFilledLinkButton extends FilledLinkButton {
  static override styles = [sharedStyles, sharedElevationStyles, filledStyles];
}
