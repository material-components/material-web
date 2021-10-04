/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore

import {customElement} from 'lit/decorators.js';

import {styles as overlayStyles} from '../elevation/lib/elevation-overlay-styles.css';

import {Fab} from './lib/fab';
import {styles as sharedStyles} from './lib/fab-shared-styles.css';
import {styles} from './lib/fab-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'm3-fab': MDFab;
  }
}

@customElement('m3-fab')
class MDFab extends Fab {
  static styles = [overlayStyles, sharedStyles, styles];
}

export type{MDFab};