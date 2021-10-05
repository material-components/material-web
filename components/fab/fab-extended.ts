/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore

import {customElement} from 'lit/decorators.js';

import {styles as overlayStyles} from '../elevation/lib/elevation-overlay-styles.css';

import {FabExtended} from './lib/fab-extended';
import {styles} from './lib/fab-extended-styles.css';
import {styles as sharedStyles} from './lib/fab-shared-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'm3-fab-extended': MDFabExtended;
  }
}

@customElement('m3-fab-extended')
class MDFabExtended extends FabExtended {
  static styles = [overlayStyles, sharedStyles, styles];
}

export type{MDFabExtended};