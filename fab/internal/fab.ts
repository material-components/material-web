/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {property} from 'lit/decorators.js';

import {SharedFab} from './shared.js';

/**
 * The variants available to non-branded FABs.
 */
export type FabVariant = 'surface' | 'primary' | 'secondary' | 'tertiary';

// tslint:disable-next-line:enforce-comments-on-exported-symbols
export class Fab extends SharedFab {
  /**
   * The FAB color variant to render.
   */
  @property() variant: FabVariant = 'surface';

  protected override getRenderClasses() {
    return {
      ...super.getRenderClasses(),
      'primary': this.variant === 'primary',
      'secondary': this.variant === 'secondary',
      'tertiary': this.variant === 'tertiary',
    };
  }
}
