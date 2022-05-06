/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore


import {customElement} from 'lit/decorators.js';

import {MenuSurfaceBase} from './mwc-menu-surface-base.js';
import {styles} from './mwc-menu-surface.css.js';

export {MDCMenuDistance} from '@material/menu-surface/types.js';
export {Corner, MenuCorner} from './mwc-menu-surface-base.js';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-menu-surface': MenuSurface;
  }
}

@customElement('mwc-menu-surface')
export class MenuSurface extends MenuSurfaceBase {
  static override styles = [styles];
}
