/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ClassInfo} from 'lit/directives/class-map.js';

import {FabShared} from './fab-shared.js';

/**
 * Fab Extended Base class logic and template definition
 * @soyCompatible
 */
export class Fab extends FabShared {
  /** @soyTemplate */
  protected override getRootClasses(): ClassInfo {
    return {
      ...super.getRootClasses(),
      'md3-fab--regular': true,
    };
  }
}
