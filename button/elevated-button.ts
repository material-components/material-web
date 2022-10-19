/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {styles as elevationOverlayStyles} from '../elevation/lib/elevation-overlay-styles.css.js';

import {ElevatedButton} from './lib/elevated-button.js';
import {styles as elevatedStyles} from './lib/elevated-styles.css.js';
import {styles as sharedElevationStyles} from './lib/shared-elevation-styles.css.js';
import {styles as sharedStyles} from './lib/shared-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-elevated-button': MdElevatedButton;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-elevated-button')
export class MdElevatedButton extends ElevatedButton {
  static override styles = [
    elevationOverlayStyles, sharedStyles, sharedElevationStyles, elevatedStyles
  ];
}
