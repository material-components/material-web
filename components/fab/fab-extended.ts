/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators';

import {styles as overlayStyles} from '../elevation/lib/elevation-overlay-styles.css';

import {FabExtended} from './lib/fab-extended';
import {styles as extendedStyles} from './lib/fab-extended-styles.css';
import {styles as sharedStyles} from './lib/fab-shared-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'm3-fab-extended': MdFabExtended;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('m3-fab-extended')
export class MdFabExtended extends FabExtended {
  static override styles = [overlayStyles, sharedStyles, extendedStyles];
}
