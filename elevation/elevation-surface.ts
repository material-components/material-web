/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {styles} from './lib/elevation-styles.css.js';
import {ElevationSurface} from './lib/elevation-surface.js';
import {styles as surfaceStyles} from './lib/surface-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-elevation-surface': MdElevationSurface;
  }
}

/**
 * @deprecated An elevation component with a surface-tint. Will be removed
 * once components are updated.
 */
@customElement('md-elevation-surface')
export class MdElevationSurface extends ElevationSurface {
  static override styles = [styles, surfaceStyles];
}
