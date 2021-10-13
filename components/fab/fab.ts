/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators';

import {styles as overlayStyles} from '../elevation/lib/elevation-overlay-styles.css';

import {Fab} from './lib/fab';
import {styles as sharedStyles} from './lib/fab-shared-styles.css';
import {styles as fabStyles} from './lib/fab-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'm3-fab': MdFab;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('m3-fab')
export class MdFab extends Fab {
  static override styles = [overlayStyles, sharedStyles, fabStyles];
}
